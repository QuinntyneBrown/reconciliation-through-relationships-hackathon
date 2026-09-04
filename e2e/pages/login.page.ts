import { BasePage } from "./base.page";

export type Account = "participant" | "new" | "learner" | "facilitator";

const emails: Record<Account, string> = {
  participant: "participant@example.com",
  new: "new@example.com",
  learner: "learner@example.com",
  facilitator: "facilitator@example.com",
};

export class LoginPage extends BasePage {
  async goto() {
    await this.page.goto("/auth/login");
  }

  async signIn(email: string, password = "password123") {
    await this.page.getByLabel("Email address").fill(email);
    await this.page.getByLabel("Password", { exact: true }).fill(password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
  }

  async signInAs(account: Account) {
    await this.goto();
    await this.signIn(emails[account]);
  }
}
