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

  tagline() {
    return this.page.getByText("An invitation, in response to the TRC's calls to action");
  }

  organizationLogo() {
    return this.page.getByRole("img", { name: "Reconciliation Through Relationships logo" });
  }

  successStories() {
    return this.page.getByRole("region", { name: "Success stories" });
  }

  testimonials() {
    return this.successStories().getByRole("figure");
  }
}
