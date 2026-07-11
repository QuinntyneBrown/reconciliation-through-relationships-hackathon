import { expect, type Page } from "@playwright/test";

export class BasePage {
  constructor(readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async expectPath(path: string | RegExp) {
    await expect(this.page).toHaveURL(
      typeof path === "string"
        ? new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`)
        : path,
    );
  }

  async expectToast(message: string | RegExp) {
    await expect(
      this.page.locator("[data-sonner-toast]").filter({ hasText: message }),
    ).toBeVisible();
  }
}
