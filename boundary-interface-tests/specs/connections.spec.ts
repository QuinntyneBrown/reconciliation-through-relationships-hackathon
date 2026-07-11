import { test, expect } from "../support/fixtures";

test.describe("connections and conversations", () => {
  test.beforeEach(async ({ login }) => {
    await login.signInAs("participant");
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
