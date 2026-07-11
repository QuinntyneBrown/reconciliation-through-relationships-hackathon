import { BasePage } from "./base.page";

export class LandingPage extends BasePage {
  async goto() {
    await this.page.goto("/");
  }

  async beginJourney() {
    await this.page.getByRole("link", { name: "Begin your journey" }).click();
  }

  async showHowItWorks() {
    await this.page.getByRole("link", { name: "See how it works" }).click();
  }

  journeySection() {
    return this.page.locator("#how");
  }
}
