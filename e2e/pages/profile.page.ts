import { expect, type Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectProfile(name: string) {
    await expect(this.page.getByRole("heading", { name })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back to dashboard" })).toBeVisible();
  }
}
