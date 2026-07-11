import { test, expect } from "../support/fixtures";

test.describe("onboarding", () => {
  test.beforeEach(async ({ login }) => {
    await login.signInAs("new");
  });

  test("required fields gate each step and back navigation preserves entered data", async ({
    onboarding,
  }) => {
    await expect(onboarding.heading("Tell us about yourself")).toBeVisible();
    await expect(onboarding.continueButton()).toBeDisabled();
    await onboarding.completeBasicInfo();
    await expect(onboarding.heading("Where are you located?")).toBeVisible();
    await expect(onboarding.continueButton()).toBeDisabled();
    await onboarding.goBack();
    await expect(onboarding.page.getByLabel("First name *")).toHaveValue("Jamie");
    await expect(
      onboarding.page.getByRole("checkbox", { name: "Non-Indigenous Individual" }),
    ).toBeChecked();
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
