import { expect, type Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class ConnectionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto("/connections");
    await expect(this.page.getByRole("heading", { name: "My connections" })).toBeVisible();
  }

  async openConnection(partnerName: string) {
    await this.page.getByRole("link", { name: new RegExp(partnerName) }).click();
    await expect(this.page.getByText(partnerName, { exact: true })).toBeVisible();
  }
}
