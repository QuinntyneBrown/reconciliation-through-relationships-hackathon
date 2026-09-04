// Post-deploy smoke test — runs against the deployed Azure instance.
// Creates a real account in the production Supabase project; see azure.config.ts.
import { test, expect, type Response } from "@playwright/test";

// Required rather than defaulted: this registers a real account you will have
// to confirm from a real inbox. Supabase rejects @example.com as
// email_address_invalid, so it must be a deliverable address — plus-addressing
// (you+rtr-123@example.org) keeps each run distinct.
const signupEmail = process.env.SIGNUP_EMAIL;
const signupPassword = process.env.SIGNUP_PASSWORD ?? "RtrSmokeTest123!";

test("a visitor can create an account on the deployed site", async ({ page }) => {
  test.skip(
    !signupEmail,
    "Set SIGNUP_EMAIL to a deliverable address to run this against production.",
  );

  const authCalls: { url: string; status: number; body: string }[] = [];
  page.on("response", async (response: Response) => {
    if (!response.url().includes("/auth/v1/")) return;
    authCalls.push({
      url: new URL(response.url()).pathname,
      status: response.status(),
      body: await response.text().catch(() => ""),
    });
  });

  await page.goto("/auth/signup");
  await expect(page.getByRole("heading", { name: "Join RTR" })).toBeVisible();

  await page.getByLabel("Email address").fill(signupEmail!);
  await page.getByLabel("Password", { exact: true }).fill(signupPassword);
  await page.getByLabel("Confirm password").fill(signupPassword);

  const signUp = page.waitForResponse(
    (r) => r.url().includes("/auth/v1/signup") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Create account" }).click();

  // The account itself must be created. A bad NEXT_PUBLIC_SUPABASE_URL fails
  // here with no request at all rather than a bad status.
  const signUpResponse = await signUp;
  expect(
    signUpResponse.status(),
    `sign-up rejected: ${await signUpResponse.text().catch(() => "")}`,
  ).toBe(200);

  // The project confirms email addresses, so there is no session yet and the
  // visitor belongs on /auth/verify — not /auth/login, which would refuse them.
  await expect(page).toHaveURL(/\/auth\/verify(\?|$)/);
  await expect(page.getByRole("heading", { name: /check your email/i })).toBeVisible();
  await expect(page.getByText(signupEmail!)).toBeVisible();

  console.log(`Created account: ${signupEmail}`);
  for (const call of authCalls) console.log(`  ${call.status} ${call.url}`);
});
