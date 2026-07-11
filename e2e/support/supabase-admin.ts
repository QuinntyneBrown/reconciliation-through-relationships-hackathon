import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "node:path";

import { TEST_PASSWORD, testUsers, type TestUserKey } from "./test-data";

dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env.local"), quiet: true });

type UserIds = Record<TestUserKey, string>;

const baseProfile = {
  bio: "A synthetic profile created only for Playwright acceptance testing.",
  additional_matching_info: "Acceptance test fixture",
  sex: "prefer_not_to_say",
  participation_categories: ["non_indigenous_individual"],
  city: "Ottawa",
  province: "Ontario",
  treaty_area: "Algonquin Anishinaabe Territory",
  faith_tradition: "christian",
  interests: ["playwright", "storytelling", "community"],
  availability: { days: ["Monday"], times: ["Evening (5pm–9pm)"] },
  participation_format: ["online"],
  language_preferences: ["english"],
  personal_boundaries: "Respectful conversation",
  matching_preferences: { weight_sex: false, weight_interests: true, weight_location: true },
  map_consent: true,
  lat: 45.4215,
  lng: -75.6972,
  onboarding_completed: true,
  learning_completed: true,
  role: "participant",
};

export function adminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Playwright acceptance tests require NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function allAuthUsers(client: SupabaseClient): Promise<User[]> {
  const users: User[] = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) return users;
  }
}

export async function findTestUserIds(client = adminClient()): Promise<Partial<UserIds>> {
  const wanted = new Map<string, TestUserKey>(
    Object.entries(testUsers).map(([key, user]) => [user.email, key as TestUserKey]),
  );
  const ids: Partial<UserIds> = {};
  for (const user of await allAuthUsers(client)) {
    const key = user.email ? wanted.get(user.email) : undefined;
    if (key) ids[key] = user.id;
  }
  return ids;
}

function idFilter(ids: string[]) {
  return `(${ids.join(",")})`;
}

