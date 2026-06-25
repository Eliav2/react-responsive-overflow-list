// Headless hook driving the responsive-overflow-list measurement state machine.
// Mirrors the original `OverflowList` primitive's logic exactly so that any consumer —
// the JSX `OverflowList` wrapper or a custom layout (e.g. FilterChipBar) — gets
// identical visible/hidden item behaviour.
//
// Technical details:
// Uses a three-phases approach:
// 1. "measuring" renders all items to calculate positions,
// 2. "measuring overflow" render all items fit in the container, try to add the overflow indicator item to the container. check if it opens a new row, if so, remove the last item from the last row.
// 3. "normal" phase shows only what fits within constraints. (this is the stable state that we want to keep)

import { useRef, useState } from "react";

import { getRowPositionsData } from "../utils";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useResizeObserver } from "./useResizeObserver";

export type OverflowListPhase = "normal" | "measuring" | "measuring-overflow-indicator";

export interface UseOverflowListOptions {
  /** Total number of items the consumer wants to render. */
  itemCount: number;
  /** Max rows the items are allowed to occupy. Default 1. */
  maxRows?: number;
  /** Hard cap on visible items. Default 100. */
  maxVisibleItems?: number;
  /**
   * After the container dimensions change, flush the state immediately (default is true).
   * If true, using flushSync to update the state immediately - this can affect performance but avoid flickering.
   * If false, using requestAnimationFrame to update the state - this avoid forced reflow and improve performance.
   */
  flushImmediately?: boolean;
}

export interface UseOverflowListReturn<
  TContainer extends HTMLElement = HTMLElement,
  TOverflow extends HTMLElement = HTMLElement,
> {
  /** Attach to the flex-wrap container that holds the items. */
  containerRef: React.RefObject<TContainer | null>;
  /** Attach to the overflow indicator element so its width is measured. */
  overflowIndicatorRef: React.RefObject<TOverflow | null>;
  /** Final visible count = visibleCount - subtractCount (matches original primitive's `finalVisibleCount`). */
  visibleCount: number;
  /** Number of items hidden by the overflow indicator (items.length - visibleCount). */
  hiddenCount: number;
  /** Current measurement phase — consumers must use this to decide item visibility. */
  phase: OverflowListPhase;
  /**
   * True when the overflow indicator should be rendered. False during the initial
   * "measuring" phase so all items can be measured without the indicator interfering.
   */
  showOverflow: boolean;
}

export function useOverflowList<
  TContainer extends HTMLElement = HTMLElement,
  TOverflow extends HTMLElement = HTMLElement,
>({
  itemCount,
  maxRows = 1,
  maxVisibleItems = 100,
  flushImmediately = true,
}: UseOverflowListOptions): UseOverflowListReturn<TContainer, TOverflow> {
  const [visibleCount, setVisibleCount] = useState(itemCount);
  const [subtractCount, setSubtractCount] = useState(0);
  const [phase, setPhase] = useState<OverflowListPhase>("normal");

  const containerRef = useRef<TContainer | null>(null);
  const overflowIndicatorRef = useRef<TOverflow | null>(null);

  const finalVisibleCount = visibleCount - subtractCount;
  const overflowCount = itemCount - finalVisibleCount;
  const showOverflow = overflowCount > 0 && phase !== "measuring";

  // Unified method that handles both growing and shrinking
  // this function is called in measuring phase, and it is used to measure how many items can fit in the container
  const countVisibleItems = () => {
    const rowData = getRowPositionsData(containerRef, overflowIndicatorRef);
    if (!rowData) return;

    const { itemsSizesMap, rowPositions } = rowData;

    // edge case: if only 1 item is given, check if its width is bigger than the container width, if so set the maxRows to 0 (there is not enough space for the item, so we showing overflow indicator)
    if (itemCount === 1) {
      const itemRef = itemsSizesMap[rowPositions[0]].elements.values().next().value;
      const containerWidth = containerRef.current?.getBoundingClientRect().width ?? 0;
      const itemWidth = itemRef?.getBoundingClientRect().width ?? 0;

      if (itemWidth > containerWidth) {
        setVisibleCount(0);
      } else setVisibleCount(1);
      return;
    }

    // Only take up to maxRows
    const visibleRowPositions = rowPositions.slice(0, maxRows);

    // only items in rows that conform to the maxRows constraint can be visible
    let fittingCount = visibleRowPositions.reduce((acc, position) => {
      return acc + itemsSizesMap[position].elements.size;
    }, 0);

    // Ensure we respect maxVisibleItems
    fittingCount = Math.min(fittingCount, maxVisibleItems);

    // Only update state if the number of visible items has changed
    setVisibleCount(fittingCount);
  };

  const updateOverflowIndicator = () => {
    // Nothing left to subtract—either we already hid every visible item or there were none to begin with.
    // Avoid looping indefinitely by exiting early.
    if (finalVisibleCount <= 0) {
      return false;
    }

    if (!overflowIndicatorRef.current) return false;
    const rowData = getRowPositionsData(containerRef, overflowIndicatorRef);
    if (!rowData) return false;

    const { rowPositions, itemsSizesMap } = rowData;

    const overflowRect = overflowIndicatorRef.current.getBoundingClientRect();
    const overflowMiddleY = overflowRect.top + overflowRect.height / 2;
    const lastRowTop = rowPositions[rowPositions.length - 1];
    const lastRow = itemsSizesMap[lastRowTop];

    // The visible items themselves may occupy more than maxRows once the container
    // settles at its final (narrower) width — countVisibleItems measured them while
    // all items were rendered (a wider container if it is a content-sized flex item).
    const itemRowCount = rowPositions.length;

    // Subtract if either the visible items overflow maxRows, or the overflow
    // indicator opens a new row below the last item row.
    const indicatorOpensNewRow = overflowMiddleY > lastRow.bottom;
    if (itemRowCount > maxRows || indicatorOpensNewRow) {
      setSubtractCount((c) => c + 1);
      return true;
    }
    return false;
  };

  // Reset state when items change
  useIsoLayoutEffect(() => {
    setPhase("measuring");
    setVisibleCount(itemCount);
    setSubtractCount(0);
  }, [itemCount, maxRows]);

  useIsoLayoutEffect(() => {
    // in measurement, evaluate results
    if (phase === "measuring") {
      countVisibleItems();
      setPhase("measuring-overflow-indicator");
    }
  }, [phase]);

  useIsoLayoutEffect(() => {
    // After placing the overflow indicator, evaluate if it ends up opening a new row
    if (phase === "measuring-overflow-indicator") {
      const updateWasNeeded = updateOverflowIndicator();
      if (!updateWasNeeded) {
        setPhase("normal");
      }
    }
  }, [phase, subtractCount]);

  // if the container dimensions change, re-measure
  const containerDims = useResizeObserver(containerRef, flushImmediately);
  useIsoLayoutEffect(() => {
    if (phase === "normal") {
      setPhase("measuring");
      setSubtractCount(0);
    }
  }, [containerDims]);

  return {
    containerRef,
    overflowIndicatorRef,
    visibleCount: finalVisibleCount,
    hiddenCount: overflowCount,
    phase,
    showOverflow,
  };
}
