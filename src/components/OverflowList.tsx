import React, { useRef, useState } from "react";
import { useForkRef, useIsoLayoutEffect, useResizeObserver } from "../hooks";
import { getRowPositionsData } from "../utils";
import { DefaultOverflowElement } from "./DefaultOverflowMenu";

type BaseComponentProps = React.HTMLAttributes<HTMLElement>;

type BaseOverflowListProps<T> = BaseComponentProps & {
  // Polymorphic component prop - allows changing the host element
  as?: React.ElementType;

  // would define the maximum number of rows that can be visible (default is 1)
  maxRows?: number;

  // would define the maximum number of items that can be visible (default is 100)
  maxVisibleItems?: number;

  // would define the overflow item renderer, applied only to overflow items (default is the same as renderItem)
  renderOverflowItem?: (item: NoInfer<T>, index: number) => React.ReactNode;
  // overflow renderer, applied only to overflow items (default is a dropdown menu - DefaultOverflowMenu component)
  renderOverflow?: (items: NoInfer<T>[]) => React.ReactNode;
  // would define the props to pass to the overflow indicator button
  renderOverflowProps?: Partial<OverflowElementProps<T>>;

  // after the container dimensions change, flush the state immediately (default is true)
  // if true, using flushSync to update the state immediately - this can affect performance but avoid flickering
  // if false, using requestAnimationFrame to update the state - this avoid forced reflow and improve performance
  flushImmediately?: boolean;
};

type OverflowListWithItems<T> = BaseOverflowListProps<T> & {
  // would define the items to render in the list
  items: T[];
  // would define the default item renderer, applied both to visible and overflow items
  renderItem: (item: NoInfer<T>, index: number) => React.ReactNode;
  children?: never;
};

type OverflowListWithChildren<T> = BaseOverflowListProps<T> & {
  children: React.ReactNode;
  items?: never;
  renderItem?: never;
};

export type OverflowListProps<T> = OverflowListWithItems<T> | OverflowListWithChildren<T>;

export interface OverflowElementProps<T> {
  items: T[];
}

/**
 * Responsive container that shows as many items as can fit within maxRows,
 * hiding overflow items behind a configurable overflow renderer.
 * Automatically recalculates visible items on resize.
 *
 * Technical details:
 * Uses a three-phases approach:
 * 1. "measuring" renders all items to calculate positions,
 * 2. "measuring overflow" render all items fit in the container, try to add the overflow indicator item to the container. check if it opens a new row, if so, remove the last item from the last row.
 * 3. "normal" phase shows only what fits within constraints. (this is the stable state that we want to keep)
 */
export const OverflowList = React.memo(
  React.forwardRef(function OverflowList<T>(props: OverflowListProps<T>, forwardedRef: React.Ref<HTMLElement>) {
    const {
      as: Component = "div",
      children,
      // if items is not provided, use children as items
      items = React.Children.toArray(children),
      renderOverflow,
      // if renderItem is not provided, this component is used in the children pattern, means each item is simply a React.ReactNode
      renderItem = (item) => item as React.ReactNode,
      renderOverflowItem,
      renderOverflowProps,
      maxRows = 1,
      maxVisibleItems = 100,
      flushImmediately = true,

      ...containerProps
    } = props;

    const [visibleCount, setVisibleCount] = useState(items.length);
    const [subtractCount, setSubtractCount] = useState(0);
    const [phase, setPhase] = useState<"normal" | "measuring" | "measuring-overflow-indicator">("normal");

    const containerRef = useRef<HTMLElement>(null);
    const finalContainerRef = useForkRef(containerRef, forwardedRef);
    const finalVisibleCount = visibleCount - subtractCount;

    const overflowCount = items.length - finalVisibleCount;
    const showOverflow = overflowCount > 0 && phase !== "measuring";

    const finalRenderOverflow = renderOverflow?.(items.slice(finalVisibleCount) as T[]) ?? (
      <DefaultOverflowElement items={items.slice(finalVisibleCount) as T[]} {...renderOverflowProps} />
    );

    const overflowElement = showOverflow ? finalRenderOverflow : null;

    const overflowRef = useRef<HTMLElement>(null);
    // @ts-expect-error - ref is not exposed as type in jsx elements but it exists
    const finalOverflowRef = useForkRef(overflowRef, overflowElement?.ref);

    // Reset state when items change
    useIsoLayoutEffect(() => {
      setPhase("measuring");
      setVisibleCount(items.length);
      setSubtractCount(0);
    }, [items.length, maxRows]);

    // console.log("phase", phase);

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

    // Unified method that handles both growing and shrinking
    // this function is called in measuring phase, and it is used to measure how many items can fit in the container
    const countVisibleItems = () => {
      const rowData = getRowPositionsData(containerRef, overflowRef);
      if (!rowData) return;

      const { itemsSizesMap, rowPositions } = rowData;

      // edge case: if only 1 item is given, check if its width is bigger than the container width, if so set the maxRows to 0 (there is not enough space for the item, so we showing overflow indicator)
      if (items.length === 1) {
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
      if (!overflowRef.current) return false;
      const rowData = getRowPositionsData(containerRef, overflowRef);
      if (!rowData) return false;

      const { rowPositions, itemsSizesMap } = rowData;

      const overflowRect = overflowRef.current.getBoundingClientRect();
      const overflowMiddleY = overflowRect.top + overflowRect.height / 2;
      const lastRowTop = rowPositions[rowPositions.length - 1];
      const lastRow = itemsSizesMap[lastRowTop];
      // console.log("overflowMiddleY", overflowMiddleY);
      // console.log("lastRow.bottom", lastRow.bottom);

      // if the overflow indicator item opens a new row(we check it by the middle of the item)
      if (overflowMiddleY > lastRow.bottom) {
        setSubtractCount((c) => c + 1);
        return true;
      }
      return false;
    };

    // Cloned overflow element that ensures ref is passed so we could measure dimensions on this element
    const clonedOverflowElement = overflowElement
      ? React.cloneElement(overflowElement as React.ReactElement<any>, {
          ref: finalOverflowRef,
        })
      : null;

    // Get the items to render based on current state

    // we can render only up to maxVisibleItems items and maxRows rows
    let finalItems = items;
    if (maxVisibleItems) {
      finalItems = finalItems.slice(0, maxVisibleItems);
    }

    const containerStyles: React.CSSProperties = {
      ...DEFAULT_CONTAINER_STYLES,
      ...containerProps.style,
    };

    return (
      <Component {...containerProps} ref={finalContainerRef} style={containerStyles}>
        {finalItems.map((item, index) => {
          const isVisible =
            phase ===
              // in measuring phase, show all items
              "measuring" ||
            // in 'normal' phase, show only the N items that fit
            index < finalVisibleCount;
          if (!isVisible) return null;
          const itemComponent = renderItem(item as T, index);

          return <React.Fragment key={index}>{itemComponent}</React.Fragment>;
        })}

        {clonedOverflowElement}
      </Component>
    );
  })
) as (props: OverflowListProps<any> & { ref?: React.Ref<HTMLElement> }) => React.ReactElement;

const DEFAULT_CONTAINER_STYLES: React.CSSProperties = {
  position: "relative",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  minWidth: 0,
  gap: "4px",
  contain: "layout style",
};
