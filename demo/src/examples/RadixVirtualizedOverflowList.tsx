import React, { useState, useRef } from "react";
import { OverflowList, type OverflowListProps } from "react-responsive-overflow-list";
import { DropdownMenu } from "@radix-ui/themes";
import { useVirtualizer } from "@tanstack/react-virtual";

/**
 * RadixVirtualizedOverflowList - Example wrapper component
 *
 * This is an EXAMPLE implementation showing how to wrap OverflowList with Radix UI
 * dropdown and virtualization support. In real-world applications, it's expected
 * that you'll wrap OverflowList with your own components tailored to your specific
 * needs, design system, and UI framework.
 *
 * This example demonstrates:
 * - Radix UI dropdown with proper accessibility
 * - Virtualization for large item lists (1000+ items)
 * - Automatic virtualization threshold detection
 * - Customizable styling and behavior
 *
 * Source: https://github.com/eliav2/react-responsive-overflow-list/blob/main/demo/src/examples/RadixVirtualizedOverflowList.tsx
 */

interface RadixVirtualizedOverflowListProps<T> extends Omit<OverflowListProps<T>, "renderOverflow"> {
  /** Threshold for enabling virtualization (default: 100) */
  virtualizationThreshold?: number;
  /** Maximum items to render in virtualizer (default: 100) */
  maxVirtualizedItems?: number;
  /** Custom trigger text template (default: "+{count} more") */
  triggerText?: (count: number) => string;
  /** Custom item renderer for dropdown items */
  renderDropdownItem?: (item: T, index: number) => React.ReactNode;
  /** Dropdown content styling */
  dropdownStyle?: React.CSSProperties;
  /** Enable search/filter functionality */
  enableSearch?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
}

/**
 * Creates a range extractor function for TanStack Virtual that limits the number of rendered items
 * while properly handling overscan for smooth scrolling performance
 */
function createLimitedRangeExtractor(maxItems: number) {
  return (range: { startIndex: number; endIndex: number; overscan: number; count: number }) => {
    const startWithOverscan = Math.max(0, range.startIndex - range.overscan);
    const endWithOverscan = Math.min(range.count - 1, range.endIndex + range.overscan);
    const rangeSize = endWithOverscan - startWithOverscan + 1;
    const itemsToRender = Math.min(rangeSize, maxItems);
    return Array.from({ length: itemsToRender }, (_, i) => startWithOverscan + i);
  };
}

/**
 * Virtualized dropdown component for handling large item lists
 */
const VirtualizedDropdown = React.forwardRef<
  HTMLButtonElement,
  {
    items: string[];
    triggerText: (count: number) => string;
    renderDropdownItem?: (item: string, index: number) => React.ReactNode;
    maxVirtualizedItems: number;
    dropdownStyle?: React.CSSProperties;
    enableSearch?: boolean;
    searchPlaceholder?: string;
  }
