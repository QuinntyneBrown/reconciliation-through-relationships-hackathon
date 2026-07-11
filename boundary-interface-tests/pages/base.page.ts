import type { Locator, Page } from "@playwright/test";

export class BasePage {
  constructor(readonly page: Page) {}

  heading(name: string | RegExp): Locator {
    return this.page.getByRole("heading", { name });
  }

  toast(message: string | RegExp): Locator {
    return this.page.getByText(message, { exact: typeof message === "string" });
  }

  async openMobileNavigation() {
    await this.page.getByRole("button", { name: "Open navigation" }).click();
  }

  mobileNavigation(): Locator {
    return this.page.getByRole("navigation", { name: "Mobile navigation" });
  }
}
