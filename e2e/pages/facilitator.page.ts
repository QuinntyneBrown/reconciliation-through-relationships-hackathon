import { BasePage } from "./base.page";

export class FacilitatorPage extends BasePage {
  async navigate(name: "Overview" | "Participants" | "Matches" | "Cohorts" | "Settings") {
    await this.page.getByRole("navigation", { name: "Main" }).getByRole("link", { name }).click();
  }

  async toggleAutoMatching() {
    await this.page.getByRole("switch").first().click();
  }

  async chooseManualParticipants(indigenous: string, nonIndigenous: string) {
    await this.page.getByRole("combobox").nth(0).click();
    await this.page.getByRole("option", { name: new RegExp(indigenous) }).click();
    await this.page.getByRole("combobox").nth(1).click();
    await this.page.getByRole("option", { name: new RegExp(nonIndigenous) }).click();
  }

  async createMatch() {
    await this.page.getByRole("button", { name: "Create match" }).click();
  }

  async approveFirst() {
    await this.page.getByRole("button", { name: "Approve" }).first().click();
  }

  async rejectFirst() {
    await this.page.getByRole("button", { name: "Reject" }).first().click();
  }

  async openMatchesTab(name: "Approved" | "Rejected") {
    await this.page.getByRole("tab", { name: new RegExp(name) }).click();
  }

  async saveSettings(threshold: string) {
    await this.page.getByRole("switch").click();
    await this.page.getByLabel("Cohort threshold").fill(threshold);
    await this.page.getByRole("button", { name: "Save settings" }).click();
  }
}
