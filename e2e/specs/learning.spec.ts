// Acceptance Test
// Traces to: L2-SHELL-014, L2-LEARN-021, L2-LEARN-022, L2-LEARN-023
// Description: Learning module progression, journey completion, and failed-save retry
import { test, expect } from "../support/fixtures";

test.describe("learning journey", () => {
  test.beforeEach(async ({ login }) => {
    await login.signInAs("learner");
  });

  test("module selection changes content and a completion advances to the next module", async ({
    learning,
    backend,
  }) => {
    await expect(learning.heading("Truth before reconciliation")).toBeVisible();
    await learning.selectModule("Further reflection");
    await expect(learning.heading("Further reflection")).toBeVisible();
    await learning.selectModule("Truth before reconciliation");
    await learning.markComplete();
    await expect(learning.toast("Module complete!")).toBeVisible();
    await expect(learning.heading("Listening in relationship")).toBeVisible();

    const state = await backend.state();
    expect(state.learning_progress).toContainEqual(
      expect.objectContaining({ user_id: "learner-user", module_id: "module-1", completed: true }),
    );
  });

  test("completing every required module updates the profile and redirects to dashboard", async ({
    learning,
    backend,
  }) => {
    await learning.markComplete();
    await learning.markComplete();
    await expect(
      learning.toast("Learning journey complete! Taking you to your dashboard."),
    ).toBeVisible();
    await expect(learning.page).toHaveURL(/\/dashboard$/, { timeout: 5_000 });
    const state = await backend.state();
    expect(state.profiles.find((row) => row.id === "learner-user")?.learning_completed).toBe(true);
  });

  test("failed progress persistence leaves the module incomplete and retryable", async ({
    learning,
    backend,
  }) => {
    await backend.configure({ failures: [{ table: "learning_progress", method: "POST" }] });
    await learning.markComplete();
    await expect(learning.toast("Failed to save progress. Please try again.")).toBeVisible();
    await expect(learning.page.getByRole("button", { name: "Mark complete" })).toBeEnabled();
  });

  test("signing out from learning returns to login", async ({ learning }) => {
    await learning.page.getByRole("button", { name: "Open account menu" }).click();
    await learning.page.getByRole("menuitem", { name: "Sign out" }).click();
    await expect(learning.page).toHaveURL(/\/auth\/login$/);
  });
});
