// The registry components are duplicated on purpose: consumers install them via shadcn, and the demo needs
// the same code wired to its own vendored components. These tests guard the parts of that duplication that
// cannot be generated away.
//
// The demo copies themselves are generated — see scripts/sync-registry-copies.mjs. `pnpm sync:registry:check`
// is what enforces those, and CI runs it.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath: string) => readFileSync(resolve(repoRoot, relativePath), "utf8");

const BASE = "registry/base-vega/overflow-list/overflow-list.tsx";
const RADIX = "registry/radix-vega/overflow-list/overflow-list.tsx";

const REGISTRY_MANIFESTS = ["registry/base-vega/registry.json", "registry/radix-vega/registry.json"];

/**
 * The two variants wrap different popover libraries but are otherwise the same component. Base UI renders a
 * separate Positioner element, so it takes one extra prop that Radix has no equivalent for. Every other
 * difference is drift.
 */
const DECLARED_VARIANT_DIFFERENCES = ['positionerClassName="z-50"'];

describe("generated demo copies", () => {
  it("are up to date with the registry sources", () => {
    // Runs the generator's own check, so the test cannot drift from the generator's transform.
    expect(() =>
      execFileSync("node", ["scripts/sync-registry-copies.mjs", "--check"], { cwd: repoRoot, stdio: "pipe" }),
    ).not.toThrow();
  });
});

describe("registry variants", () => {
  it("differ only by the declared per-library differences", () => {
    const strip = (source: string) =>
      source
        .split("\n")
        .filter((line) => !DECLARED_VARIANT_DIFFERENCES.some((declared) => line.includes(declared)))
        .join("\n");

    expect(strip(read(BASE))).toBe(strip(read(RADIX)));
  });

  it("each declared difference is actually present in exactly one variant", () => {
    for (const declared of DECLARED_VARIANT_DIFFERENCES) {
      const inBase = read(BASE).includes(declared);
      const inRadix = read(RADIX).includes(declared);
      // Otherwise the exemption above is silently hiding nothing, or hiding a real difference in both.
      expect(inBase !== inRadix, `"${declared}" should appear in exactly one variant`).toBe(true);
    }
  });

  it("expose the same public API", () => {
    const exportsOf = (source: string) =>
      [...source.matchAll(/export (?:const|type|interface|function) (\w+)/g)].map((match) => match[1]).sort();

    expect(exportsOf(read(BASE))).toEqual(exportsOf(read(RADIX)));
  });
});

describe("registry manifests", () => {
  for (const manifest of REGISTRY_MANIFESTS) {
    describe(manifest, () => {
      const parsed = JSON.parse(read(manifest)) as {
        items: { name: string; files: { path: string; target: string }[] }[];
      };

      it("declares at least one item", () => {
        expect(parsed.items.length).toBeGreaterThan(0);
      });

      it("references files that exist on disk", () => {
        for (const item of parsed.items) {
          for (const file of item.files) {
            expect(existsSync(resolve(repoRoot, file.path)), `${file.path} is missing`).toBe(true);
          }
        }
      });

      it("depends on the published package by name", () => {
        const selfName = (JSON.parse(read("package.json")) as { name: string }).name;
        for (const item of parsed.items) {
          expect(read(item.files[0].path)).toContain(`from "${selfName}"`);
        }
      });
    });
  }
});
