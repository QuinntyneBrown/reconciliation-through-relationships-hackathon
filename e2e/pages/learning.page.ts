import { expect, type Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class LearningPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectLoaded() {
    await expect(this.page.getByText("Modules", { exact: true })).toBeVisible();
    await expect(this.page.getByRole("button", { name: "Mark complete" })).toBeVisible();
  }

  async selectModule(name: string | RegExp) {
    await this.page.getByRole("button", { name }).click();
    await expect(this.page.getByRole("heading", { name })).toBeVisible();
  }

  async completeJourney() {
    const progress = this.page.getByText(/^\d+\/\d+$/).first();
    const initialProgress = (await progress.textContent()) ?? "0/0";
    const total = Number(initialProgress.split("/")[1]);

    for (let completed = 1; completed <= total; completed += 1) {
      await this.page.mouse.move(0, 0);
      await expect(this.page.locator("[data-sonner-toast]")).toHaveCount(0, { timeout: 7_000 });
      const button = this.page.getByRole("button", { name: "Mark complete" });
      await expect(button).toBeEnabled();
      await button.click();
      await expect(progress).toHaveText(`${completed}/${total}`);
    }
    await expect(this.page).toHaveURL(/\/dashboard\/?$/, { timeout: 10_000 });
  }
}
