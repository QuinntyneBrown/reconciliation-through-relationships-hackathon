import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  async openAllParticipants() {
    await this.page.getByRole("tab", { name: "All participants" }).click();
  }

  async search(term: string) {
    await this.page.getByPlaceholder("Search by name, city, or interest…").fill(term);
  }

  async chooseFilter(index: number, option: string) {
    await this.page.getByRole("combobox").nth(index).click();
    await this.page.getByRole("option", { name: option, exact: true }).click();
  }

  async showMap() {
    await this.page.getByRole("button", { name: "Map" }).click();
  }

  async showList() {
    await this.page.getByRole("button", { name: "List" }).click();
  }

  resultCount() {
    return this.page.getByText(/^\d+ participants?$/);
  }

  async openAccountMenu() {
    await this.page.getByRole("button", { name: "Open account menu" }).click();
  }

  async openMyProfile() {
    await this.openAccountMenu();
    await this.page.getByRole("menuitem", { name: "My profile" }).click();
  }

  async signOut() {
    await this.openAccountMenu();
    await this.page.getByRole("menuitem", { name: "Sign out" }).click();
  }
}