export async function removeTestUsers(client = adminClient()) {
  const found = await findTestUserIds(client);
  const ids = Object.values(found);
  if (ids.length === 0) return;

  const inIds = idFilter(ids);
  const cleanup = [
    client.from("system_settings").update({ updated_by: null }).in("updated_by", ids),
    client.from("notifications").delete().in("user_id", ids),
    client.from("messages").delete().in("sender_id", ids),
    client.from("meetings").delete().in("created_by", ids),
    client.from("cohort_members").delete().in("participant_id", ids),
    client
      .from("connections")
      .delete()
      .or(`participant_a_id.in.${inIds},participant_b_id.in.${inIds}`),
    client
      .from("matches")
      .delete()
      .or(
        `indigenous_participant_id.in.${inIds},non_indigenous_participant_id.in.${inIds},created_by.in.${inIds},approved_by.in.${inIds}`,
      ),
    client.from("cohorts").delete().in("facilitator_id", ids),
    client.from("learning_progress").delete().in("user_id", ids),
  ];
  const results = await Promise.all(cleanup);
  const cleanupError = results.find((result) => result.error)?.error;
  if (cleanupError) throw cleanupError;

  for (const id of ids) {
    let lastError: unknown;
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      try {
        const { error } = await client.auth.admin.deleteUser(id);
        if (error) throw error;
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error;
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
    if (lastError) throw lastError;
  }
}

function profileFor(key: TestUserKey) {
  const user = testUsers[key];
  const overrides: Record<string, unknown> = {
    first_name: user.firstName,
    last_name: user.lastName,
  };

  if (key === "gateOnboarding" || key === "onboarding") {
    return {
      ...overrides,
      role: "participant",
      onboarding_completed: false,
      learning_completed: false,
    };
  }
  if (key === "gateLearner" || key === "learner") {
    return {
      ...baseProfile,
      ...overrides,
      learning_completed: false,
      is_indigenous: false,
    };
  }
  if (key === "facilitator") {
    return { ...baseProfile, ...overrides, role: "facilitator" };
  }

  const indigenous =
    (key.endsWith("Indigenous") && !key.endsWith("NonIndigenous")) ||
    key === "partner" ||
    key === "requester";
  return {
    ...baseProfile,
    ...overrides,
    is_indigenous: indigenous,
    participation_categories: [indigenous ? "indigenous_individual" : "non_indigenous_individual"],
    faith_tradition: key === "member" ? "buddhist" : "christian",
    city: key === "member" || key === "partner" ? "Acceptance Bay" : "Ottawa",
  };
}

export async function createTestFixtures() {
  const client = adminClient();
  await removeTestUsers(client);

  const ids = {} as UserIds;
  for (const [key, definition] of Object.entries(testUsers) as [
    TestUserKey,
    (typeof testUsers)[TestUserKey],
  ][]) {
    const { data, error } = await client.auth.admin.createUser({
      email: definition.email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { acceptance_test: true },
    });
    if (error || !data.user) throw error ?? new Error(`Could not create ${key}`);
    ids[key] = data.user.id;

    const { error: profileError } = await client
      .from("profiles")
      .update(profileFor(key))
      .eq("id", data.user.id);
    if (profileError) throw profileError;
  }

  const { data: activeMatch, error: activeMatchError } = await client
    .from("matches")
    .insert({
      indigenous_participant_id: ids.partner,
      non_indigenous_participant_id: ids.member,
      match_score: 92,
      match_criteria: { location: 30, interests: 30, format: 20, language: 12 },
      status: "connected",
      auto_generated: false,
      created_by: ids.facilitator,
      approved_by: ids.facilitator,
      approved_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (activeMatchError) throw activeMatchError;

  const { data: activeConnection, error: activeConnectionError } = await client
    .from("connections")
    .insert({
      match_id: activeMatch.id,
      participant_a_id: ids.member,
      participant_b_id: ids.partner,
      participant_a_connected: true,
      participant_b_connected: true,
      status: "active",
      connected_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (activeConnectionError) throw activeConnectionError;

  const { error: messageError } = await client.from("messages").insert({
    connection_id: activeConnection.id,
    sender_id: ids.partner,
    content: "Welcome from the acceptance-test partner.",
  });
  if (messageError) throw messageError;

  const { data: pendingMatch, error: pendingMatchError } = await client
    .from("matches")
    .insert({
      indigenous_participant_id: ids.requester,
      non_indigenous_participant_id: ids.accepter,
      match_score: 88,
      match_criteria: { location: 30, interests: 25, format: 20, language: 13 },
      status: "approved",
      auto_generated: false,
      created_by: ids.facilitator,
      approved_by: ids.facilitator,
      approved_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (pendingMatchError) throw pendingMatchError;

  const { error: pendingConnectionError } = await client.from("connections").insert({
    match_id: pendingMatch.id,
    participant_a_id: ids.requester,
    participant_b_id: ids.accepter,
    participant_a_connected: true,
    participant_b_connected: false,
    status: "pending",
  });
  if (pendingConnectionError) throw pendingConnectionError;

  // `connectTargetIndigenous` is intentionally left with no match and no
  // connection to the member — the state a peer-to-peer connection request
  // starts from. It exercises the connections INSERT RLS policy for a
  // participant-initiated request.

  for (const [indigenousKey, nonIndigenousKey] of [
    ["approveIndigenous", "approveNonIndigenous"],
    ["rejectIndigenous", "rejectNonIndigenous"],
  ] as const) {
    const { error } = await client.from("matches").insert({
      indigenous_participant_id: ids[indigenousKey],
      non_indigenous_participant_id: ids[nonIndigenousKey],
      match_score: 81,
      match_criteria: { location: 30, interests: 20, format: 20, language: 11 },
      status: "suggested",
      auto_generated: false,
      created_by: ids.facilitator,
    });
    if (error) throw error;
  }
}

export async function fixtureIds(): Promise<UserIds> {
  const ids = await findTestUserIds();
  for (const key of Object.keys(testUsers) as TestUserKey[]) {
    if (!ids[key]) throw new Error(`Acceptance fixture ${key} is missing`);
  }
  return ids as UserIds;
}

export async function fixtureConnectionId(participantId: string): Promise<string> {
  const { data, error } = await adminClient()
    .from("connections")
    .select("id")
    .or(`participant_a_id.eq.${participantId},participant_b_id.eq.${participantId}`)
    .single();
  if (error || !data) throw error ?? new Error("Fixture connection is missing");
  return data.id;
}
