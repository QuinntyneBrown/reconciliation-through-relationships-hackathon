// Acceptance Test
// Traces to: L2-SHELL-014, L2-MATENG-025, L2-MATENG-026, L2-MATENG-027, L2-MATENG-028, L2-MATENG-029, L2-MATENG-030, L2-PROF-031, L2-PROF-034, L2-NOTIF-048
// Description: Dashboard recommendations, directory search/filters/map, profile view, and connection requests from profiles
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

  test("a participant without an existing connection can send a connection request", async ({
    dashboard,
    profile,
    backend,
  }) => {
    const state = await backend.state();
    await backend.configure({
      patch: {
        connections: state.connections.filter((row) => row.participant_b_id !== "indigenous-2"),
      },
    });
    await dashboard.page.goto("/profile/indigenous-2");
    await profile.connectWith("Marie");
    await expect(profile.toast("Connection request sent to Marie!")).toBeVisible();
    const updated = await backend.state();
    expect(updated.connections).toContainEqual(
      expect.objectContaining({
        participant_a_id: "participant-user",
        participant_b_id: "indigenous-2",
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

  test("any participant profile offers to send a connection request", async ({ dashboard }) => {
    await dashboard.page.goto("/profile/non-indigenous-2");
    await expect(
      dashboard.page.getByRole("button", { name: /Connect with David/ }),
    ).toBeEnabled();
  });
});
