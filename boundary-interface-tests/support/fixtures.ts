/* eslint-disable react-hooks/rules-of-hooks -- Playwright names its fixture callback `use`. */
import { test as base } from "@playwright/test";
import { LandingPage } from "../pages/landing.page";
import { LoginPage } from "../pages/login.page";
import { OnboardingPage } from "../pages/onboarding.page";
import { LearningPage } from "../pages/learning.page";
import { DashboardPage } from "../pages/dashboard.page";
import { ProfilePage } from "../pages/profile.page";
import { ConnectionsPage, ConnectionChatPage } from "../pages/connections.page";
import { FacilitatorPage } from "../pages/facilitator.page";

type Backend = {
  configure(body: unknown): Promise<void>;
  state(): Promise<Record<string, Record<string, unknown>[]>>;
};

type Fixtures = {
  landing: LandingPage;
  login: LoginPage;
  onboarding: OnboardingPage;
  learning: LearningPage;
  dashboard: DashboardPage;
  profile: ProfilePage;
  connections: ConnectionsPage;
  chat: ConnectionChatPage;
  facilitator: FacilitatorPage;
  backend: Backend;
};

const backendUrl = "http://127.0.0.1:54329";

export const test = base.extend<Fixtures>({
  backend: async ({ request }, use) => {
    const reset = await request.post(`${backendUrl}/__mock/reset`);
    if (!reset.ok()) throw new Error(`Could not reset mock backend: ${reset.status()}`);
    await use({
      async configure(body) {
        const response = await request.post(`${backendUrl}/__mock/configure`, { data: body });
        if (!response.ok())
          throw new Error(`Could not configure mock backend: ${response.status()}`);
      },
      async state() {
        const response = await request.get(`${backendUrl}/__mock/state`);
        return response.json();
      },
    });
  },
  landing: async ({ page, backend: _backend }, use) => use(new LandingPage(page)),
  login: async ({ page, backend: _backend }, use) => use(new LoginPage(page)),
  onboarding: async ({ page }, use) => use(new OnboardingPage(page)),
  learning: async ({ page }, use) => use(new LearningPage(page)),
  dashboard: async ({ page }, use) => use(new DashboardPage(page)),
  profile: async ({ page }, use) => use(new ProfilePage(page)),
  connections: async ({ page }, use) => use(new ConnectionsPage(page)),
  chat: async ({ page }, use) => use(new ConnectionChatPage(page)),
  facilitator: async ({ page }, use) => use(new FacilitatorPage(page)),
});

export { expect } from "@playwright/test";
