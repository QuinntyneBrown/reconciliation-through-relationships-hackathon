// Acceptance Test
// Traces to: L2-034, L2-035, L2-036, L2-037, L2-038, L2-039, L2-041, L2-043, L2-044, L2-045, L2-046, L2-048
// Description: Peer connection requests, mutual consent, chat messaging, and the Zoom scheduling contract
import { test, expect } from "../support/fixtures";

test.describe("connections and conversations", () => {
  test.beforeEach(async ({ login }) => {
    await login.signInAs("participant");
  });

  test("a connection request from a profile needs no facilitator match and reaches both people", async ({
    profile,
    connections,
    backend,
  }) => {
    // No match and no existing connection between Avery and Andrew.
    await backend.configure({ patch: { connections: [], matches: [] } });

    await profile.page.goto("/profile/indigenous-1");
    await profile.connectWith("Andrew");
    await expect(profile.toast(/Connection request sent to Andrew/)).toBeVisible();

    // The button reflects the pending state without a reload.
    await expect(profile.page.getByRole("button", { name: /Request pending/ })).toBeVisible();

    // Outbound: the sender sees the pending request in their own connections.
    await connections.page.goto("/connections");
    await expect(connections.page.getByText("Andrew Bright Star")).toBeVisible();
    await expect(connections.page.getByText("Pending", { exact: true })).toBeVisible();

    // The persisted row names both people, so the partner's (symmetric)
    // connections query surfaces the same pending request for them too.
    const state = await backend.state();
    expect(state.connections).toContainEqual(
      expect.objectContaining({
        participant_a_id: "participant-user",
        participant_b_id: "indigenous-1",
        status: "pending",
      }),
    );
  });

  test("a sent connection request can be cancelled", async ({ profile, backend }) => {
    await backend.configure({ patch: { connections: [], matches: [] } });

    await profile.page.goto("/profile/indigenous-1");
    await profile.connectWith("Andrew");
    await expect(profile.page.getByRole("button", { name: /Request pending/ })).toBeVisible();

    await profile.page.getByRole("button", { name: /Cancel/ }).click();
    await expect(profile.toast(/cancelled/i)).toBeVisible();

    // The request is gone and the profile offers to connect again.
    await expect(profile.page.getByRole("button", { name: /Connect with Andrew/ })).toBeVisible();
    const state = await backend.state();
    expect(state.connections).toHaveLength(0);
  });

  test("a rejected connection request surfaces an error instead of false success", async ({
    profile,
    backend,
  }) => {
    await backend.configure({
      patch: { connections: [], matches: [] },
      failures: [{ table: "connections", method: "POST" }],
    });

    await profile.page.goto("/profile/indigenous-1");
    await profile.connectWith("Andrew");

    await expect(profile.toast(/couldn.t send|could not send|try again/i)).toBeVisible();
    await expect(profile.toast(/Connection request sent/)).toHaveCount(0);
  });

  test("connection list shows active and pending relationships and opens a conversation", async ({
    connections,
  }) => {
    await connections.page.goto("/connections");
    await expect(connections.heading("My connections")).toBeVisible();
    await expect(connections.page.getByText("Active", { exact: true })).toBeVisible();
    await expect(connections.page.getByText("Pending", { exact: true })).toBeVisible();
    await connections.open("Andrew Bright Star");
    await expect(connections.page).toHaveURL(/\/connections\/connection-active$/);
  });

  test("an empty connections list leads back to recommendations", async ({
    connections,
    backend,
  }) => {
    await backend.configure({ patch: { connections: [] } });
    await connections.page.goto("/connections");
    await expect(connections.page.getByText("No active connections yet")).toBeVisible();
    await connections.page.getByRole("link", { name: "Explore recommendations" }).click();
    await expect(connections.page).toHaveURL(/\/dashboard$/);
  });

  test("a pending participant accepts and activates chat when the partner already accepted", async ({
    chat,
    backend,
  }) => {
    await chat.page.goto("/connections/connection-pending");
    await expect(chat.page.getByPlaceholder("Connect first to start chatting")).toBeDisabled();
    await chat.accept("Marie");
    await chat.page.reload();
    await expect(chat.page.getByPlaceholder("Type a message…")).toBeEnabled();
    const state = await backend.state();
    expect(state.connections.find((row) => row.id === "connection-pending")).toMatchObject({
      participant_a_connected: true,
      participant_b_connected: true,
      status: "active",
    });
  });

  test("active chat renders message history and sends trimmed text", async ({ chat, backend }) => {
    await chat.page.goto("/connections/connection-active");
    await expect(chat.page.getByText("Hello Avery, I am glad we were introduced.")).toBeVisible();
    await chat.sendMessage("  Thank you for the conversation.  ");
    await expect(chat.page.getByPlaceholder("Type a message…")).toHaveValue("");
    const state = await backend.state();
    expect(state.messages).toContainEqual(
      expect.objectContaining({
        connection_id: "connection-active",
        sender_id: "participant-user",
        content: "Thank you for the conversation.",
      }),
    );
  });

  test("scheduling validates required fields, handles backend errors, and adds a successful call", async ({
    chat,
  }) => {
    await chat.page.goto("/connections/connection-active");
    await chat.openScheduler();
    await chat.page.getByRole("dialog").getByRole("button", { name: "Cancel" }).click();
    await expect(chat.page.getByRole("dialog")).toBeHidden();
    await chat.openScheduler();
    await chat.page.getByRole("dialog").getByRole("button", { name: "Schedule call" }).click();
    await expect(chat.toast("Please select a date and time.")).toBeVisible();

    let calls = 0;
    await chat.page.route("**/api/zoom/create-meeting", async (route) => {
      calls += 1;
      if (calls === 1) {
        await route.fulfill({
          status: 502,
          contentType: "application/json",
          body: JSON.stringify({ error: "Zoom is unavailable" }),
        });
        return;
      }
      const payload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "meeting-test",
          connection_id: payload.connectionId,
          zoom_meeting_id: "123",
          zoom_join_url: "https://zoom.example.test/join",
          zoom_start_url: "https://zoom.example.test/start",
          scheduled_at: payload.scheduledAt,
          duration_minutes: payload.durationMinutes,
          topic: payload.topic,
          created_by: "participant-user",
          created_at: "2026-07-11T16:00:00.000Z",
        }),
      });
    });

    await chat.schedule("2026-07-20", "14:30", "1.5 hours", "Relationship check-in");
    await expect(chat.toast("Zoom is unavailable")).toBeVisible();
    await chat.page.getByRole("dialog").getByRole("button", { name: "Schedule call" }).click();
    await expect(
      chat.toast("Meeting scheduled! Both participants have been notified."),
    ).toBeVisible();
    await expect(chat.page.getByRole("link", { name: "Join Zoom" })).toBeVisible();
  });
});
