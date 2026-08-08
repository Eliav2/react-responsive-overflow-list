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
 * Signature of the sizes of everything currently laid out in the container, the overflow indicator
 * included. Not a measurement — only a value to compare against itself across renders.
 *
 * Measurement is re-triggered when the container's own box changes or when `itemCount`/`maxRows` change,
 * so items that change size on their own (a counter badge growing from `9` to `10`, say) leave the visible
 * count stale. Usually the wrap that follows makes the container taller and its ResizeObserver rescues us,
 * but when the container's box is fixed — an ordinary tab bar — nothing ever re-triggers a pass. Comparing
 * this signature catches both directions: items growing past the row, and items shrinking so that more of
 * them would now fit.
 *
 * Each size is weighted by the child's position, so that changes cancelling out across items are still
 * seen. A plain total would miss them, and a total is not sufficient: which items fit is decided by the
 * running sum along the row, not by the sum of all of them. At capacity 120, widths `[40, 40, 40]` fit two
 * items while `[90, 20, 10]` fit one, on the same total.
 *
 * Values stay exact under comparison: engines lay out on a fractional-pixel grid (1/64px in Chromium), and
 * scaling those by a small integer and summing them is exactly representable in a double.
 */
export function getContentSignature(
  containerRef: React.RefObject<HTMLElement | null>,
): { width: number; height: number } | null {
  if (!containerRef.current) return null;

  let width = 0;
  let height = 0;
  let position = 0;
  for (const child of Array.from(containerRef.current.children)) {
    if (!isLaidOutInFlow(child)) continue;
    position += 1;
    const rect = child.getBoundingClientRect();
    width += rect.width * position;
    height += rect.height * position;
  }

  return { width, height };
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
