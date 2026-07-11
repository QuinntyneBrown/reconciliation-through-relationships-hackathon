import { expect, test } from "@playwright/test";

import { LoginPage } from "../pages/login.page";
import { OnboardingPage } from "../pages/onboarding.page";

test("participant completes the validated five-step onboarding journey", async ({ page }) => {
  test.setTimeout(60_000);
  await new LoginPage(page).signIn("onboarding");
  const onboarding = new OnboardingPage(page);

  await onboarding.completeBasicInfo();
  await onboarding.completeLocation();
  await onboarding.completeFaithAndInterests();
  await onboarding.completeAvailability();
  await onboarding.completeMatchingPreferences();

  await expect(page).toHaveURL(/\/learn\/?$/);
  await expect(page.getByText("Modules", { exact: true })).toBeVisible();
});
