// Generates the demo's copies of the shadcn registry components.
//
// The registry files are the source of truth. They import `@/components/ui/*`, which resolves through a
// consumer's own shadcn setup, so the demo cannot use them as they are — it needs the same code pointing at
// its own vendored components. That is the only difference, so the demo copies are derived rather than
// maintained by hand.
//
//   node scripts/sync-registry-copies.mjs           write the copies
//   node scripts/sync-registry-copies.mjs --check    fail if any copy is stale (used by CI)

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Each registry variant and the demo file derived from it. */
const VARIANTS = [
  {
    source: "registry/base-vega/overflow-list/overflow-list.tsx",
    target: "demo/src/components/shadcn-base-ui/overflow-list-base.tsx",
    demoComponentsDir: "shadcn-base-ui",
  },
  {
    source: "registry/radix-vega/overflow-list/overflow-list.tsx",
    target: "demo/src/components/shadcn-radix-ui/overflow-list-radix.tsx",
    demoComponentsDir: "shadcn-radix-ui",
  },
];

const USE_CLIENT = '"use client";\n';

function banner(source) {
  return [
    "",
    "// GENERATED FILE — do not edit.",
    `// Source: ${source}`,
    "// The registry copy imports `@/components/ui/*`, which resolves through a consumer's own shadcn setup.",
    "// This copy points at the demo's vendored components instead. Regenerate with `pnpm sync:registry`.",
    "",
  ].join("\n");
}

function generate({ source, demoComponentsDir }) {
  const registrySource = readFileSync(resolve(repoRoot, source), "utf8");

  if (!registrySource.startsWith(USE_CLIENT)) {
    throw new Error(`${source} no longer starts with "use client"; the generator's banner placement assumes it does.`);
  }

  const rewritten = registrySource
    .slice(USE_CLIENT.length)
    .replaceAll("@/components/ui/", `@/components/${demoComponentsDir}/`);

  if (rewritten.includes("@/components/ui/")) {
    throw new Error(`${source} still references @/components/ui/ after rewriting.`);
  }

  return USE_CLIENT + banner(source) + rewritten;
}

const check = process.argv.includes("--check");
const stale = [];

for (const variant of VARIANTS) {
  const expected = generate(variant);
  const targetPath = resolve(repoRoot, variant.target);

  if (check) {
    let current = null;
    try {
      current = readFileSync(targetPath, "utf8");
    } catch {
      // missing file counts as stale
    }
    if (current !== expected) stale.push(variant.target);
    continue;
  }

  writeFileSync(targetPath, expected);
  console.log(`wrote ${variant.target}`);
}

if (check) {
  if (stale.length > 0) {
    console.error(`Stale generated files:\n${stale.map((f) => `  ${f}`).join("\n")}`);
    console.error("\nRun `pnpm sync:registry` and commit the result.");
    process.exit(1);
  }
  console.log(`${VARIANTS.length} generated files up to date.`);
}
