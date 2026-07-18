#!/usr/bin/env node
/**
 * Renders the RTR marketing one-sheets to PDF (desktop + mobile per doc)
 * using headless Chromium. No npm dependencies required.
 *
 *   node docs/marketing/src/build.mjs            # build all PDFs
 *   node docs/marketing/src/build.mjs --shots DIR  # also write PNG previews
 *
 * Chromium is resolved from $RTR_CHROMIUM, $PLAYWRIGHT_BROWSERS_PATH/chromium,
 * or `chromium` on PATH.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { docs, icons } from "./content.mjs";

const srcDir = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(srcDir, "..");
const buildDir = join(srcDir, ".build");

const shotsFlag = process.argv.indexOf("--shots");
const shotsDir = shotsFlag !== -1 ? resolve(process.argv[shotsFlag + 1]) : null;

const chromium =
  process.env.RTR_CHROMIUM ||
  (process.env.PLAYWRIGHT_BROWSERS_PATH &&
  existsSync(join(process.env.PLAYWRIGHT_BROWSERS_PATH, "chromium"))
    ? join(process.env.PLAYWRIGHT_BROWSERS_PATH, "chromium")
    : "chromium");

/* ---------------------------------------------------------------- markup */

const brandRow = (dark = true) => `
  <div class="brand-row">
    <span class="brand-mark">${dark ? icons.markOnDark : icons.mark}</span>
    <span class="brand-name">
      <span class="line1">Reconciliation</span>
      <span class="line2">Through Relationships</span>
    </span>
  </div>`;

const chip = (f, i) =>
  f.icon
    ? `<div class="icon-chip">${icons[f.icon]}</div>`
    : `<div class="step-num">${i + 1}</div>`;

const card = (f, i) => `
  <div class="card">
    ${chip(f, i)}
    <div class="card-body">
      <h3>${f.title}</h3>
      <p>${f.text}</p>
    </div>
  </div>`;

const stepsBlock = (doc, compact = false) =>
  doc.steps
    ? `
  <div class="steps${compact ? " compact" : ""}">
    <div class="section-title">${doc.stepsTitle}</div>
    <div class="cols">
      ${doc.steps
        .map(
          (s, i) => `
      <div class="col">
        <div class="num">${i + 1}</div>
        <div><h4>${s.title}</h4>${compact ? "" : `<p>${s.text}</p>`}</div>
      </div>`,
        )
        .join("")}
    </div>
  </div>`
    : "";

const commitmentsBlock = (doc, cardsClass) =>
  doc.commitments
    ? `
  <div>
    <div class="section-title">${doc.commitments.title}</div>
    <div class="cards ${cardsClass}" style="margin-top:12px">
      ${doc.commitments.items.map(card).join("")}
    </div>
  </div>`
    : "";

const highlightBlock = (doc) => `
  <div class="highlight panel-on-dark">
    <div class="quote">&ldquo;${doc.highlight.quote}&rdquo;</div>
    <p>${doc.highlight.text}</p>
  </div>`;

const footerBlock = () => `
  <footer>
    ${brandRow(true)}
    <div class="site">
      <span class="url">rightrelationship.ca</span>
      <span class="partner">In partnership with Reconciliation Through Relationships</span>
    </div>
  </footer>`;

function desktopHtml(doc) {
  const n = doc.features.length;
  const cardsClass =
    n >= 5 || doc.numberedFeatures ? "grid-2 compact" : n === 4 ? "grid-2" : "rows";
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title>${doc.title}</title>
<link rel="stylesheet" href="../brand.css">
<link rel="stylesheet" href="../desktop.css">
</head>
<body>
<div class="page">
  <section class="hero panel-on-dark">
    ${brandRow(true)}
    <span class="eyebrow on-dark">${doc.eyebrow}</span>
    <h1>${doc.title}</h1>
    <div class="weave-strip weave weave-on-dark"></div>
    <p class="lead">${doc.lead}</p>
  </section>
  <main>
    <div class="cards ${cardsClass}">
      ${doc.features.map(card).join("")}
    </div>
    ${stepsBlock(doc, doc.features.length >= 5)}
    ${commitmentsBlock(doc, "grid-3")}
    ${highlightBlock(doc)}
  </main>
  ${footerBlock()}
</div>
</body></html>`;
}

function mobileHtml(doc) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title>${doc.title}</title>
<link rel="stylesheet" href="../brand.css">
<link rel="stylesheet" href="../mobile.css">
</head>
<body>
<section class="m-hero panel-on-dark">
  ${brandRow(true)}
  <div class="hero-copy">
    <span class="eyebrow on-dark">${doc.eyebrow}</span>
    <h1>${doc.title}</h1>
    <div class="weave-strip weave weave-on-dark"></div>
    <p class="lead">${doc.lead}</p>
  </div>
  <div class="hero-foot">rightrelationship.ca</div>
</section>
<main>
  ${doc.features.map(card).join("")}
  ${stepsBlock(doc)}
  ${commitmentsBlock(doc, "")}
  ${highlightBlock(doc)}
</main>
<section class="back-cover panel-on-dark">
  <div class="cover-mark">${icons.markOnDark}</div>
  <div class="cover-name">
    <span class="line1">Reconciliation</span>
    <span class="line2">Through Relationships</span>
  </div>
  <div class="weave-strip weave weave-on-dark"></div>
  <div class="cover-tagline">The relationship is the work.</div>
  <div class="cover-foot">
    <span class="url">rightrelationship.ca</span>
    <span class="partner">In partnership with Reconciliation Through Relationships,
    in response to the Truth and Reconciliation Commission of Canada&rsquo;s Calls to Action.</span>
  </div>
</section>
</body></html>`;
}

/* ----------------------------------------------------------------- build */

function chromiumRun(args) {
  execFileSync(chromium, ["--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", ...args], {
    stdio: ["ignore", "ignore", "pipe"],
  });
}

function pdfPageCount(file) {
  const matches = readFileSync(file, "latin1").match(/\/Count (\d+)/g) || [];
  return Math.max(0, ...matches.map((m) => parseInt(m.slice(7), 10)));
}

rmSync(buildDir, { recursive: true, force: true });
mkdirSync(buildDir, { recursive: true });
if (shotsDir) mkdirSync(shotsDir, { recursive: true });

for (const doc of docs) {
  for (const [layout, html] of [
    ["desktop", desktopHtml(doc)],
    ["mobile", mobileHtml(doc)],
  ]) {
    const htmlFile = join(buildDir, `${doc.id}-${layout}.html`);
    const pdfFile = join(outDir, `${doc.id}-${layout}.pdf`);
    writeFileSync(htmlFile, html);
    chromiumRun([
      "--no-pdf-header-footer",
      "--virtual-time-budget=10000",
      `--print-to-pdf=${pdfFile}`,
      `file://${htmlFile}`,
    ]);
    const pages = pdfPageCount(pdfFile);
    console.log(`${doc.id}-${layout}.pdf  (${pages} page${pages === 1 ? "" : "s"})`);
    if (shotsDir) {
      const size = layout === "desktop" ? "816,1056" : "420,4600";
      chromiumRun([
        `--window-size=${size}`,
        "--virtual-time-budget=10000",
        `--screenshot=${join(shotsDir, `${doc.id}-${layout}.png`)}`,
        `file://${htmlFile}`,
      ]);
    }
  }
}
console.log("Done.");
