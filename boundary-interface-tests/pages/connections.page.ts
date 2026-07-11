import { BasePage } from "./base.page";

export class ConnectionsPage extends BasePage {
  async open(name: string) {
    await this.page.getByRole("link", { name: new RegExp(name) }).click();
  }
}

export class ConnectionChatPage extends BasePage {
  async accept(name: string) {
    await this.page.getByRole("button", { name: `Connect with ${name}` }).click();
  }

  async sendMessage(message: string) {
    const input = this.page.getByPlaceholder("Type a message…");
    await input.fill(message);
    await input.locator("xpath=ancestor::form").getByRole("button").click();
  }

  async openScheduler() {
    await this.page.getByRole("button", { name: "Schedule call" }).click();
  }

  async schedule(date: string, time: string, duration: string, topic: string) {
    const dialog = this.page.getByRole("dialog");
    await dialog.getByRole("textbox").first().fill(topic);
    await dialog.locator('input[type="date"]').fill(date);
    await dialog.locator('input[type="time"]').fill(time);
    await dialog.getByRole("combobox").click();
    await this.page.getByRole("option", { name: duration }).click();
    await dialog.getByRole("button", { name: "Schedule call" }).click();
  }
}
