import { BasePage } from "./base.page";

export class ProfilePage extends BasePage {
  async connectWith(name: string) {
    await this.page.getByRole("button", { name: `Connect with ${name}` }).click();
  }

  async backToDashboard() {
    await this.page.getByRole("link", { name: "Back to dashboard" }).click();
  }
}
