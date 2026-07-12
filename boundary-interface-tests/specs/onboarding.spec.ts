// Acceptance Test
// Traces to: L2-014, L2-015, L2-016, L2-017, L2-018, L2-019, L2-073
// Description: Five-step onboarding wizard validation, persistence, failure handling, and the accessible error pattern
import { test, expect } from "../support/fixtures";

test.describe("onboarding", () => {
  test.beforeEach(async ({ login }) => {
    await login.signInAs("new");
  });

  test("enabled Continue reveals every error and clears errors as fields are corrected", async ({
    onboarding,
  }) => {
    await expect(onboarding.heading("Tell us about yourself")).toBeVisible();
    await expect(onboarding.continueButton()).toBeEnabled();
    await onboarding.continueButton().click();

    const summary = onboarding.page.getByRole("alert", {
      name: "Please fix 6 errors to continue",
    });
    await expect(summary).toBeFocused();
    await expect(
      summary.getByRole("heading", { name: "Please fix 6 errors to continue" }),
    ).toBeVisible();
    await expect(summary.getByRole("link", { name: "Enter your first name." })).toHaveAttribute(
      "href",
      "#first_name",
    );
    await expect(summary.getByRole("link", { name: "Enter your last name." })).toBeVisible();
    await expect(summary.getByRole("link", { name: "Enter an age from 13 to 120." })).toBeVisible();
    await expect(
      summary.getByRole("link", { name: "Choose whether you are Indigenous." }),
    ).toBeVisible();
    await expect(summary.getByRole("link", { name: "Choose your sex." })).toBeVisible();
    await expect(
      summary.getByRole("link", {
        name: "Choose at least one required participation category.",
      }),
    ).toBeVisible();

    const firstName = onboarding.page.getByLabel("First name *");
    await expect(firstName).toHaveAttribute("aria-invalid", "true");
    await expect(firstName).toHaveAttribute("aria-describedby", "first_name-error");
    await summary.getByRole("link", { name: "Enter your first name." }).click();
    await expect(firstName).toBeFocused();
    await firstName.fill("Jamie");
    await expect(summary.getByRole("link", { name: "Enter your first name." })).toHaveCount(0);
    await expect(firstName).not.toHaveAttribute("aria-invalid", "true");

    await onboarding.completeBasicInfo();
    await expect(onboarding.heading("Where are you located?")).toBeVisible();
    await expect(onboarding.continueButton()).toBeEnabled();
    await onboarding.continueButton().click();
    await expect(
      onboarding.page.getByRole("alert", { name: "Please fix 2 errors to continue" }),
    ).toBeVisible();
    await expect(
      onboarding.page.getByText("Enter your city, town, or county.", { exact: true }),
    ).toHaveCount(2);
    await expect(
      onboarding.page.getByText("Choose a province or territory.", { exact: true }),
    ).toHaveCount(2);
    await onboarding.goBack();
    await expect(onboarding.page.getByLabel("First name *")).toHaveValue("Jamie");
    await expect(
      onboarding.page.getByRole("checkbox", { name: "Non-Indigenous Individual" }),
    ).toBeChecked();
  });

  test("age validation explains the accepted range", async ({ onboarding }) => {
    await onboarding.page.getByLabel("First name *").fill("Jamie");
    await onboarding.page.getByLabel("Last name *").fill("River");
    await onboarding.page.getByLabel("Age *").fill("12");
    await onboarding.page.getByRole("radio", { name: "No", exact: true }).click();
    await onboarding.page.getByRole("radio", { name: "Prefer not to say", exact: true }).click();
    await onboarding.page.getByRole("checkbox", { name: "Non-Indigenous Individual" }).click();
    await onboarding.continueButton().click();

    await expect(
      onboarding.page.getByRole("alert", { name: "Please fix 1 error to continue" }),
    ).toContainText("Enter an age from 13 to 120.");
    await expect(onboarding.page.getByLabel("Age *")).toHaveAttribute("aria-invalid", "true");
  });

  test("later onboarding steps reveal required group errors on submit", async ({ onboarding }) => {
    await onboarding.completeBasicInfo();
    await onboarding.completeLocation();

    await expect(onboarding.continueButton()).toBeEnabled();
    await onboarding.continueButton().click();
    await expect(
      onboarding.page.getByRole("alert", { name: "Please fix 1 error to continue" }),
    ).toContainText("Choose a faith tradition or prefer not to say.");
    await expect(onboarding.page.getByRole("radio", { name: "Christian" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    await onboarding.page.getByRole("radio", { name: "Christian" }).click();
    await expect(onboarding.page.getByRole("alert")).toHaveCount(1);
    await onboarding.continueButton().click();

    await expect(onboarding.continueButton()).toBeEnabled();
    await onboarding.continueButton().click();
    await expect(
      onboarding.page.getByRole("alert", { name: "Please fix 2 errors to continue" }),
    ).toContainText("Choose at least one participation format.");
    await expect(
      onboarding.page.getByRole("alert", { name: "Please fix 2 errors to continue" }),
    ).toContainText("Choose at least one language.");
  });

  test("the five-step form persists all preferences and opens learning", async ({
    onboarding,
    backend,
  }) => {
    await onboarding.completeJourney();
    await expect(
      onboarding.toast("Profile saved! Let's start your learning journey."),
    ).toBeVisible();
    await expect(onboarding.page).toHaveURL(/\/learn$/);

    const state = await backend.state();
    const saved = state.profiles.find((row) => row.id === "new-user");
    expect(saved).toMatchObject({
      first_name: "Jamie",
      last_name: "River",
      age: 34,
      city: "Toronto",
      province: "Ontario",
      faith_tradition: "other",
      faith_tradition_other: "Quaker",
      participation_format: ["online"],
      language_preferences: ["english"],
      map_consent: true,
      onboarding_completed: true,
    });
    expect(saved?.interests).toEqual(expect.arrayContaining(["hiking", "music"]));
  });

  test("a failed profile save stays on the final step and can be retried", async ({
    onboarding,
    backend,
  }) => {
    await onboarding.completeBasicInfo();
    await onboarding.completeLocation();
    await onboarding.completeFaithAndInterests();
    await onboarding.completeAvailability();
    await backend.configure({ failures: [{ table: "profiles", method: "PATCH" }] });
    await onboarding.completeMatchingPreferences();
    await expect(onboarding.toast("Something went wrong. Please try again.")).toBeVisible();
    await expect(onboarding.heading("Matching preferences")).toBeVisible();
    await expect(onboarding.page.getByRole("button", { name: "Complete profile" })).toBeEnabled();
  });

  test("signing out returns to login", async ({ onboarding }) => {
    await onboarding.signOut();
    await expect(onboarding.page).toHaveURL(/\/auth\/login$/);
  });
});