>(
  (
    {
      items,
      triggerText,
      renderDropdownItem,
      maxVirtualizedItems,
      dropdownStyle,
      enableSearch = false,
      searchPlaceholder = "Search items...",
    },
    ref
  ) => {
    const dropdownContentRef = useRef<HTMLDivElement | null>(null);
    const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter items based on search term
    const filteredItems =
      enableSearch && searchTerm
        ? items.filter((item) => String(item).toLowerCase().includes(searchTerm.toLowerCase()))
        : items;

    const virtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
      count: filteredItems.length,
      getScrollElement: () => scrollElement,
      estimateSize: () => 32, // Estimated item height
      rangeExtractor: createLimitedRangeExtractor(maxVirtualizedItems),
      overscan: 5,
      gap: 0,
      enabled: !!scrollElement && filteredItems.length > 0,
    });

    const virtualItems = virtualizer.getVirtualItems();

    return (
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger>
          <button ref={ref} className="demo-button demo-button--primary">
            {triggerText(items.length)}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          size="1"
          onClick={(e) => e.stopPropagation()}
          ref={(node) => {
            dropdownContentRef.current = node;
            setScrollElement(node?.querySelector(".rt-ScrollAreaViewport") as HTMLDivElement | null);
          }}
          style={{
            minWidth: "200px",
            maxWidth: "400px",
            maxHeight: "300px",
            ...dropdownStyle,
          }}
        >
          <div style={{ padding: "8px" }}>
            {enableSearch && (
              <div style={{ marginBottom: "8px" }}>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
            )}

            {filteredItems.length === 0 ? (
              <div style={{ padding: "8px", color: "#666", fontSize: "14px" }}>No items found</div>
            ) : (
              <div
                style={{
                  position: "relative",
                  height: `${virtualizer.getTotalSize()}px`,
                  width: `${containerWidth}px`,
                }}
              >
                {virtualItems.map((virtualItem) => {
                  const item = filteredItems[virtualItem.index];
                  const originalIndex = items.indexOf(item);

                  return (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transform: `translateY(${virtualItem.start}px)`,
                        width: "100%",
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
                      {renderDropdownItem ? (
                        renderDropdownItem(item, originalIndex)
                      ) : (
                        <DropdownMenu.Item>#{item}</DropdownMenu.Item>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  }
);

/**
 * Simple dropdown component for smaller item lists
 */
const SimpleDropdown = React.forwardRef<
  HTMLButtonElement,
  {
    items: string[];
    triggerText: (count: number) => string;
    renderDropdownItem?: (item: string, index: number) => React.ReactNode;
    dropdownStyle?: React.CSSProperties;
  }
>(({ items, triggerText, renderDropdownItem, dropdownStyle }, ref) => {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <button ref={ref} className="demo-button demo-button--primary">
          {triggerText(items.length)}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        size="1"
        style={{
          minWidth: "200px",
          maxWidth: "400px",
          maxHeight: "300px",
          ...dropdownStyle,
        }}
      >
        {items.map((item, index) => (
          <div key={index}>
            {renderDropdownItem ? renderDropdownItem(item, index) : <DropdownMenu.Item>#{item}</DropdownMenu.Item>}
          </div>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
});

/**
 * RadixVirtualizedOverflowList - Example wrapper component
 *
 * This is an EXAMPLE showing how to wrap OverflowList with Radix UI and virtualization.
 * In real-world applications, it's expected that you'll wrap OverflowList with your own
 * components tailored to your specific needs, design system, and UI framework.
 */
export function RadixVirtualizedOverflowList<T = string>({
  virtualizationThreshold = 100,
  maxVirtualizedItems = 100,
  triggerText = (count) => `+${count} more`,
  renderDropdownItem,
  dropdownStyle,
  enableSearch = false,
  searchPlaceholder = "Search items...",
  ...overflowListProps
}: RadixVirtualizedOverflowListProps<T>) {
  // Determine if we should use virtualization based on item count
  const shouldVirtualize = (overflowListProps.items?.length || 0) > virtualizationThreshold;

  const renderOverflow = (items: T[]) => {
    const stringItems = items.map((item) => String(item));

    if (shouldVirtualize) {
      return (
        <VirtualizedDropdown
          items={stringItems}
          triggerText={triggerText}
          renderDropdownItem={renderDropdownItem ? (_, index) => renderDropdownItem(items[index], index) : undefined}
          maxVirtualizedItems={maxVirtualizedItems}
          dropdownStyle={dropdownStyle}
          enableSearch={enableSearch}
          searchPlaceholder={searchPlaceholder}
        />
      );
    }

    return (
      <SimpleDropdown
        items={stringItems}
        triggerText={triggerText}
        renderDropdownItem={renderDropdownItem ? (_, index) => renderDropdownItem(items[index], index) : undefined}
        dropdownStyle={dropdownStyle}
      />
    );
  };

  return <OverflowList {...(overflowListProps as OverflowListProps<T>)} renderOverflow={renderOverflow} />;
}

export default RadixVirtualizedOverflowList;
