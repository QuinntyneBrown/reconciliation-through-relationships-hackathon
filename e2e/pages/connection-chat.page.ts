import { expect, type Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class ConnectionChatPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async accept(partnerFirstName: string) {
    await this.page.getByRole("button", { name: `Connect with ${partnerFirstName}` }).click();
    await this.expectToast(/Connection request sent|You're now connected/);
    await this.page.reload();
    await expect(this.page.getByPlaceholder("Type a message…")).toBeEnabled();
  }

  async sendMessage(message: string) {
    const input = this.page.getByPlaceholder("Type a message…");
    await input.fill(message);
    await input.press("Enter");
    await this.page.reload();
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }

  async openScheduleDialog() {
    await this.page.getByRole("button", { name: "Schedule call" }).click();
    await expect(this.page.getByRole("dialog")).toBeVisible();
  }
}
