/**
 * Regenerates every screenshot in docs/design-system/images from the static
 * specimen pages (docs/mocks/design-system.html and
 * docs/design-system/specimens/extras.html).
 *
 * Usage: node docs/design-system/tools/capture-screenshots.mjs
 *
 * Screenshots are captured at 2x device scale from a 1280px viewport.
 * Google Fonts (Fraunces, Atkinson Hyperlegible) load from the network; when
 * offline the captures fall back to system fonts — re-run online before
 * publishing.
 */

import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..");
const imagesDir = path.join(repoRoot, "docs", "design-system", "images");

/**
 * Each entry: output name → { sel, nth, all, pad }.
 *  - sel: CSS selector on the page
 *  - nth: pick the nth match (default 0)
 *  - all: union the bounding boxes of every match
 *  - pad: whitespace around the crop in CSS px (default 12)
 */
const PAGES = [
  {
    file: "docs/mocks/design-system.html",
    shots: {
      "page-intro": { sel: "main > .page-title", pad: 6 },
      "color-palette": { sel: "#color .grid" },
      "typography-scale": { sel: "#type .type-row", all: true, pad: 16 },
      "brand-marks": { sel: "#brand .grid" },
      "panel-on-dark": { sel: "#panel .panel-on-dark" },
      "cohort-circle": { sel: "#cohort .demo-row", pad: 16 },
      "button-variants": { sel: "#buttons .demo-row", nth: 0, pad: 8 },
      "button-sizes": { sel: "#buttons .demo-row", nth: 1, pad: 8 },
      "button-icons": { sel: "#buttons .demo-row", nth: 2, pad: 8 },
      "button-on-dark": { sel: "#buttons .demo-dark" },
      "form-text-fields": { sel: "#forms .demo-box", nth: 0 },
      "form-choices": { sel: "#forms .demo-box", nth: 1 },
      "choice-cards": { sel: "#forms .grid.cols-3", pad: 6 },
      switch: { sel: "#switch .demo-box" },
      "badge-captions": { sel: "#status .demo-row", nth: 0, pad: 8 },
      "badge-status-pills": { sel: "#status .demo-row", nth: 1, pad: 8 },
      "badge-interest-tags": { sel: "#status .demo-row", nth: 2, pad: 8 },
      "avatar-sizes": { sel: "#avatars .demo-row", nth: 0, pad: 8 },
      "avatar-tints": { sel: "#avatars .demo-row", nth: 1, pad: 8 },
      cards: { sel: "#cards .grid.cols-3" },
      "stat-tiles": { sel: "#cards .grid.cols-4" },
      "list-rows": { sel: "#lists .stack" },
      progress: { sel: "#progress .demo-box" },
      stepper: { sel: "#stepper .demo-box" },
      "step-chips": { sel: "#stepchips .demo-box" },
      table: { sel: "#tables .table-wrap" },
      "app-header-participant": { sel: "#nav .nav-frame", nth: 0 },
      "app-header-facilitator": { sel: "#nav .nav-frame", nth: 1 },
      "breadcrumb-pagination": { sel: "#nav .demo-box" },
      tabs: { sel: "#tabs .demo-box" },
      alerts: { sel: "#alerts .stack" },
      toasts: { sel: "#toasts .overlay-demo" },
      "dropdown-menu": { sel: "#menu .overlay-demo" },
      "notification-bells": { sel: "#notifications .overlay-demo .row", nth: 0, pad: 8 },
      "notification-panel": { sel: "#notifications .menu-panel.notif-panel", nth: 0, pad: 8 },
      "notification-empty": { sel: "#notifications .menu-panel.notif-panel", nth: 1, pad: 8 },
      dialog: { sel: "#dialogs .modal", pad: 32 },
      sheet: { sel: "#sheet .overlay-demo" },
      "empty-states": { sel: "#empty .grid" },
      "message-bubbles": { sel: "#messages .demo-box" },
      "a11y-commitments": { sel: "#a11y .grid" },
      "app-footer": { sel: "footer.app-footer", pad: 0 },
    },
  },
  {
    file: "docs/design-system/specimens/extras.html",
    shots: {
      tooltip: { sel: "#tooltip .demo-box" },
      skeleton: { sel: "#skeleton .demo-box" },
      slider: { sel: "#slider .demo-box" },
      separator: { sel: "#separator .demo-box" },
    },
  },
];

async function unionBox(page, sel, { nth = 0, all = false } = {}) {
  return page.evaluate(
    ([sel, nth, all]) => {
      const matches = [...document.querySelectorAll(sel)];
      const picked = all ? matches : matches[nth] ? [matches[nth]] : [];
      if (picked.length === 0) return null;
      let x1 = Infinity,
        y1 = Infinity,
        x2 = -Infinity,
        y2 = -Infinity;
      for (const el of picked) {
        const r = el.getBoundingClientRect();
        x1 = Math.min(x1, r.left + window.scrollX);
        y1 = Math.min(y1, r.top + window.scrollY);
        x2 = Math.max(x2, r.right + window.scrollX);
        y2 = Math.max(y2, r.bottom + window.scrollY);
      }
      return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
    },
    [sel, nth, all],
  );
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

fs.mkdirSync(imagesDir, { recursive: true });
let captured = 0;
const failures = [];

for (const { file, shots } of PAGES) {
  const url = pathToFileURL(path.join(repoRoot, file)).href;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  // Expand the viewport to the full page so clips never fall outside it.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width: 1280, height: Math.min(height + 50, 20000) });
  await page.waitForTimeout(150);

  for (const [name, spec] of Object.entries(shots)) {
    const box = await unionBox(page, spec.sel, spec);
    if (!box) {
      failures.push(`${file} → ${name}: no match for "${spec.sel}"`);
      continue;
    }
    const pad = spec.pad ?? 12;
    const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clip = {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: Math.min(box.width + pad * 2, pageWidth - Math.max(0, box.x - pad)),
      height: box.height + pad * 2,
    };
    await page.screenshot({ path: path.join(imagesDir, `${name}.png`), clip });
    captured++;
  }
}

await browser.close();

console.log(`Captured ${captured} screenshots into ${imagesDir}`);
if (failures.length > 0) {
  console.error("FAILED:\n" + failures.join("\n"));
  process.exit(1);
}
