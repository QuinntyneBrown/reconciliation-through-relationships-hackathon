import { expect, test } from "@playwright/test";

import { FacilitatorPage } from "../pages/facilitator.page";
import { LoginPage } from "../pages/login.page";
import { SettingsPage } from "../pages/settings.page";

test.describe("facilitator workspace", () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).signIn("facilitator");
  });

  test("overview, participant table, and navigation expose operational state", async ({ page }) => {
    const facilitator = new FacilitatorPage(page);
    await facilitator.expectOverview();
    await page.getByRole("link", { name: "View all participants" }).click();
    await expect(page.getByRole("heading", { name: "Participants" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Avery Acceptance" })).toBeVisible();
    await expect(page.getByText("Ready", { exact: true }).first()).toBeVisible();
    await page.getByRole("link", { name: "Avery Acceptance" }).click();
    await expect(page.getByRole("heading", { name: "Avery Acceptance" })).toBeVisible();
  });

  test("facilitator creates, approves, rejects, and categorizes matches", async ({ page }) => {
    test.setTimeout(60_000);
    const facilitator = new FacilitatorPage(page);
    await facilitator.openMatching();

    const autoMatching = page.getByRole("switch", { name: "Auto-matching" });
    const startedChecked = await autoMatching.isChecked();
    await autoMatching.click();
    await expect(autoMatching).toBeChecked({ checked: !startedChecked });
    await autoMatching.click();
    await expect(autoMatching).toBeChecked({ checked: startedChecked });

    await facilitator.createManualMatch("Manual Indigenous", "Manual Neighbour");
    await expect(facilitator.matchCard("Manual Indigenous")).toBeVisible();

    const approvedCard = facilitator.matchCard("Approve Indigenous");
    await approvedCard.getByRole("button", { name: "Approve" }).click();
    await facilitator.expectToast("Match approved and participants notified.");

    const rejectedCard = facilitator.matchCard("Reject Indigenous");
    await rejectedCard.getByRole("button", { name: "Reject" }).click();
    await facilitator.expectToast("Match rejected.");

    await page.getByRole("tab", { name: /Approved/ }).click();
    await expect(facilitator.matchCard("Approve Indigenous")).toBeVisible();
    await page.getByRole("tab", { name: /Rejected/ }).click();
    await expect(facilitator.matchCard("Reject Indigenous")).toBeVisible();
  });

  test("platform settings persist matching and cohort controls", async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.open();
    const autoMatching = page.getByRole("switch");
    await autoMatching.click();
    await settings.saveThreshold("7");

    await page.reload();
    await expect(page.getByLabel("Cohort threshold")).toHaveValue("7");
    await expect(autoMatching).toBeChecked({ checked: false });

    await autoMatching.click();
    await settings.saveThreshold("5");
  });

  test("facilitator account menu signs out to the public landing page", async ({ page }) => {
    await page.getByRole("button", { name: "Open account menu" }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
