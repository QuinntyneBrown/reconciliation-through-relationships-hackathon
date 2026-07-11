import { expect, type Locator, type Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class FacilitatorPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectOverview() {
    await expect(this.page.getByRole("heading", { name: "Community overview" })).toBeVisible();
    for (const label of [
      "Total participants",
      "Completed learning",
      "Pending matches",
      "Active connections",
      "Regional cohorts",
    ]) {
      await expect(this.page.getByText(label, { exact: true })).toBeVisible();
    }
  }

  async openMatching() {
    await this.goto("/facilitator/matching");
    await expect(this.page.getByRole("heading", { name: "Match management" })).toBeVisible();
  }

  matchCard(participantName: string): Locator {
    return this.page.locator('[data-slot="card"]').filter({ hasText: participantName });
  }

  async createManualMatch(indigenousName: string, nonIndigenousName: string) {
    const selects = this.page.getByRole("combobox");
    await selects.nth(0).click();
    await this.page.getByRole("option", { name: new RegExp(indigenousName) }).click();
    await selects.nth(1).click();
    await this.page.getByRole("option", { name: new RegExp(nonIndigenousName) }).click();
    await this.page.getByRole("button", { name: "Create match" }).click();
    await this.expectToast("Manual match created.");
  }
}
