"use client"

// Demo wrapper with direct imports to shadcn-radix-ui components
// Registry component uses @/components/ui/* which resolves via user's shadcn setup

import * as React from "react"
import {
  OverflowList as OverflowListPrimitive,
  type OverflowListProps as PrimitiveOverflowListProps,
} from "react-responsive-overflow-list"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-radix-ui/dropdown-menu"
import { Button } from "@/components/shadcn-radix-ui/button"
import { cn } from "@/lib/utils"

export const OverflowList = React.forwardRef(
  <T,>(
    {
      items,
      renderItem,
      renderOverflowItem,
      maxRows = 1,
      maxVisibleItems = 100,
      overflowLabel = (count) => `+${count} more`,
      className,
      ...props
    }: OverflowListProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => (
    <OverflowListPrimitive
      ref={ref}
      data-slot="overflow-list"
      items={items}
      renderItem={renderItem}
      maxRows={maxRows}
      maxVisibleItems={maxVisibleItems}
      className={cn("items-center gap-2", className)}
      renderOverflow={(hiddenItems) => (
        <OverflowDropdown
          items={hiddenItems}
          label={overflowLabel(hiddenItems.length)}
          renderItem={renderItem}
          renderOverflowItem={renderOverflowItem}
        />
      )}
      {...props}
    />
  )
) as <T>(props: OverflowListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) => React.ReactElement

type PrimitiveItemsProps<T> = Extract<PrimitiveOverflowListProps<T>, { items: T[] }>

export interface OverflowListProps<T>
  extends Omit<PrimitiveItemsProps<T>, "renderOverflow" | "renderOverflowProps"> {
  overflowLabel?: (count: number) => string
}

interface OverflowDropdownProps<T> {
  items: T[]
  label: string
  renderItem: (item: T, index: number) => React.ReactNode
  renderOverflowItem?: (item: T, index: number) => React.ReactNode
}

const OverflowDropdown = React.forwardRef(
  <T,>(
    { items, label, renderItem, renderOverflowItem }: OverflowDropdownProps<T>,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button ref={ref} variant="outline">{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-75 overflow-y-auto">
        {items.map((item, index) => (
          <DropdownMenuItem key={index}>
            {renderOverflowItem ? renderOverflowItem(item, index) : renderItem(item, index)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
) as <T>(props: OverflowDropdownProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }) => React.ReactElement
