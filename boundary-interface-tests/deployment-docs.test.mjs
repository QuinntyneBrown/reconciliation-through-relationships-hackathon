import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const deploymentDocs = path.join(root, "docs", "deployment");

async function readDeploymentDoc(filename) {
  return readFile(path.join(deploymentDocs, filename), "utf8");
}

test("deployment comparison gives decision-ready monthly costs", async () => {
  const comparison = await readDeploymentDoc("README.md");

  for (const provider of ["AWS", "Azure", "DigitalOcean"]) {
    assert.match(comparison, new RegExp(provider, "i"));
  }

  assert.match(comparison, /USD/i);
  assert.match(comparison, /monthly/i);
  assert.match(comparison, /prototype/i);
  assert.match(comparison, /production/i);
  assert.match(comparison, /recommend/i);
  assert.match(comparison, /July 11, 2026/i);
  assert.match(comparison, /Azure, scale to zero[^\n]+\*\*\$0 prototype\*\*/i);
  assert.match(comparison, /DigitalOcean, 1 GiB fixed[^\n]+\*\*\$35 small production\*\*/i);
  assert.match(comparison, /AWS Lightsail, 2 GiB[^\n]+\*\*\$37 small production\*\*/i);
});

for (const [provider, filename, providerDomain, expectedTotals] of [
  ["AWS", "AWS.md", "aws.amazon.com", ["$7.00", "$37.00"]],
  ["Azure", "AZURE.md", "azure.microsoft.com", ["$0", "$25.00", "$38.61"]],
  ["DigitalOcean", "DIGITALOCEAN.md", "digitalocean.com", ["$5.00", "$35.00"]],
]) {
  test(`${provider} plan is deployable and cost-auditable`, async () => {
    const plan = await readDeploymentDoc(filename);

    for (const expected of [
      /architecture/i,
      /assumptions/i,
      /monthly cost/i,
      /deployment/i,
      /environment variable/i,
      /rollback/i,
      /monitor/i,
      /Supabase/i,
      /DATA_SOURCE/i,
      /NEXT_PUBLIC_SUPABASE_URL/i,
      /pricing source/i,
      /July 11, 2026/i,
    ]) {
      assert.match(plan, expected);
    }

    assert.match(plan, /https:\/\//i);
    assert.match(plan, /USD/i);
    assert.match(plan, new RegExp(providerDomain.replaceAll(".", "\\.")));
    assert.match(plan, /supabase\.com\/pricing/i);
    for (const total of expectedTotals) {
      assert.ok(plan.includes(total), `${filename} should include the ${total} total`);
    }
  });
}
