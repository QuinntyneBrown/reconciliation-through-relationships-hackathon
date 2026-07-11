import { expect, type Page } from "@playwright/test";

import { BasePage } from "./base.page";
import { TEST_PASSWORD, testUsers, type TestUserKey } from "../support/test-data";

export class LoginPage extends BasePage {
  readonly email = this.page.getByLabel("Email address");
  readonly password = this.page.getByLabel("Password");
  readonly submit = this.page.getByRole("button", { name: "Sign in" });

  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto("/auth/login");
    await expect(this.page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  }

  async signIn(key: TestUserKey) {
    await this.open();
    await this.email.fill(testUsers[key].email);
    await this.password.fill(TEST_PASSWORD);
    await this.submit.click();
    await this.waitForAuthenticatedNavigation();
  }

  async signInWith(email: string, password: string) {
    await this.open();
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
    if (Object.values(testUsers).some((user) => user.email === email)) {
      await this.waitForAuthenticatedNavigation();
    }
  }

  private async waitForAuthenticatedNavigation() {
    await this.page.waitForURL((url) => url.pathname !== "/auth/login");
    await this.page.waitForLoadState("networkidle");
  }
}
