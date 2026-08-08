// @vitest-environment jsdom
// The change-detection signal, tested directly. These are the cases that argue for keeping the signature an
// ordered sequence: every attempt to reduce it to one number collides on some pair of layouts that behave
// differently, and every attempt to compare it by index alone misses a truncation.

import { describe, expect, it } from "vitest";
import { getContentSignature, isSameContentSignature } from "../../src/utils";
import { installLayoutHarness } from "./layout-harness";

/** Builds a container of children with the given widths and returns a ref-like handle to it. */
function containerWith(widths: number[], extras: { hidden?: number[]; fixed?: number[] } = {}) {
  const container = document.createElement("div");
  container.setAttribute("data-test-container", "");
  for (const width of widths) {
    const child = document.createElement("span");
    child.setAttribute("data-test-width", String(width));
    container.appendChild(child);
  }
  for (const width of extras.hidden ?? []) {
    const child = document.createElement("span");
    child.setAttribute("data-test-width", String(width));
    child.setAttribute("data-test-hidden", "true");
    container.appendChild(child);
  }
  for (const width of extras.fixed ?? []) {
    const child = document.createElement("span");
    child.setAttribute("data-test-width", String(width));
    child.style.position = "fixed";
    container.appendChild(child);
  }
  document.body.appendChild(container);
  return { current: container };
}

describe("isSameContentSignature", () => {
  it("reports identical sequences as unchanged", () => {
    expect(isSameContentSignature([40, 20, 60, 20], [40, 20, 60, 20])).toBe(true);
  });

  it("reports a differing entry as changed", () => {
    expect(isSameContentSignature([40, 20, 60, 20], [40, 20, 61, 20])).toBe(false);
  });

  it("catches changes smaller than a pixel", () => {
    // A counter going from `5` to `6` in a font with proportional digits moves a width by hundredths of a
    // pixel. Any tolerance would discard it.
    expect(isSameContentSignature([40, 20], [40.0078125, 20])).toBe(false);
  });

  it("catches a truncated sequence", () => {
    // Comparing by index alone would walk only the shorter sequence and report no change.
    expect(isSameContentSignature([40, 20, 60, 20], [40, 20])).toBe(false);
  });

  it("catches a longer sequence", () => {
    expect(isSameContentSignature([40, 20], [40, 20, 60, 20])).toBe(false);
  });

  it("catches a redistribution that leaves the total unchanged", () => {
    // Reducing the signature to a sum would read these as equal: both total 240. They do not lay out the
    // same, because what fits is decided by the running sum along the row.
    const a = [40, 20, 40, 20, 40, 20];
    const b = [90, 20, 20, 20, 10, 20];
    expect(a.reduce((t, n) => t + n, 0)).toBe(b.reduce((t, n) => t + n, 0));
    expect(isSameContentSignature(a, b)).toBe(false);
  });

  it("catches a redistribution that leaves a position-weighted total unchanged", () => {
    // Weighting each entry by its position was the previous attempt, and it collides too: 40 + 60*2 equals
    // 50 + 55*2. At a 100px capacity the first pair fits both items and the second fits one.
    const a = [40, 60];
    const b = [50, 55];
    const weighted = (v: number[]) => v.reduce((total, n, i) => total + n * (i + 1), 0);
    expect(weighted(a)).toBe(weighted(b));
    expect(isSameContentSignature(a, b)).toBe(false);
  });
});

describe("getContentSignature", () => {
  it("returns null without a container", () => {
    expect(getContentSignature({ current: null })).toBeNull();
  });

  it("collects width and height per laid-out child, in order", () => {
    const harness = installLayoutHarness({ containerWidth: 500 });
    try {
      expect(getContentSignature(containerWith([40, 60]))).toEqual([40, 20, 60, 20]);
    } finally {
      harness.restore();
    }
  });

  it("excludes children with no boxes and children out of flow", () => {
    const harness = installLayoutHarness({ containerWidth: 500 });
    try {
      const signature = getContentSignature(containerWith([40], { hidden: [100], fixed: [1] }));
      // Only the one laid-out child contributes, so a hidden item or a focus guard cannot shift the sequence.
      expect(signature).toEqual([40, 20]);
    } finally {
      harness.restore();
    }
  });

  it("tracks the visible count rather than the item count", () => {
    const harness = installLayoutHarness({ containerWidth: 500 });
    try {
      const signature = getContentSignature(containerWith([40, 40], { hidden: [40, 40, 40] }));
      expect(signature).toHaveLength(4);
    } finally {
      harness.restore();
    }
  });
});
