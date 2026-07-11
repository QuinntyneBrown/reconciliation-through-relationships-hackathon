import { BasePage } from "./base.page";

export class OnboardingPage extends BasePage {
  async completeBasicInfo() {
    await this.page.getByLabel("First name *").fill("Jamie");
    await this.page.getByLabel("Last name *").fill("River");
    await this.page.getByLabel("Bio").fill("I want to learn and build lasting relationships.");
    await this.page.getByRole("radio", { name: "No", exact: true }).click();
    await this.page.getByRole("radio", { name: "Prefer not to say", exact: true }).click();
    await this.page.getByRole("checkbox", { name: "Non-Indigenous Individual" }).click();
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  async completeLocation() {
    await this.page.getByLabel("City / Town / County *").fill("Toronto");
    await this.page.getByRole("combobox").click();
    await this.page.getByRole("option", { name: "Ontario" }).click();
    await this.page.getByLabel("Nearest Treaty area").fill("Treaty 13");
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  async completeFaithAndInterests() {
    await this.page.getByRole("radio", { name: "Other", exact: true }).click();
    await this.page.getByPlaceholder("Your faith tradition").fill("Quaker");
    const interest = this.page.getByPlaceholder("Add an interest…");
    await interest.fill("Hiking");
    await this.page.getByRole("button", { name: "Add" }).click();
    await interest.fill("Music");
    await interest.press("Enter");
    await this.page.getByText("hiking", { exact: true }).getByRole("button").click();
    await interest.fill("Hiking");
    await this.page.getByRole("button", { name: "Add" }).click();
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  async completeAvailability() {
    await this.page.getByRole("checkbox", { name: "Mon" }).click();
    await this.page
      .getByText("Evening (5pm–9pm)", { exact: true })
      .locator("..")
      .evaluate((element: HTMLElement) => element.click());
    await this.page.getByRole("checkbox", { name: "Online (video calls)" }).click();
    await this.page.getByRole("checkbox", { name: "English" }).click();
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  async completeMatchingPreferences() {
    await this.page.getByRole("switch", { name: "Same sex" }).click();
    await this.page
      .getByLabel("Personal boundaries & other preferences")
      .fill("Please plan accessible meeting locations.");
    await this.page.getByRole("checkbox", { name: "Show me on the regional map" }).click();
    await this.page.getByRole("button", { name: "Complete profile" }).click();
  }

  async completeJourney() {
    await this.completeBasicInfo();
    await this.completeLocation();
    await this.completeFaithAndInterests();
    await this.completeAvailability();
    await this.completeMatchingPreferences();
  }

  continueButton() {
    return this.page.getByRole("button", { name: "Continue" });
  }

  async goBack() {
    await this.page.getByRole("button", { name: "Back" }).click();
  }

  async signOut() {
    await this.page.getByRole("button", { name: "Sign out" }).click();
  }
}
