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
	containerRef: React.RefObject<HTMLDivElement>,
	overflowRef: React.RefObject<HTMLDivElement>,
) {
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

/**
 * Creates a range extractor function for TanStack Virtual that limits the number of rendered items
 * while properly handling overscan for smooth scrolling performance
 *
 * Note: This is an optional utility for advanced use cases with virtualization.
 * The default OverflowMenu does not use virtualization.
 *
 * @param maxItems - Maximum number of items to render at once
 * @returns A range extractor function that can be used with useVirtualizer
 */
export function createLimitedRangeExtractor(maxItems: number) {
	return (range: { startIndex: number; endIndex: number; overscan: number; count: number }) => {
		// Calculate the start and end with overscan applied
		const startWithOverscan = Math.max(0, range.startIndex - range.overscan);
		const endWithOverscan = Math.min(range.count - 1, range.endIndex + range.overscan);

		// Calculate the total range size
		const rangeSize = endWithOverscan - startWithOverscan + 1;

		// Limit to maxItems while respecting the actual range
		const itemsToRender = Math.min(rangeSize, maxItems);

		// Create array of indexes starting from startWithOverscan
		const arr = Array.from({ length: itemsToRender }, (_, i) => startWithOverscan + i);

		return arr;
	};
}
