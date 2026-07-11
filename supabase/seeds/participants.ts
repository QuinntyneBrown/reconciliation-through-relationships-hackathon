/**
 * Seed script — creates synthetic participants for RTR demo.
 * Run with: npx tsx supabase/seeds/participants.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// Canadian city geocoordinates (city-level)
const CITIES: Record<string, { lat: number; lng: number; province: string }> = {
  Toronto: { lat: 43.65, lng: -79.38, province: "Ontario" },
  Ottawa: { lat: 45.42, lng: -75.69, province: "Ontario" },
  Winnipeg: { lat: 49.89, lng: -97.14, province: "Manitoba" },
  Saskatoon: { lat: 52.13, lng: -106.67, province: "Saskatchewan" },
  Edmonton: { lat: 53.54, lng: -113.49, province: "Alberta" },
  Calgary: { lat: 51.04, lng: -114.07, province: "Alberta" },
  Vancouver: { lat: 49.24, lng: -123.11, province: "British Columbia" },
  Halifax: { lat: 44.64, lng: -63.58, province: "Nova Scotia" },
  Regina: { lat: 50.45, lng: -104.61, province: "Saskatchewan" },
  Thunder_Bay: { lat: 48.38, lng: -89.25, province: "Ontario" },
};

const INTERESTS = [
  ["hiking", "storytelling", "music"],
  ["gardening", "cooking", "community"],
  ["art", "photography", "nature"],
  ["reading", "history", "language"],
  ["sports", "fitness", "outdoors"],
  ["theatre", "film", "writing"],
  ["education", "youth", "mentoring"],
  ["faith", "prayer", "service"],
];

const TREATY_AREAS: Record<string, string> = {
  Ontario: "Williams Treaties Territory",
  Manitoba: "Treaty 1 Territory",
  Saskatchewan: "Treaty 4 Territory",
  Alberta: "Treaty 6 Territory",
  "British Columbia": "Unceded Coast Salish Territory",
  "Nova Scotia": "Peace and Friendship Treaties Territory",
};

type ParticipantDef = {
  email: string;
  first_name: string;
  last_name: string;
  is_indigenous: boolean;
  city: string;
  bio: string;
  participation_categories: string[];
  faith_tradition: string;
  interests: string[];
  participation_format: string[];
  language_preferences: string[];
};

const PARTICIPANTS: ParticipantDef[] = [
  // Indigenous participants (15)
  {
    email: "mary.fineday@rtr-demo.ca",
    first_name: "Mary",
    last_name: "Fineday",
    is_indigenous: true,
    city: "Saskatoon",
    bio: "Cree woman, educator, and storyteller.",
    participation_categories: ["indigenous_leader"],
    faith_tradition: "indigenous_traditional",
    interests: INTERESTS[0],
    participation_format: ["in_person", "online"],
    language_preferences: ["english"],
  },
  {
    email: "james.beardy@rtr-demo.ca",
    first_name: "James",
    last_name: "Beardy",
    is_indigenous: true,
    city: "Winnipeg",
    bio: "Ojibwe artist and youth advocate.",
    participation_categories: ["indigenous_individual", "artist"],
    faith_tradition: "indigenous_traditional",
    interests: INTERESTS[2],
    participation_format: ["online"],
    language_preferences: ["english"],
  },
  {
    email: "sarah.crow@rtr-demo.ca",
    first_name: "Sarah",
    last_name: "Crow Eagle",
    is_indigenous: true,
    city: "Calgary",
    bio: "Siksika Nation member, nurse, and community organizer.",
    participation_categories: ["indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[4],
    participation_format: ["in_person", "online"],
    language_preferences: ["english"],
  },
  {
    email: "thomas.clearsky@rtr-demo.ca",
    first_name: "Thomas",
    last_name: "Clearsky",
    is_indigenous: true,
    city: "Edmonton",
    bio: "Métis entrepreneur and reconciliation advocate.",
    participation_categories: ["indigenous_leader", "elected_leader"],
    faith_tradition: "christian",
    interests: INTERESTS[6],
    participation_format: ["online"],
    language_preferences: ["english", "french"],
  },
  {
    email: "linda.swifthawk@rtr-demo.ca",
    first_name: "Linda",
    last_name: "Swifthawk",
    is_indigenous: true,
    city: "Regina",
    bio: "Lakota elder and traditional knowledge keeper.",
    participation_categories: ["indigenous_leader"],
    faith_tradition: "indigenous_traditional",
    interests: INTERESTS[3],
    participation_format: ["in_person"],
    language_preferences: ["english"],
  },
  {
    email: "david.lightning@rtr-demo.ca",
    first_name: "David",
    last_name: "Lightning",
    is_indigenous: true,
    city: "Toronto",
    bio: "Cree law student and human rights advocate.",
    participation_categories: ["indigenous_individual"],
    faith_tradition: "prefer_not_to_say",
    interests: INTERESTS[1],
    participation_format: ["online", "chat_only"],
    language_preferences: ["english", "french"],
  },
  {
    email: "rachel.bigcrow@rtr-demo.ca",
    first_name: "Rachel",
    last_name: "Bigcrow",
    is_indigenous: true,
    city: "Vancouver",
    bio: "Haida artist and cultural educator.",
    participation_categories: ["indigenous_individual", "artist"],
    faith_tradition: "indigenous_traditional",
    interests: INTERESTS[5],
    participation_format: ["online"],
    language_preferences: ["english"],
  },
  {
    email: "marcus.whitehorse@rtr-demo.ca",
    first_name: "Marcus",
    last_name: "Whitehorse",
    is_indigenous: true,
    city: "Ottawa",
    bio: "Anishinaabe policy analyst and father.",
    participation_categories: ["indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[7],
    participation_format: ["online", "in_person"],
    language_preferences: ["english", "french"],
  },
  {
    email: "anne.thunderbird@rtr-demo.ca",
    first_name: "Anne",
    last_name: "Thunderbird",
    is_indigenous: true,
    city: "Winnipeg",
    bio: "Dakota woman, social worker, and community healer.",
    participation_categories: ["indigenous_individual"],
    faith_tradition: "indigenous_traditional",
    interests: INTERESTS[4],
    participation_format: ["in_person"],
    language_preferences: ["english"],
  },
  {
    email: "eric.redcloud@rtr-demo.ca",
    first_name: "Eric",
    last_name: "Redcloud",
    is_indigenous: true,
    city: "Thunder_Bay",
    bio: "Nakoda youth worker and hockey coach.",
    participation_categories: ["indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[4],
    participation_format: ["in_person", "online"],
    language_preferences: ["english"],
  },
  {
    email: "helen.ironstar@rtr-demo.ca",
    first_name: "Helen",
    last_name: "Ironstar",
    is_indigenous: true,
    city: "Calgary",
    bio: "Blackfoot poet and residential school survivor advocate.",
    participation_categories: ["indigenous_leader", "artist"],
    faith_tradition: "indigenous_traditional",
    interests: INTERESTS[5],
    participation_format: ["online"],
    language_preferences: ["english"],
  },
  {
    email: "joseph.running@rtr-demo.ca",
    first_name: "Joseph",
    last_name: "Running Bird",
    is_indigenous: true,
    city: "Saskatoon",
    bio: "Cree teacher and language revitalization worker.",
    participation_categories: ["indigenous_individual"],
    faith_tradition: "indigenous_traditional",
    interests: INTERESTS[3],
    participation_format: ["in_person", "online"],
    language_preferences: ["english"],
  },
  {
    email: "carol.daystar@rtr-demo.ca",
    first_name: "Carol",
    last_name: "Daystar",
    is_indigenous: true,
    city: "Edmonton",
    bio: "Métis midwife and women's health advocate.",
    participation_categories: ["indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[1],
    participation_format: ["online", "chat_only"],
    language_preferences: ["english"],
  },
  {
    email: "paul.moonias@rtr-demo.ca",
    first_name: "Paul",
    last_name: "Moonias",
    is_indigenous: true,
    city: "Halifax",
    bio: "Mi'kmaw fisherman and treaty rights advocate.",
    participation_categories: ["indigenous_individual", "elected_leader"],
    faith_tradition: "indigenous_traditional",
    interests: INTERESTS[4],
    participation_format: ["in_person"],
    language_preferences: ["english"],
  },
  {
    email: "donna.starchief@rtr-demo.ca",
    first_name: "Donna",
    last_name: "Starchief",
    is_indigenous: true,
    city: "Regina",
    bio: "Saulteaux social entrepreneur and community builder.",
    participation_categories: ["indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[6],
    participation_format: ["online", "in_person"],
    language_preferences: ["english"],
  },

  // Non-Indigenous participants (15)
  {
    email: "michael.chen@rtr-demo.ca",
    first_name: "Michael",
    last_name: "Chen",
    is_indigenous: false,
    city: "Toronto",
    bio: "Software engineer and father of two, committed to learning.",
    participation_categories: ["non_indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[0],
    participation_format: ["online", "chat_only"],
    language_preferences: ["english"],
  },
  {
    email: "jennifer.martin@rtr-demo.ca",
    first_name: "Jennifer",
    last_name: "Martin",
    is_indigenous: false,
    city: "Ottawa",
    bio: "Federal public servant, exploring reconciliation since reading Calls to Action.",
    participation_categories: ["non_indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[3],
    participation_format: ["online"],
    language_preferences: ["english", "french"],
  },
  {
    email: "robert.tremblay@rtr-demo.ca",
    first_name: "Robert",
    last_name: "Tremblay",
    is_indigenous: false,
    city: "Winnipeg",
    bio: "Teacher and pastor, part of an EFC-affiliated church.",
    participation_categories: ["non_indigenous_individual", "religious_leader"],
    faith_tradition: "christian",
    interests: INTERESTS[7],
    participation_format: ["in_person", "online"],
    language_preferences: ["english", "french"],
  },
  {
    email: "susan.walker@rtr-demo.ca",
    first_name: "Susan",
    last_name: "Walker",
    is_indigenous: false,
    city: "Calgary",
    bio: "Retired nurse looking to give back and learn.",
    participation_categories: ["non_indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[1],
    participation_format: ["in_person", "online"],
    language_preferences: ["english"],
  },
  {
    email: "david.nguyen@rtr-demo.ca",
    first_name: "David",
    last_name: "Nguyen",
    is_indigenous: false,
    city: "Vancouver",
    bio: "Business owner and civic volunteer.",
    participation_categories: ["non_indigenous_individual"],
    faith_tradition: "buddhist",
    interests: INTERESTS[6],
    participation_format: ["online"],
    language_preferences: ["english"],
  },
  {
    email: "lisa.mackay@rtr-demo.ca",
    first_name: "Lisa",
    last_name: "MacKay",
    is_indigenous: false,
    city: "Saskatoon",
    bio: "University professor of Canadian history.",
    participation_categories: ["non_indigenous_individual"],
    faith_tradition: "prefer_not_to_say",
    interests: INTERESTS[3],
    participation_format: ["in_person", "online"],
    language_preferences: ["english"],
  },
  {
    email: "peter.schmidt@rtr-demo.ca",
    first_name: "Peter",
    last_name: "Schmidt",
    is_indigenous: false,
    city: "Edmonton",
    bio: "Lutheran pastor, committed to the Calls to Action.",
    participation_categories: ["religious_leader", "non_indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[7],
    participation_format: ["in_person", "online"],
    language_preferences: ["english"],
  },
  {
    email: "margaret.osei@rtr-demo.ca",
    first_name: "Margaret",
    last_name: "Osei",
    is_indigenous: false,
    city: "Toronto",
    bio: "Social worker and newcomer to Canada from Ghana.",
    participation_categories: ["non_indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[6],
    participation_format: ["online", "chat_only"],
    language_preferences: ["english"],
  },
  {
    email: "andrew.leblanc@rtr-demo.ca",
    first_name: "Andrew",
    last_name: "LeBlanc",
    is_indigenous: false,
    city: "Halifax",
    bio: "Acadian fisherman and local elected councillor.",
    participation_categories: ["elected_leader", "non_indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[4],
    participation_format: ["in_person"],
    language_preferences: ["english", "french"],
  },
  {
    email: "catherine.park@rtr-demo.ca",
    first_name: "Catherine",
    last_name: "Park",
    is_indigenous: false,
    city: "Winnipeg",
    bio: "Hospital chaplain and artist.",
    participation_categories: ["non_indigenous_individual", "religious_leader"],
    faith_tradition: "christian",
    interests: INTERESTS[2],
    participation_format: ["online", "in_person"],
    language_preferences: ["english"],
  },
  {
    email: "timothy.ross@rtr-demo.ca",
    first_name: "Timothy",
    last_name: "Ross",
    is_indigenous: false,
    city: "Regina",
    bio: "Prairie farmer, third generation, learning about treaty history.",
    participation_categories: ["non_indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[0],
    participation_format: ["in_person"],
    language_preferences: ["english"],
  },
  {
    email: "eleanor.jackson@rtr-demo.ca",
    first_name: "Eleanor",
    last_name: "Jackson",
    is_indigenous: false,
    city: "Ottawa",
    bio: "Senator's aide and policy researcher.",
    participation_categories: ["elected_leader", "non_indigenous_individual"],
    faith_tradition: "prefer_not_to_say",
    interests: INTERESTS[3],
    participation_format: ["online"],
    language_preferences: ["english", "french"],
  },
  {
    email: "stephen.ford@rtr-demo.ca",
    first_name: "Stephen",
    last_name: "Ford",
    is_indigenous: false,
    city: "Thunder_Bay",
    bio: "High school principal working with Indigenous students.",
    participation_categories: ["non_indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[6],
    participation_format: ["in_person", "online"],
    language_preferences: ["english"],
  },
  {
    email: "francoise.dupont@rtr-demo.ca",
    first_name: "Françoise",
    last_name: "Dupont",
    is_indigenous: false,
    city: "Ottawa",
    bio: "Francophone journalist covering Indigenous affairs.",
    participation_categories: ["non_indigenous_individual"],
    faith_tradition: "christian",
    interests: INTERESTS[5],
    participation_format: ["online", "chat_only"],
    language_preferences: ["english", "french"],
  },
  {
    email: "george.abramowitz@rtr-demo.ca",
    first_name: "George",
    last_name: "Abramowitz",
    is_indigenous: false,
    city: "Toronto",
    bio: "Rabbi working on interfaith reconciliation initiatives.",
    participation_categories: ["religious_leader", "non_indigenous_individual"],
    faith_tradition: "jewish",
    interests: INTERESTS[7],
    participation_format: ["online", "in_person"],
    language_preferences: ["english"],
  },
];

// 2 facilitators
const FACILITATORS = [
  { email: "facilitator@rtr-demo.ca", first_name: "Joel", last_name: "Gordon" },
  { email: "admin@rtr-demo.ca", first_name: "Andrew", last_name: "Russell" },
];

async function seedUser(
  email: string,
  data: Record<string, unknown>,
  role: "participant" | "facilitator",
) {
  let userId: string;

  // Create auth user
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { role },
  });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers({
        perPage: 1000,
      });
      const existingUser = existingUsers?.users.find((user) => user.email === email);

      if (listError || !existingUser) {
        console.error(`  ✗ Could not load existing user ${email}`);
        return;
      }

      userId = existingUser.id;
    } else {
      console.error(`  ✗ ${email}:`, authError.message);
      return;
    }
  } else {
    userId = authUser.user!.id;
  }

  // Update profile
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role, ...data })
    .eq("id", userId);

  if (profileError) {
    console.error(`  ✗ Profile for ${email}:`, profileError.message);
  } else {
    console.log(`  ✓ ${email}`);
  }
}

async function main() {
  console.log("Seeding facilitators…");
  for (const f of FACILITATORS) {
    await seedUser(
      f.email,
      {
        first_name: f.first_name,
        last_name: f.last_name,
        onboarding_completed: true,
        learning_completed: true,
      },
      "facilitator",
    );
  }

  console.log("\nSeeding participants…");
  for (const p of PARTICIPANTS) {
    const cityKey = p.city.replace(" ", "_");
    const cityData = CITIES[cityKey] ?? CITIES[p.city];
    await seedUser(
      p.email,
      {
        first_name: p.first_name,
        last_name: p.last_name,
        bio: p.bio,
        is_indigenous: p.is_indigenous,
        sex: Math.random() > 0.5 ? "female" : "male",
        participation_categories: p.participation_categories,
        city: p.city.replace("_", " "),
        province: cityData?.province ?? "Ontario",
        treaty_area: TREATY_AREAS[cityData?.province ?? "Ontario"] ?? "Treaty Territory",
        faith_tradition: p.faith_tradition,
        interests: p.interests,
        availability: {
          days: ["Monday", "Wednesday", "Saturday"].slice(0, 2 + Math.floor(Math.random() * 2)),
          times: ["Evening (5pm–9pm)"],
        },
        participation_format: p.participation_format,
        language_preferences: p.language_preferences,
        matching_preferences: { weight_sex: false, weight_interests: true, weight_location: true },
        map_consent: true,
        lat: cityData?.lat ?? 45.42,
        lng: cityData?.lng ?? -75.69,
        onboarding_completed: true,
        learning_completed: true,
      },
      "participant",
    );
  }

  console.log("\n✅ Seed complete.");
}

main().catch(console.error);
