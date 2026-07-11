import { expect, type Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class LandingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto("/");
    await expect(
      this.page.getByRole("heading", { name: /Reconciliation begins with a relationship/ }),
    ).toBeVisible();
  }

  async openJourneySection() {
    await this.page.getByRole("link", { name: "See how it works" }).click();
    await expect(this.page).toHaveURL(/#how$/);
    await expect(
      this.page.getByRole("heading", { name: "Four steps, at your pace" }),
    ).toBeVisible();
  }

  async beginJourney() {
    await this.page.getByRole("link", { name: "Begin your journey" }).click();
    await this.expectPath("/auth/login");
  }
}
