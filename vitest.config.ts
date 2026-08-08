import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    // Node by default, since the consistency checks only read files off disk. The component tests opt into
    // jsdom with a `@vitest-environment jsdom` docblock.
    environment: "node",
  },
});
