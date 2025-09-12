import React, { useState } from "react";
import { DropdownMenu } from "@radix-ui/themes";
import { useVirtualizer } from "@tanstack/react-virtual";

const maxItemsInVirtualizer = 100;

// Advanced virtualized dropdown for handling thousands of items
const VirtualizedRadixOverflowMenu = React.forwardRef<HTMLButtonElement, { items: string[] }>(({ items }, ref) => {
  const dropdownContentRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const virtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: items.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 20,
    rangeExtractor: createLimitedRangeExtractor(maxItemsInVirtualizer),
    overscan: 10,
    gap: 8,
    enabled: !!scrollElement,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <button ref={ref} className="demo-button demo-button--primary">
          +{items.length} more
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        size="1"
        onClick={(e) => e.stopPropagation()}
        ref={(node) => {
          dropdownContentRef.current = node;
          setScrollElement(node?.querySelector(".rt-ScrollAreaViewport") as HTMLDivElement | null);
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "flex-start",
              position: "relative",
              height: `${virtualizer.getTotalSize()}px`,
              width: `${containerWidth}px`,
            }}
          >
            {virtualItems.map((virtualItem) => {
              const item = items[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  data-index={virtualItem.index}
                  ref={(node) => {
                    virtualizer.measureElement(node);
                    const width = node?.getBoundingClientRect().width;
                    if (width && width > containerWidth) {
                      setContainerWidth(width);
                    }
                  }}
                >
                  <DropdownMenu.Item>#{item}</DropdownMenu.Item>
                </div>
              );
            })}
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
});

/**
 * Creates a range extractor function for TanStack Virtual that limits the number of rendered items
 * while properly handling overscan for smooth scrolling performance
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

export { VirtualizedRadixOverflowMenu };
