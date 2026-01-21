"use client"

import * as React from "react"
import { OverflowList as OverflowListPrimitive } from "react-responsive-overflow-list"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>{overflowLabel(hiddenItems.length)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
            {hiddenItems.map((item, index) => (
              <DropdownMenuItem key={index}>
                {renderOverflowItem
                  ? renderOverflowItem(item, index)
                  : renderItem(item, index)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
