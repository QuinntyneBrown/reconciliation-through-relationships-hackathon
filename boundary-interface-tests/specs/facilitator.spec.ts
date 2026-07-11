import { test, expect } from "../support/fixtures";

test.describe("facilitator workspace", () => {
  test.beforeEach(async ({ login }) => {
    await login.signInAs("facilitator");
  });

  test("overview reports backend counts and quick actions navigate", async ({ facilitator }) => {
    await expect(facilitator.heading("Community overview")).toBeVisible();
    await expect(facilitator.page.getByText("Total participants")).toBeVisible();
    await facilitator.page.getByRole("link", { name: /Pending matches/ }).click();
    await expect(facilitator.page).toHaveURL(/\/facilitator\/matching$/);
  });

  test("participants table presents every journey state and opens a participant", async ({
    facilitator,
  }) => {
    await facilitator.page.goto("/facilitator/participants");
    await expect(facilitator.heading("Participants")).toBeVisible();
    await expect(facilitator.page.getByText("Ready", { exact: true }).first()).toBeVisible();
    await expect(facilitator.page.getByText("Learning", { exact: true })).toBeVisible();
    await expect(facilitator.page.getByText("Onboarding", { exact: true })).toBeVisible();
    await facilitator.page.getByRole("link", { name: "Andrew Bright Star" }).click();
    await expect(facilitator.page).toHaveURL(/\/profile\/indigenous-1$/);
  });

  test("match management toggles automation, creates, approves, and rejects matches", async ({
    facilitator,
    backend,
  }) => {
    await facilitator.page.goto("/facilitator/matching");
    await facilitator.toggleAutoMatching();
    await facilitator.chooseManualParticipants("Marie Whitecloud", "David Okafor");
    await facilitator.createMatch();
    await expect(facilitator.toast("Manual match created.")).toBeVisible();
    await facilitator.approveFirst();
    await expect(facilitator.toast("Match approved and participants notified.")).toBeVisible();
    await facilitator.approveFirst();
    await expect(facilitator.toast("Match approved and participants notified.")).toBeVisible();

    const state = await backend.state();
    expect(state.system_settings.find((row) => row.key === "auto_matching_enabled")?.value).toBe(
      false,
    );
    expect(state.connections.length).toBeGreaterThan(2);
    expect(state.notifications.filter((row) => row.type === "match_approved")).toHaveLength(4);
  });

  test("rejection moves a match to the rejected tab", async ({ facilitator }) => {
    await facilitator.page.goto("/facilitator/matching");
    await facilitator.rejectFirst();
    await expect(facilitator.toast("Match rejected.")).toBeVisible();
    await facilitator.openMatchesTab("Rejected");
    await expect(facilitator.page.getByText("Andrew Bright Star")).toBeVisible();
  });

  test("settings save both matching and cohort values and report failures", async ({
    facilitator,
    backend,
  }) => {
    await facilitator.page.goto("/facilitator/settings");
    await facilitator.saveSettings("7");
    await expect(facilitator.toast("Settings saved.")).toBeVisible();
    const state = await backend.state();
    expect(state.system_settings.find((row) => row.key === "auto_matching_enabled")?.value).toBe(
      false,
    );
    expect(state.system_settings.find((row) => row.key === "cohort_threshold")?.value).toBe(7);

    await backend.configure({ failures: [{ table: "system_settings", method: "POST" }] });
    await facilitator.page.getByRole("button", { name: "Save settings" }).click();
    await expect(facilitator.toast("Failed to save settings.")).toBeVisible();
  });

  test("participant accounts cannot enter facilitator routes", async ({ facilitator, login }) => {
    await facilitator.page.context().clearCookies();
    await login.signInAs("participant");
    await facilitator.page.goto("/facilitator");
    await expect(facilitator.page).toHaveURL(/\/dashboard$/);
  });

  test("facilitators can sign out from their account menu", async ({ facilitator }) => {
    await facilitator.page.getByRole("button", { name: "Open account menu" }).click();
    await facilitator.page.getByRole("menuitem", { name: "Sign out" }).click();
    await expect(facilitator.page).toHaveURL(/\/$/);
  });
});
