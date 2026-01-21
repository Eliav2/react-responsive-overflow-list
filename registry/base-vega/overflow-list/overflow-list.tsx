"use client"

import * as React from "react"
import { Menu } from "@base-ui/react/menu"
import { OverflowList as OverflowListPrimitive } from "react-responsive-overflow-list"

import { cn } from "@/lib/utils"

/* -----------------------------------------------------------------------------
 * OverflowList
 * A responsive list that shows as many items as fit, with overflow in a dropdown
 * -------------------------------------------------------------------------- */

export interface OverflowListProps<T>
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** Array of items to render */
  items: T[]
  /** Render function for visible items */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Optional render function for items in the overflow dropdown */
  renderOverflowItem?: (item: T, index: number) => React.ReactNode
  /** Maximum number of rows before overflow (default: 1) */
  maxRows?: number
  /** Maximum visible items regardless of space (default: 100) */
  maxVisibleItems?: number
  /** Text for overflow trigger button */
  overflowLabel?: (count: number) => string
  /** Gap between items: "sm" | "md" | "lg" */
  gap?: "sm" | "md" | "lg"
}

const gapClasses = {
  sm: "gap-1",
  md: "gap-2",
  lg: "gap-3",
}

function OverflowListInner<T>(
  {
    items,
    renderItem,
    renderOverflowItem,
    maxRows = 1,
    maxVisibleItems = 100,
    overflowLabel = (count) => `+${count} more`,
    gap = "md",
    className,
    ...props
  }: OverflowListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <OverflowListPrimitive
      ref={ref}
      items={items}
      renderItem={renderItem}
      maxRows={maxRows}
      maxVisibleItems={maxVisibleItems}
      className={cn("flex flex-wrap items-center", gapClasses[gap], className)}
      renderOverflow={(hiddenItems) => (
        <Menu.Root>
          <Menu.Trigger
            className={cn(
              "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md",
              "bg-primary text-primary-foreground shadow-xs",
              "px-4 py-2 text-sm font-medium",
              "hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:pointer-events-none disabled:opacity-50",
              "transition-colors"
            )}
          >
            {overflowLabel(hiddenItems.length)}
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end" sideOffset={4}>
              <Menu.Popup
                className={cn(
                  "z-50 max-h-[300px] min-w-[8rem] overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                  "origin-[var(--transform-origin)]",
                  "data-[open]:animate-in data-[closed]:animate-out",
                  "data-[closed]:fade-out-0 data-[open]:fade-in-0",
                  "data-[closed]:zoom-out-95 data-[open]:zoom-in-95"
                )}
              >
                {hiddenItems.map((item, index) => (
                  <Menu.Item
                    key={index}
                    className={cn(
                      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
                      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
                      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    )}
                  >
                    {renderOverflowItem
                      ? renderOverflowItem(item, index)
                      : renderItem(item, index)}
                  </Menu.Item>
                ))}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      )}
      {...props}
    />
  )
}

// Use type assertion to preserve generic while using forwardRef
export const OverflowList = React.forwardRef(OverflowListInner) as <T>(
  props: OverflowListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement

export default OverflowList
