import { test, expect } from "../support/fixtures";

test.describe("public journey and authentication", () => {
  test("the platform brands itself as Reconciliation Through Relationships", async ({
    landing,
  }) => {
    await landing.goto();
    await expect(landing.page.getByText("RTR Portal")).toHaveCount(0);
    await expect(
      landing.page
        .locator("header")
        .getByRole("link", { name: "Reconciliation Through Relationships" }),
    ).toBeVisible();
  });

  test("landing calls to action navigate and the journey anchor works", async ({ landing }) => {
    await landing.goto();
    await expect(landing.heading(/Reconciliation begins with a relationship/)).toBeVisible();
    await landing.showHowItWorks();
    await expect(landing.journeySection()).toBeInViewport();
    await landing.beginJourney();
    await expect(landing.page).toHaveURL(/\/auth\/signup$/);
  });

  test("invalid credentials show the backend error and allow another attempt", async ({
    login,
  }) => {
    await login.goto();
    await login.signIn("unknown@example.com", "wrong-password");
    await expect(login.toast("Invalid login credentials")).toBeVisible();
    await expect(login.page.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });

  for (const [account, destination] of [
    ["new", "/onboarding"],
    ["learner", "/learn"],
    ["participant", "/dashboard"],
    ["facilitator", "/facilitator"],
  ] as const) {
    test(`${account} accounts are routed to ${destination}`, async ({ login }) => {
      await login.signInAs(account);
      await expect(login.page).toHaveURL(new RegExp(`${destination}$`));
    });
  }

  test("protected participant pages send anonymous visitors to sign in", async ({ login }) => {
    await login.page.goto("/dashboard");
    await expect(login.page).toHaveURL(/\/auth\/login$/);
  });

  test("responsive navigation opens, marks the current page, and navigates", async ({
    login,
    dashboard,
  }) => {
    await dashboard.page.setViewportSize({ width: 390, height: 844 });
    await login.signInAs("participant");
    await dashboard.openMobileNavigation();
    await expect(dashboard.mobileNavigation().getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await dashboard.mobileNavigation().getByRole("link", { name: "Regional map" }).click();
    await expect(dashboard.page).toHaveURL(/\/map$/);
  });
});
