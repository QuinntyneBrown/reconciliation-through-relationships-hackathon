import { test, expect } from "../support/fixtures";

test.describe("participant dashboard and profiles", () => {
  test.beforeEach(async ({ login }) => {
    await login.signInAs("participant");
  });

  test("recommendations show scoring, existing connection state, and profile navigation", async ({
    dashboard,
  }) => {
    await expect(dashboard.heading("Welcome, Avery")).toBeVisible();
    await expect(dashboard.page.getByText("Andrew Bright Star")).toBeVisible();
    await expect(dashboard.page.getByText("83%")).toBeVisible();
    await expect(dashboard.page.getByRole("link", { name: "Open chat" })).toBeVisible();
    await dashboard.page.getByRole("link", { name: "View profile" }).first().click();
    await expect(dashboard.page).toHaveURL(/\/profile\/indigenous-1$/);
  });

  test("participant search, province, background, faith, empty state, and map mode compose", async ({
    dashboard,
  }) => {
    await dashboard.openAllParticipants();
    await expect(dashboard.resultCount()).toHaveText("3 participants");
    await dashboard.search("beadwork");
    await expect(dashboard.resultCount()).toHaveText("1 participant");
    await expect(dashboard.page.getByText("Marie Whitecloud")).toBeVisible();
    await dashboard.search("");
    await dashboard.chooseFilter(0, "Saskatchewan");
    await dashboard.chooseFilter(1, "Indigenous");
    await dashboard.chooseFilter(2, "Indigenous Traditional");
    await expect(dashboard.resultCount()).toHaveText("2 participants");
    await dashboard.search("does-not-exist");
    await expect(dashboard.page.getByText("No participants match your filters.")).toBeVisible();
    await dashboard.search("");
    await dashboard.showMap();
    await expect(dashboard.page.getByText(/Only showing participants who consented/)).toBeVisible();
    await dashboard.showList();
    await expect(dashboard.page.getByText("Marie Whitecloud")).toBeVisible();
  });

  test("account menu opens the current profile and signs out", async ({ dashboard }) => {
    await dashboard.openAccountMenu();
    await expect(dashboard.page.getByRole("menuitem", { name: "My profile" })).toBeVisible();
    await dashboard.page.keyboard.press("Escape");
    await dashboard.page.goto("/profile/participant-user");
    await expect(dashboard.page).toHaveURL(/\/profile\/participant-user$/);
    await dashboard.page.goto("/dashboard");
    await dashboard.signOut();
    await expect(dashboard.page).toHaveURL(/\/$/);
  });

  test("an approved match without a connection can send a connection request", async ({
    dashboard,
    profile,
    backend,
  }) => {
    const state = await backend.state();
    await backend.configure({
      patch: {
        matches: [
          ...state.matches,
          {
            id: "match-connectable",
            indigenous_participant_id: "indigenous-2",
            non_indigenous_participant_id: "participant-user",
            match_score: 70,
            match_criteria: {},
            status: "approved",
            auto_generated: false,
            created_by: "facilitator-user",
            approved_by: "facilitator-user",
            approved_at: "2026-07-11T16:00:00.000Z",
            created_at: "2026-07-11T16:00:00.000Z",
          },
        ],
        connections: state.connections.filter((row) => row.participant_b_id !== "indigenous-2"),
      },
    });
    await dashboard.page.goto("/profile/indigenous-2");
    await profile.connectWith("Marie");
    await expect(profile.toast("Connection request sent to Marie!")).toBeVisible();
    const updated = await backend.state();
    expect(updated.connections).toContainEqual(
      expect.objectContaining({
        participant_a_id: "indigenous-2",
        participant_b_id: "participant-user",
      }),
    );
    expect(updated.notifications).toContainEqual(
      expect.objectContaining({ user_id: "indigenous-2", type: "connect_request" }),
    );
  });

  test("waitlist and no-recommendation states appear when no opposite-background match is ready", async ({
    dashboard,
    backend,
  }) => {
    const state = await backend.state();
    await backend.configure({
      patch: {
        profiles: state.profiles.map((row) =>
          row.is_indigenous ? { ...row, learning_completed: false } : row,
        ),
      },
    });
    await dashboard.page.goto("/dashboard");
    await expect(dashboard.page.getByText(/You're on the waitlist/)).toBeVisible();
    await expect(dashboard.page.getByText("No recommendations yet")).toBeVisible();
  });

  test("eligible elected leaders see the local cohort call to action", async ({
    dashboard,
    backend,
  }) => {
    const state = await backend.state();
    await backend.configure({
      patch: {
        profiles: state.profiles.map((row) =>
          ["learner-user", "non-indigenous-2"].includes(String(row.id))
            ? {
                ...row,
                city: "Regina",
                onboarding_completed: true,
                learning_completed: true,
              }
            : row,
        ),
      },
    });
    await dashboard.page.goto("/dashboard");
    await expect(
      dashboard.page.getByText(/A reconciliation cohort is forming in Regina/),
    ).toBeVisible();
    await expect(dashboard.page.getByRole("button", { name: "Create cohort" })).toBeVisible();
  });

  test("unmatched profiles explain that facilitator approval is pending", async ({ dashboard }) => {
    await dashboard.page.goto("/profile/non-indigenous-2");
    await expect(
      dashboard.page.getByRole("button", { name: "Awaiting facilitator match" }),
    ).toBeDisabled();
  });
});
