// Acceptance Test
// Traces to: L2-LAND-003, L2-LAND-005, L2-AUTH-007, L2-AUTH-008, L2-AUTH-010, L2-AUTH-011, L2-AUTH-012, L2-SHELL-013, L2-SHELL-014, L2-DSGN-075
// Description: Public landing, sign-in routing by role and stage, cross-role gates, navigation, and sign-out against real Supabase
import { expect, test } from "@playwright/test";

import { DashboardPage } from "../pages/dashboard.page";
import { LandingPage } from "../pages/landing.page";
import { LoginPage } from "../pages/login.page";
import { TEST_PASSWORD, testUsers, type TestUserKey } from "../support/test-data";

test.describe("public journey and authentication", () => {
  test("landing page explains the journey and routes calls to action to sign in", async ({
    page,
  }) => {
    const landing = new LandingPage(page);
    await landing.open();

    for (const step of [
      "Create your profile",
      "Complete the learning journey",
      "Meet your match",
      "Build the relationship",
    ]) {
      await expect(page.getByRole("heading", { name: step })).toBeVisible();
    }
    await landing.openJourneySection();
    await landing.beginJourney();
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });

  test("protected pages redirect anonymous visitors to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login\/?$/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });

  test("login reports invalid credentials without leaving the form", async ({ page }) => {
    const login = new LoginPage(page);
    await login.signInWith("nobody@rtr-demo.ca", "not-the-password");
    await login.expectToast(/Invalid login credentials/i);
    await expect(page).toHaveURL(/\/auth\/login\/?$/);
    await expect(login.submit).toBeEnabled();
  });

  test("login routes each account to its role and journey stage", async ({ browser }) => {
    test.setTimeout(60_000);
    const routes: Array<[TestUserKey, RegExp]> = [
      ["gateOnboarding", /\/onboarding\/?$/],
      ["gateLearner", /\/learn\/?$/],
      ["member", /\/dashboard\/?$/],
      ["facilitator", /\/facilitator\/?$/],
    ];

    for (const [key, expectedRoute] of routes) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const login = new LoginPage(page);
      await login.signInWith(testUsers[key].email, TEST_PASSWORD);
      await expect(page).toHaveURL(expectedRoute);
      await context.close();
    }
  });

  test("role gates keep participants and facilitators in their own journeys", async ({
    browser,
  }) => {
    const participantContext = await browser.newContext();
    const participantPage = await participantContext.newPage();
    await new LoginPage(participantPage).signIn("member");
    await participantPage.goto("/facilitator");
    await expect(participantPage).toHaveURL(/\/dashboard\/?$/);
    await participantContext.close();

    const facilitatorContext = await browser.newContext();
    const facilitatorPage = await facilitatorContext.newPage();
    await new LoginPage(facilitatorPage).signIn("facilitator");
    await facilitatorPage.goto("/learn");
    await expect(facilitatorPage).toHaveURL(/\/facilitator\/?$/);
    await facilitatorContext.close();
  });

  test("responsive navigation exposes portal destinations on a narrow screen", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await new LoginPage(page).signIn("member");
    await page.getByRole("button", { name: "Open navigation" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobileNav.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await mobileNav.getByRole("link", { name: "Connections" }).click();
    await expect(page).toHaveURL(/\/connections\/?$/);
  });

  test("account menu opens the profile and signs the participant out", async ({ page }) => {
    await new LoginPage(page).signIn("member");
    await page.getByRole("button", { name: "Open account menu" }).click();
    await page.getByRole("menuitem", { name: "My profile" }).click();
    await expect(page.getByRole("heading", { name: "Avery Acceptance" })).toBeVisible();

    await page.goto("/dashboard");
    const dashboard = new DashboardPage(page);
    await dashboard.signOut();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login\/?$/);
  });
});
