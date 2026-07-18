// Acceptance Test
// Traces to: L2-LAND-001, L2-LAND-002, L2-LAND-003, L2-LAND-004, L2-LAND-005, L2-AUTH-007, L2-AUTH-008, L2-AUTH-010, L2-AUTH-011, L2-SHELL-013, L2-DSGN-074, L2-DSGN-075, L2-DSGN-076
// Description: Landing page content, sign-in and journey-stage routing, protected-route redirects, navigation, contrast, and responsive behavior
import { test, expect } from "../support/fixtures";

test.describe("public journey and authentication", () => {
  test("the platform brands itself as Reconciliation Through Relationships", async ({
    landing,
  }) => {
    await landing.goto();
    await expect(landing.page.getByText("RTR Portal")).toHaveCount(0);
    await expect(
      landing.page
        .locator("header")
        .getByRole("link", { name: "Reconciliation Through Relationships" }),
    ).toBeVisible();
  });

  test("the landing page shows the organization's logo", async ({ landing }) => {
    await landing.goto();
    await expect(landing.organizationLogo()).toBeVisible();
  });

  test("the invitation tagline is fully visible on small and large screens", async ({
    landing,
  }) => {
    for (const viewport of [
      { width: 320, height: 700 },
      { width: 1280, height: 900 },
    ]) {
      await landing.page.setViewportSize(viewport);
      await landing.goto();
      await expect(landing.tagline()).toBeVisible();
      const box = await landing.tagline().boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    }
  });

  test("the introduction names the purpose of forming relationships as Christians", async ({
    landing,
  }) => {
    await landing.goto();
    await expect(landing.page.getByText(/relationships as Christians/)).toBeVisible();
  });

  test("the journey explains you choose whether a facilitator matches you", async ({
    landing,
  }) => {
    await landing.goto();
    await expect(
      landing.journeySection().getByText(/choose whether a facilitator matches you/i),
    ).toBeVisible();
  });

  test("success stories from participants and facilitators encourage joining", async ({
    landing,
  }) => {
    await landing.goto();
    await expect(landing.successStories()).toBeVisible();
    await expect(landing.testimonials().first()).toBeVisible();
    expect(await landing.testimonials().count()).toBeGreaterThanOrEqual(3);
    for (const testimonial of await landing.testimonials().all()) {
      await expect(testimonial.locator('[data-slot="avatar"]')).toBeVisible();
    }
    await expect(
      landing.successStories().getByText("Participant", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      landing.successStories().getByText("Facilitator", { exact: true }).first(),
    ).toBeVisible();
  });

  test("landing calls to action navigate and the journey anchor works", async ({ landing }) => {
    await landing.goto();
    await expect(landing.heading(/Reconciliation begins with a relationship/)).toBeVisible();
    await landing.showHowItWorks();
    await expect(landing.journeySection()).toBeInViewport();
    await landing.beginJourney();
    await expect(landing.page).toHaveURL(/\/auth\/signup$/);
  });

  test("landing calls to action keep readable text contrast", async ({ landing }) => {
    await landing.goto();
    for (const name of ["Begin your journey", "Find your place in the circle"]) {
      const cta = landing.page.getByRole("link", { name });
      await expect(cta).toBeVisible();
      const ratio = await cta.evaluate((element) => {
        const channel = (value: number) => {
          const scaled = value / 255;
          return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
        };
        const luminance = (color: string) => {
          const [r, g, b] = color.match(/[\d.]+/g)!.map(Number);
          return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
        };
        let backgroundNode: Element | null = element;
        let background = getComputedStyle(element).backgroundColor;
        while (backgroundNode && background === "rgba(0, 0, 0, 0)") {
          backgroundNode = backgroundNode.parentElement;
          if (backgroundNode) background = getComputedStyle(backgroundNode).backgroundColor;
        }
        const text = luminance(getComputedStyle(element).color);
        const surface = luminance(background);
        return (Math.max(text, surface) + 0.05) / (Math.min(text, surface) + 0.05);
      });
      expect(ratio, `"${name}" text contrast`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("invalid credentials show the backend error and allow another attempt", async ({
    login,
  }) => {
    await login.goto();
    await login.signIn("unknown@example.com", "wrong-password");
    await expect(login.toast("Invalid login credentials")).toBeVisible();
    await expect(login.page.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });

  for (const [account, destination] of [
    ["new", "/onboarding"],
    ["learner", "/learn"],
    ["participant", "/dashboard"],
    ["facilitator", "/facilitator"],
  ] as const) {
    test(`${account} accounts are routed to ${destination}`, async ({ login }) => {
      await login.signInAs(account);
      await expect(login.page).toHaveURL(new RegExp(`${destination}$`));
    });
  }

  test("protected participant pages send anonymous visitors to sign in", async ({ login }) => {
    await login.page.goto("/dashboard");
    await expect(login.page).toHaveURL(/\/auth\/login$/);
  });

  test("responsive navigation opens, marks the current page, and navigates", async ({
    login,
    dashboard,
  }) => {
    await dashboard.page.setViewportSize({ width: 390, height: 844 });
    await login.signInAs("participant");
    await dashboard.openMobileNavigation();
    await expect(dashboard.mobileNavigation().getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await dashboard.mobileNavigation().getByRole("link", { name: "Regional map" }).click();
    await expect(dashboard.page).toHaveURL(/\/map$/);
  });
});
