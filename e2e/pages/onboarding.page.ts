import { expect, type Locator, type Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class OnboardingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private async clickChoice(label: string) {
    const choice = this.page.getByText(label, { exact: true }).locator("..");
    await choice.evaluate((element) => (element as HTMLElement).click());
  }

  private currentSelect(): Locator {
    return this.page.getByRole("combobox");
  }

  async expectStep(number: number, title: string) {
    await expect(this.page.getByText(`Step ${number} of 5`, { exact: true })).toBeVisible();
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
  }

  async completeBasicInfo() {
    await this.expectStep(1, "Tell us about yourself");
    const continueButton = this.page.getByRole("button", { name: "Continue" });
    await expect(continueButton).toBeDisabled();
    await this.page.getByLabel("First name *").fill("Olivia");
    await this.page.getByLabel("Last name *").fill("Onboarding");
    await this.page.getByLabel("Bio").fill("I care about listening, learning, and community.");
    await this.page
      .getByLabel("Additional matching information")
      .fill("I prefer a thoughtful first conversation.");
    await this.page.getByRole("radio", { name: "No", exact: true }).click();
    await this.page.getByRole("radio", { name: "Prefer not to say", exact: true }).click();
    await this.clickChoice("Non-Indigenous Individual");
    await expect(continueButton).toBeEnabled();
    await continueButton.click();
  }

  async completeLocation() {
    await this.expectStep(2, "Where are you located?");
    await this.page.getByLabel("City / Town / County *").fill("Acceptance Bay");
    await this.currentSelect().click();
    await this.page.getByRole("option", { name: "Ontario", exact: true }).click();
    await this.page.getByLabel("Nearest Treaty area").fill("Treaty acceptance territory");
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  async completeFaithAndInterests() {
    await this.expectStep(3, "Faith & Interests");
    await this.page.getByRole("radio", { name: "Other", exact: true }).click();
    const otherFaith = this.page.getByPlaceholder("Your faith tradition");
    await expect(otherFaith).toBeVisible();
    await otherFaith.fill("Acceptance tradition");
    const interest = this.page.getByPlaceholder("Add an interest…");
    await interest.fill("Storytelling");
    await interest.press("Enter");
    await expect(this.page.getByText("storytelling", { exact: true })).toBeVisible();
    await interest.fill("Walking");
    await this.page.getByRole("button", { name: "Add", exact: true }).click();
    await this.page.getByText("walking", { exact: true }).getByRole("button").click();
    await expect(this.page.getByText("walking", { exact: true })).toHaveCount(0);
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  async completeAvailability() {
    await this.expectStep(4, "Availability & Preferences");
    const continueButton = this.page.getByRole("button", { name: "Continue" });
    await expect(continueButton).toBeDisabled();
    await this.clickChoice("Mon");
    await this.clickChoice("Evening (5pm–9pm)");
    await this.clickChoice("Online (video calls)");
    await this.clickChoice("English");
    await expect(continueButton).toBeEnabled();
    await continueButton.click();
  }

  async completeMatchingPreferences() {
    await this.expectStep(5, "Matching Preferences");
    const switches = this.page.getByRole("switch");
    await switches.nth(0).click();
    await this.page
      .getByLabel("Personal boundaries & other preferences")
      .fill("Please avoid weekday mornings.");
    await this.page.getByRole("checkbox", { name: "Show me on the regional map" }).click();
    await this.page.getByRole("button", { name: "Back" }).click();
    await this.expectStep(4, "Availability & Preferences");
    await this.page.getByRole("button", { name: "Continue" }).click();
    await expect(this.page.getByLabel("Personal boundaries & other preferences")).toHaveValue(
      "Please avoid weekday mornings.",
    );
    await this.page.getByRole("button", { name: "Complete profile" }).click();
  }
}
