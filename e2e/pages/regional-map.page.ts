import { expect, type Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class RegionalMapPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto("/map");
    await expect(this.page.getByRole("heading", { name: "Regional map & cohorts" })).toBeVisible();
  }
}
