import { expect, type Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class SettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto("/facilitator/settings");
    await expect(this.page.getByRole("heading", { name: "Platform settings" })).toBeVisible();
  }

  async saveThreshold(value: string) {
    await this.page.getByLabel("Cohort threshold").fill(value);
    await this.page.getByRole("button", { name: "Save settings" }).click();
    await this.expectToast("Settings saved.");
  }
}
