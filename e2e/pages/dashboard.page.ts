import { expect, type Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectWelcome(name: string) {
    await expect(this.page.getByRole("heading", { name: `Welcome, ${name}` })).toBeVisible();
  }

  async openAllParticipants() {
    await this.page.getByRole("tab", { name: /All participants/ }).click();
    await expect(this.page.getByPlaceholder("Search by name, city, or interest…")).toBeVisible();
  }

  async search(term: string) {
    await this.page.getByPlaceholder("Search by name, city, or interest…").fill(term);
  }

  async chooseFilter(index: number, option: string) {
    await this.page.getByRole("combobox").nth(index).click();
    await this.page.getByRole("option", { name: option, exact: true }).click();
  }

  async showMap() {
    await this.page.getByRole("button", { name: "Map", exact: true }).click();
    await expect(
      this.page.getByText("Only showing participants who consented to map display."),
    ).toBeVisible();
  }

  async signOut() {
    await this.page.getByRole("button", { name: /Open account menu/ }).click();
    await this.page.getByRole("menuitem", { name: "Sign out" }).click();
  }
}
