import React from "react";
import { useForkRef, useOverflowList } from "../hooks";
import { DefaultOverflowElement } from "./DefaultOverflowMenu";

type BaseComponentProps = React.HTMLAttributes<HTMLElement>;

export type RenderItemVisibilityMeta = {
  visible: boolean;
  index: number;
};

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

  // customize how each item is shown/hidden during measurement so you can keep custom elements mounted
  renderItemVisibility?: (node: React.ReactNode, meta: RenderItemVisibilityMeta) => React.ReactNode;
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

export type OverflowListComponent = <T>(
  props: OverflowListProps<T> & { ref?: React.Ref<HTMLElement> }
) => React.ReactElement;

export interface OverflowElementProps<T> {
  items: T[];
}

/**
 * Responsive container that shows as many items as can fit within maxRows,
 * hiding overflow items behind a configurable overflow renderer.
 * Automatically recalculates visible items on resize.
 *
 * Thin wrapper around `useOverflowList`: that hook owns the measurement state
 * machine; this component handles rendering items and the overflow indicator.
 */
const OverflowListComponent = React.memo(
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
      renderItemVisibility,
      maxRows = 1,
      maxVisibleItems = 100,
      flushImmediately = true,
      ...containerProps
    } = props;

    const {
      containerRef,
      overflowIndicatorRef,
      visibleCount: finalVisibleCount,
      phase,
      showOverflow,
    } = useOverflowList<HTMLElement, HTMLElement>({
      itemCount: items.length,
      maxRows,
      maxVisibleItems,
      flushImmediately,
    });
    const finalContainerRef = useForkRef(containerRef, forwardedRef);

    const finalRenderOverflow = renderOverflow?.(items.slice(finalVisibleCount) as T[]) ?? (
      <DefaultOverflowElement items={items.slice(finalVisibleCount) as T[]} {...renderOverflowProps} />
    );

    const overflowElement = showOverflow ? finalRenderOverflow : null;

    // @ts-expect-error - ref is not exposed as type in jsx elements but it exists
    const finalOverflowRef = useForkRef(overflowIndicatorRef, overflowElement?.ref);

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

    const finalRenderItemVisibility =
      renderItemVisibility ??
      ((node, meta) => {
        // prefer react 19.2 new Activity component to control visibility without forcing mount/unmount
        // @ts-ignore -- Activity is an experimental React 19.2 API not yet in types
        const Activity = React.Activity;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (Activity) {
          return (
            <Activity key={meta.index} mode={meta.visible ? "visible" : "hidden"}>
              {node}
            </Activity>
          );
        }

        // below react 19.2, simply return null if the item is not visible
        if (!meta.visible) return null;
        return <React.Fragment key={meta.index}>{node}</React.Fragment>;
      });

    return (
      <Component {...containerProps} ref={finalContainerRef} style={containerStyles}>
        {finalItems.map((item, index) => {
          const isVisible =
            phase ===
              // in measuring phase, show all items
              "measuring" ||
            // in 'normal' phase, show only the N items that fit
            index < finalVisibleCount;

          const itemComponent = renderItem(item as T, index);

          return finalRenderItemVisibility(itemComponent, { index, visible: isVisible });
        })}

        {clonedOverflowElement}
      </Component>
    );
  })
);

export const OverflowList: OverflowListComponent = OverflowListComponent as OverflowListComponent;

const DEFAULT_CONTAINER_STYLES: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  contain: "layout style",
  minWidth: 0,
};
