import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const rootDir = path.resolve(__dirname, "..");

export default defineConfig({
  testDir: path.join(__dirname, "tests"),
  outputDir: path.join(__dirname, "test-results"),
  globalSetup: path.join(__dirname, "support", "global-setup.ts"),
  globalTeardown: path.join(__dirname, "support", "global-teardown.ts"),
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [
        ["line"],
        ["html", { outputFolder: path.join(__dirname, "playwright-report"), open: "never" }],
      ]
    : "list",
  timeout: 30_000,
  expect: { timeout: 7_500 },
  use: {
    baseURL: "http://127.0.0.1:3000",
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
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    cwd: rootDir,
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
