import React from "react";

/**
 * Groups HTML elements by their vertical position (top coordinate)
 * and includes bottom position information
 */
export interface NodePosition {
  elements: Set<HTMLElement>;
  bottom: number;
  top: number;
}

export function groupNodesByTopPosition(nodes: HTMLElement[]): Record<number, NodePosition> {
  if (nodes.length === 0) return {};

  const result: Record<number, NodePosition> = {};
  let lastRowKey: number | undefined;

  nodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const top = Math.round(rect.top);
    const bottom = Math.round(rect.bottom);

    // Check if this element overlaps vertically with the last row
    const lastRow = lastRowKey !== undefined ? result[lastRowKey] : undefined;
    if (lastRow && top < lastRow.bottom && bottom > lastRow.top) {
      lastRow.top = Math.min(lastRow.top, top);
      lastRow.bottom = Math.max(lastRow.bottom, bottom);
      lastRow.elements.add(node);
    } else {
      result[top] = {
        elements: new Set<HTMLElement>(),
        bottom: bottom,
        top: top,
      };
      result[top].elements.add(node);
      lastRowKey = top;
    }
  });

  return result;
}

/**
 * Whether a container child takes part in the flex flow, and therefore in row layout.
 */
function isLaidOutInFlow(child: Element): boolean {
  // A child with no client rects is not laid out at all — `display: none`, the `hidden` attribute, or
  // an overflowed item kept mounted but hidden (that is what React 19.2's `Activity mode="hidden"`
  // does, and it is the default `renderItemVisibility`). Its rect reads as all zeros, so it would be
  // grouped into a phantom row keyed at top 0.
  if (child.getClientRects().length === 0) return false;

  // An out-of-flow child is not a flex item, so it never takes part in a row either. Popover
  // libraries put focus guards next to an open trigger this way (Base UI wraps the trigger in
  // `position: fixed` 1px spans), and their top lands outside the items' row.
  const { position } = getComputedStyle(child);
  if (position === "absolute" || position === "fixed") return false;

  return true;
}

/**
 * Sizes of everything currently laid out in the container, in order, the overflow indicator included. Not
 * a measurement — only a value to compare against itself across renders.
 *
 * Measurement is re-triggered when the container's own box changes or when `itemCount`/`maxRows` change,
 * so items that change size on their own (a counter badge growing from `9` to `10`, say) leave the visible
 * count stale. Usually the wrap that follows makes the container taller and its ResizeObserver rescues us,
 * but when the container's box is fixed — an ordinary tab bar — nothing ever re-triggers a pass. Comparing
 * this signature catches both directions: items growing past the row, and items shrinking so that more of
 * them would now fit.
 *
 * Kept as the ordered sequence of sizes rather than reduced to a total, because no scalar can stand in for
 * it. Which items fit is decided by the running sum along the row, not by the sum of all of them: at
 * capacity 100, widths `[40, 60]` fit both items while `[50, 55]` fit one. Any accumulation collides on
 * pairs like those — a plain total misses two counters swapping values, and weighting each size by its
 * position still maps `[40, 60]` and `[50, 55]` to the same number.
 *
 * Collecting the sizes rather than accumulating them costs nothing measurable; the `getBoundingClientRect`
 * and `getComputedStyle` reads dominate either way. The sequence is also short: this only runs once
 * settled, where the overflowed items are hidden and excluded, so its length tracks the visible count.
 */
export function getContentSignature(containerRef: React.RefObject<HTMLElement | null>): number[] | null {
  if (!containerRef.current) return null;

  const signature: number[] = [];
  for (const child of Array.from(containerRef.current.children)) {
    if (!isLaidOutInFlow(child)) continue;
    const rect = child.getBoundingClientRect();
    signature.push(rect.width, rect.height);
  }

  return signature;
}

/**
 * Compares two content signatures. Length first: comparing only by index would silently treat a truncated
 * sequence as unchanged.
 */
export function isSameContentSignature(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Helper function to get row information from container
 * Returns itemsSizesMap, rowPositions, and children or null if the container is not available
 */
export function getRowPositionsData(
  containerRef: React.RefObject<HTMLElement | null>,
  overflowRef: React.RefObject<HTMLElement | null>,
): {
  itemsSizesMap: Record<number, NodePosition>;
  rowPositions: number[];
  children: HTMLElement[];
} | null {
  if (!containerRef.current) return null;

  const container = containerRef.current;
  const children = Array.from(container.children).filter(
    (child) => overflowRef.current !== child && isLaidOutInFlow(child),
  ) as HTMLElement[];

  // Row keys are read in ascending numeric order, so any of the children filtered out above would sort
  // ahead of the real items and be measured as the first row — which reports a visible count of however
  // many non-items there were, and (since v0.4.1's `itemRowCount > maxRows` check) makes
  // `updateOverflowIndicator` subtract until the list collapses to a bare overflow indicator.
  if (children.length === 0) return null;

  // Group elements by their vertical position (rows)
  const itemsSizesMap = groupNodesByTopPosition(children);

  // Get all the vertical positions (rows)
  const rowPositions = Object.keys(itemsSizesMap).map(Number);

  return { itemsSizesMap, rowPositions, children };
}
