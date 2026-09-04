import { BasePage } from "./base.page";

export class LearningPage extends BasePage {
  async selectModule(name: string) {
    await this.page.getByRole("button", { name: new RegExp(name) }).click();
  }

  async markComplete() {
    await this.page.getByRole("button", { name: "Mark complete" }).click();
  }

  progressText() {
    return this.page.getByText(/^\d+\/\d+$/);
  }
}
