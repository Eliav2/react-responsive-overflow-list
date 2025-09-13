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

  nodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const top = Math.round(rect.top);
    const bottom = Math.round(rect.bottom);

    if (!result[top]) {
      result[top] = {
        elements: new Set<HTMLElement>(),
        bottom: bottom,
        top: top,
      };
    } else {
      // Update bottom to be the maximum bottom of all elements in this row
      result[top].bottom = Math.max(result[top].bottom, bottom);
    }

    result[top].elements.add(node);
  });

  return result;
}

/**
 * Helper function to get row information from container
 * Returns itemsSizesMap, rowPositions, and children or null if the container is not available
 */
export function getRowPositionsData(
  containerRef: React.RefObject<HTMLElement | null>,
  overflowRef: React.RefObject<HTMLElement | null>
): {
  itemsSizesMap: Record<number, NodePosition>;
  rowPositions: number[];
  children: HTMLElement[];
} | null {
  if (!containerRef.current) return null;

  const container = containerRef.current;
  const children = Array.from(container.children).filter((child) => overflowRef.current !== child) as HTMLElement[];

  if (children.length === 0) return null;

  // Group elements by their vertical position (rows)
  const itemsSizesMap = groupNodesByTopPosition(children);

  // Get all the vertical positions (rows)
  const rowPositions = Object.keys(itemsSizesMap).map(Number);

  return { itemsSizesMap, rowPositions, children };
}
