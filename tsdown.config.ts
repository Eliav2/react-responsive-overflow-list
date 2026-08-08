import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  // Keep the published layout: dist/index.js (ESM) + dist/index.cjs (CJS).
  fixedExtension: false,
  // Guard the package manifest and declaration output so the resolution bugs
  // from issue #19 fail the build instead of reaching npm.
  attw: true,
  publint: true,
});
