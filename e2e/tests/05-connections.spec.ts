import { expect, test } from "@playwright/test";

import { ConnectionChatPage } from "../pages/connection-chat.page";
import { ConnectionsPage } from "../pages/connections.page";
import { LoginPage } from "../pages/login.page";
import { fixtureConnectionId, fixtureIds } from "../support/supabase-admin";

test.describe("mutual connections and chat", () => {
  test("empty connection state links back to recommendations", async ({ page }) => {
    await new LoginPage(page).signIn("emptyMember");
    await new ConnectionsPage(page).open();
    await expect(page.getByRole("heading", { name: "No active connections yet" })).toBeVisible();
    await page.getByRole("link", { name: "Explore recommendations" }).click();
    await expect(page).toHaveURL(/\/dashboard\/?$/);
  });

  test("both participants must consent before chat becomes active", async ({ page }) => {
    await new LoginPage(page).signIn("accepter");
    const ids = await fixtureIds();
    const connectionId = await fixtureConnectionId(ids.accepter);
    await page.goto(`/connections/${connectionId}`);

    const chat = new ConnectionChatPage(page);
    await expect(page.getByPlaceholder("Connect first to start chatting")).toBeDisabled();
    await chat.accept("Riley");
    await chat.sendMessage("Casey accepted the connection in Playwright.");
  });

  test("active connection lists history, sends chat, and validates call scheduling", async ({
    page,
  }) => {
    await new LoginPage(page).signIn("member");
    const connections = new ConnectionsPage(page);
    await connections.open();
    await expect(page.getByText("Active", { exact: true })).toBeVisible();
    await connections.openConnection("Iris Acceptance");

    const chat = new ConnectionChatPage(page);
    await expect(page.getByText("Welcome from the acceptance-test partner.")).toBeVisible();
    await chat.sendMessage("A message sent through the acceptance test.");

    await chat.openScheduleDialog();
    await page.getByRole("button", { name: "Schedule call", exact: true }).click();
    await chat.expectToast("Please select a date and time.");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test.skip("creates a real Zoom meeting and displays its join link", async () => {
    // Deliberately skipped: this calls a paid/external Zoom API and may wait on OAuth/network.
    // The fast validation and dialog behavior remain covered above.
  });
});
