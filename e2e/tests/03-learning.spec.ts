import { expect, test } from "@playwright/test";

import { LearningPage } from "../pages/learning.page";
import { LoginPage } from "../pages/login.page";

test("participant reads modules, records progress, and unlocks the dashboard", async ({ page }) => {
  test.setTimeout(60_000);
  await new LoginPage(page).signIn("learner");
  const learning = new LearningPage(page);
  await learning.expectLoaded();

  await learning.selectModule(/Understanding Truth and Reconciliation/);
  await expect(page.getByText(/The Truth and Reconciliation Commission of Canada/)).toBeVisible();
  await learning.completeJourney();
  await expect(page.getByRole("heading", { name: "Welcome, Lena" })).toBeVisible();

  await page.goto("/learn");
  await expect(page).toHaveURL(/\/dashboard\/?$/);
});
