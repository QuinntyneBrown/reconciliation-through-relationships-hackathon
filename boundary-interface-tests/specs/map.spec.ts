// Acceptance Test
// Traces to: L2-COHRT-051, L2-COHRT-052, L2-COHRT-053
// Description: Regional aggregation limited to eligible, consenting participants with cohort readiness
import { test, expect } from "../support/fixtures";

test("regional discovery exposes only eligible consenting aggregate data", async ({ login }) => {
  await login.signInAs("participant");
  await login.page.goto("/map");
  await expect(login.heading("Regional map & cohorts")).toBeVisible();
  await expect(login.page.getByText("Regina, SK")).toBeVisible();
  await expect(login.page.getByText("Ready to gather")).toBeVisible();
  await expect(login.page.getByText("Saskatoon, SK")).toBeVisible();
  await expect(login.page.getByText("3 seats remaining")).toBeVisible();
  await expect(login.page.getByText("8 consenting participants across 2 regions.")).toBeVisible();
  await expect(login.page.getByText("Winnipeg, MB")).toHaveCount(0);
});
