"use client"

import * as React from "react"
import {
  OverflowList as OverflowListPrimitive,
  type OverflowListProps as PrimitiveOverflowListProps,
} from "react-responsive-overflow-list"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type PrimitiveItemsProps<T> = Extract<PrimitiveOverflowListProps<T>, { items: T[] }>
type PrimitiveChildrenProps = Extract<PrimitiveOverflowListProps<unknown>, { children: React.ReactNode }>

interface OverflowListItemsProps<T>
  extends Omit<PrimitiveItemsProps<T>, "renderOverflow" | "renderOverflowProps"> {
  /** Trigger label for the overflow popover. */
  overflowLabel?: (count: number) => string
  /** Optional renderer for items inside the overflow popover. Falls back to `renderItem`. */
  renderOverflowItem?: (item: T, index: number) => React.ReactNode
  /** Replace the entire popover body. Bypasses the per-item wrapper. */
  renderOverflowContent?: (hiddenItems: T[]) => React.ReactNode
  /** Tailwind classes merged onto `PopoverContent` — override max-height/scroll/width per instance. */
  popoverContentClassName?: string
  children?: never
}

interface OverflowListChildrenProps
  extends Omit<PrimitiveChildrenProps, "renderOverflow" | "renderOverflowProps"> {
  overflowLabel?: (count: number) => string
  popoverContentClassName?: string
  items?: never
  renderItem?: never
  renderOverflowItem?: never
  renderOverflowContent?: never
}

export type OverflowListProps<T = unknown> = OverflowListItemsProps<T> | OverflowListChildrenProps

export const OverflowList = React.forwardRef(
  function OverflowList<T>(
    {
      overflowLabel = (count) => `+${count}`,
      popoverContentClassName,
      className,
      ...props
    }: OverflowListProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    const renderItem = "renderItem" in props ? props.renderItem : undefined
    const renderOverflowItem = "renderOverflowItem" in props ? props.renderOverflowItem : undefined
    const renderOverflowContent = "renderOverflowContent" in props ? props.renderOverflowContent : undefined

    return (
      <OverflowListPrimitive
        ref={ref}
        data-slot="overflow-list"
        className={cn("items-center gap-2", className)}
        renderOverflow={(hiddenItems) => (
          <OverflowPopover
            items={hiddenItems}
            label={overflowLabel(hiddenItems.length)}
            renderItem={renderItem}
            renderOverflowItem={renderOverflowItem}
            renderOverflowContent={renderOverflowContent}
            popoverContentClassName={popoverContentClassName}
          />
        )}
        {...props}
      />
    )
  }
) as <T>(props: OverflowListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) => React.ReactElement

interface OverflowPopoverProps<T> {
  items: T[]
  label: string
  renderItem?: (item: T, index: number) => React.ReactNode
  renderOverflowItem?: (item: T, index: number) => React.ReactNode
  renderOverflowContent?: (items: T[]) => React.ReactNode
  popoverContentClassName?: string
}

const OverflowPopover = React.forwardRef(
  function OverflowPopover<T>(
    {
      items,
      label,
      renderItem,
      renderOverflowItem,
      renderOverflowContent,
      popoverContentClassName,
    }: OverflowPopoverProps<T>,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) {
    const render = renderOverflowItem ?? renderItem ?? ((item) => item as React.ReactNode)

    return (
      <Popover>
        <PopoverTrigger
          ref={ref}
          className="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer outline-none"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {label}
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={4}
          positionerClassName="z-50"
          className={cn("w-max max-h-75 overflow-y-auto p-2", popoverContentClassName)}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {renderOverflowContent
            ? renderOverflowContent(items)
            : items.map((item, index) => (
                <div key={index} className="p-1 text-sm">
                  {render(item, index)}
                </div>
              ))}
        </PopoverContent>
      </Popover>
    )
  }
) as <T>(props: OverflowPopoverProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }) => React.ReactElement
