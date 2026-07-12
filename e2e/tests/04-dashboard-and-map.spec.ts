// Acceptance Test
// Traces to: L2-025, L2-028, L2-029, L2-031, L2-033, L2-051, L2-052
// Description: Dashboard recommendations, directory filters and map consent, profiles, and regional map counts against real Supabase
import { expect, test } from "@playwright/test";

import { DashboardPage } from "../pages/dashboard.page";
import { LoginPage } from "../pages/login.page";
import { ProfilePage } from "../pages/profile.page";
import { RegionalMapPage } from "../pages/regional-map.page";
import { fixtureIds } from "../support/supabase-admin";

test.describe("participant discovery", () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).signIn("member");
  });

  test("dashboard shows facilitator-reviewed recommendations and profile details", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.expectWelcome("Avery");
    await expect(page.getByText("Iris Acceptance", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Open chat" })).toBeVisible();

    await page
      .locator('[data-slot="card"]')
      .filter({ hasText: "Iris Acceptance" })
      .getByRole("link", { name: "View profile" })
      .click();
    const profile = new ProfilePage(page);
    await profile.expectProfile("Iris Acceptance");
    await expect(page.getByText("Acceptance Bay, Ontario", { exact: true })).toBeVisible();
    await expect(page.getByText("playwright", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Open chat" })).toBeVisible();
  });

  test("all-participant controls combine search, dropdown filters, and map consent", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.openAllParticipants();
    await dashboard.search("Iris Acceptance");
    await expect(page.getByText("1 participant", { exact: true })).toBeVisible();
    await expect(page.getByText("Iris Acceptance", { exact: true })).toBeVisible();

    await dashboard.chooseFilter(0, "Ontario");
    await dashboard.chooseFilter(1, "Indigenous");
    await dashboard.chooseFilter(2, "Christian");
    await expect(page.getByText("1 participant", { exact: true })).toBeVisible();

    await dashboard.showMap();
    await expect(page.getByText("Indigenous participant", { exact: true })).toBeVisible();

    await dashboard.search("no matching acceptance participant");
    await expect(
      page.getByText("No participants have consented to map display in this view."),
    ).toBeVisible();
    await page.getByRole("button", { name: "List", exact: true }).click();
    await expect(page.getByText("No participants match your filters.")).toBeVisible();
  });

  test("regional map aggregates only completed and consenting mock participants", async ({
    page,
  }) => {
    const regionalMap = new RegionalMapPage(page);
    await regionalMap.open();
    await expect(page.getByText("8 consenting participants across 2 regions.")).toBeVisible();

    const regina = page.locator('[data-slot="card"]').filter({ hasText: "Regina, SK" });
    await expect(regina.getByText("6 eligible participants")).toBeVisible();
    await expect(regina.getByText("Ready to gather")).toBeVisible();

    const saskatoon = page.locator('[data-slot="card"]').filter({ hasText: "Saskatoon, SK" });
    await expect(saskatoon.getByText("2 eligible participants")).toBeVisible();
    await expect(saskatoon.getByText("3 seats remaining")).toBeVisible();
  });

  test("my-profile shortcut resolves to the signed-in participant", async ({ page }) => {
    const ids = await fixtureIds();
    await page.goto("/profile/me");
    await expect(page).toHaveURL(new RegExp(`/profile/${ids.member}/?$`));
    await expect(page.getByRole("heading", { name: "Avery Acceptance" })).toBeVisible();
  });
});
