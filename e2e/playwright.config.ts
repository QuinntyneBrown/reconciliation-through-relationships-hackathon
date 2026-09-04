import { defineConfig, devices } from "@playwright/test";

const appPort = 3100;
const backendPort = 54329;

export default defineConfig({
  testDir: "./specs",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  outputDir: "./test-results",
  reporter: [["list"], ["html", { outputFolder: "./playwright-report", open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: `npx tsx support/mock-backend.ts --port ${backendPort}`,
      url: `http://127.0.0.1:${backendPort}/__mock/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: `npm --prefix .. run dev -- --hostname 127.0.0.1 --port ${appPort}`,
      url: `http://127.0.0.1:${appPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        DATA_SOURCE: "mock",
        NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${backendPort}`,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "boundary-interface-test-key",
        NEXT_PUBLIC_MAPBOX_TOKEN: "",
        ZOOM_ACCESS_TOKEN: "boundary-interface-test-token",
        NEXT_DIST_DIR: ".next-boundary",
      },
    },
  ],
});
