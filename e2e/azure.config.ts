import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

/**
 * Post-deploy smoke config: runs against the deployed Azure Container App
 * instead of a local dev server, so there is deliberately no `webServer` here.
 *
 * Run it on demand, never from CI on every push — it signs up against the
 * production Supabase project and leaves a real auth user behind:
 *
 *   npx playwright test --config=e2e/azure.config.ts
 *
 * Override the target with AZURE_BASE_URL, and the address it registers with
 * SIGNUP_EMAIL. Timeouts are generous because min-replicas=0 means the first
 * request pays a cold start (image pull + container start + Next.js boot).
 */
const baseURL =
  process.env.AZURE_BASE_URL ??
  "https://rtr.victoriousrock-4f6355f7.canadacentral.azurecontainerapps.io";

export default defineConfig({
  testDir: path.join(__dirname, "azure"),
  outputDir: path.join(__dirname, "azure-test-results"),
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "list",
  timeout: 120_000,
  expect: { timeout: 30_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: 90_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
