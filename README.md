# react-responsive-overflow-list

A responsive React component that shows as many items as can fit within constraints, hiding overflow items behind a configurable overflow renderer. Automatically recalculates visible items on resize.

**📖 [Live Demo](https://eliav2.github.io/react-responsive-overflow-list/)**

## Features

- ✅ **Responsive**: Automatically adjusts to container size changes
- ✅ **Flexible Rendering**: Support for both items array and children patterns
- ✅ **Customizable Overflow**: Custom overflow renderers and styling
- ✅ **TypeScript**: Full TypeScript support with comprehensive types
- ✅ **Lightweight**: Simple, performant default overflow element without heavy dependencies
- ✅ **Polymorphic**: Use the `as` prop to render as different HTML elements
- ✅ **Performance Control**: Configurable flush behavior for resize updates
- ✅ **Multi-row Support**: Control maximum rows before overflow
- ✅ **Minimal Dependencies**: Only peer dependencies on React

## Installation

```bash
npm install react-responsive-overflow-list
```

## Quick Start

> 💡 **See it in action**: Check out the [live demo](https://eliav2.github.io/react-responsive-overflow-list/) to see all examples and features in action!

### Basic Usage with Items Array

The most common pattern using an array of items with a custom render function.

```tsx
import { OverflowList } from "react-responsive-overflow-list";

const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

function MyComponent() {
  return (
    <OverflowList
      items={items}
      renderItem={(item, index) => (
        <span
          key={index}
          style={{
            padding: "4px 8px",
            background: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          {item}
        </span>
      )}
      maxRows={1}
      style={{ gap: "8px" }}
    />
  );
}
```

### Usage with Children Pattern

Alternative pattern using React children instead of an items array.

```tsx
import { OverflowList } from "react-responsive-overflow-list";

function MyComponent() {
  return (
    <OverflowList maxRows={1} style={{ gap: "8px" }}>
      <button>Action 1</button>
      <button>Action 2</button>
      <button>Action 3</button>
      <button>Action 4</button>
      <button>Action 5</button>
    </OverflowList>
  );
}
```

### Custom Overflow Renderer

Customize the overflow indicator with your own component or styling.

```tsx
import { OverflowList } from "react-responsive-overflow-list";

function MyComponent() {
  return (
    <OverflowList
      items={items}
      renderItem={(item) => <span>{item}</span>}
      renderOverflow={(overflowItems) => <button>{overflowItems.length} more items</button>}
      maxRows={2}
      style={{ gap: "8px" }}
    />
  );
}
```

### Polymorphic Component

Use the `as` prop to render as different HTML elements (div, nav, section, etc.).

```tsx
import { OverflowList } from "react-responsive-overflow-list";

function MyComponent() {
  return (
    <OverflowList as="nav" style={{ gap: "8px" }}>
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </OverflowList>
  );
}
```

### Performance Control

Control how updates are applied during resize with the `flushImmediately` prop.

```tsx
import { OverflowList } from "react-responsive-overflow-list";

function MyComponent() {
  return (
    <OverflowList
      items={items}
      renderItem={(item) => <span>{item}</span>}
      flushImmediately={false} // Better performance, may cause slight flickering
      style={{ gap: "8px" }}
    />
  );
}
```

> 🔧 **Performance tuning**: See the [flushImmediately demo](https://eliav2.github.io/react-responsive-overflow-list/#flush-immediately-example) to understand the trade-offs between performance and visual smoothness.

## API Reference

### OverflowList Props

#### Core Props

| Prop         | Type                                    | Default | Description                                              |
| ------------ | --------------------------------------- | ------- | -------------------------------------------------------- |
| `items`      | `T[]`                                   | -       | Array of items to render (use with `renderItem`)         |
| `renderItem` | `(item: T, index: number) => ReactNode` | -       | Function to render each item                             |
| `children`   | `ReactNode`                             | -       | Alternative to items/renderItem pattern                  |
| `as`         | `React.ElementType`                     | `"div"` | Polymorphic component - render as different HTML element |

#### Layout Props

| Prop              | Type     | Default | Description                             |
| ----------------- | -------- | ------- | --------------------------------------- |
| `maxRows`         | `number` | `1`     | Maximum number of rows before overflow  |
| `maxVisibleItems` | `number` | `100`   | Maximum number of visible items         |
| `minVisibleItems` | `number` | `0`     | Minimum number of items to keep visible |

#### Overflow Props

| Prop                  | Type                                    | Default                  | Description                        |
| --------------------- | --------------------------------------- | ------------------------ | ---------------------------------- |
| `renderOverflow`      | `(items: T[]) => ReactNode`             | `DefaultOverflowElement` | Custom overflow renderer           |
| `renderOverflowItem`  | `(item: T, index: number) => ReactNode` | `renderItem`             | Custom renderer for overflow items |
| `renderOverflowProps` | `Partial<OverflowElementProps<T>>`      | -                        | Props for default overflow element |

#### Performance Props

| Prop               | Type      | Default | Description                                                                                       |
| ------------------ | --------- | ------- | ------------------------------------------------------------------------------------------------- |
| `flushImmediately` | `boolean` | `true`  | Whether to flush updates immediately on resize (true = no flickering, false = better performance) |

#### Style Props

Inherits all standard HTML div props (or the element specified by `as`). The container uses `display: flex` with `flex-wrap: wrap` and `align-items: center` by default. You can override any styles via the `style` prop or `className`.

### DefaultOverflowElement Props

| Prop    | Type  | Default | Description                       |
| ------- | ----- | ------- | --------------------------------- |
| `items` | `T[]` | -       | Items to show in overflow element |

The `DefaultOverflowElement` is a simple component that displays `+{count} more` text. For more advanced overflow menus, use a custom `renderOverflow` function.

## Advanced Usage

### Custom Overflow Element

Create a custom overflow component using HTML details/summary for collapsible menus.

```tsx
import { OverflowList } from "react-responsive-overflow-list";

function CustomOverflowElement({ items }: { items: string[] }) {
  return (
    <details>
      <summary>{items.length} more</summary>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </details>
  );
}

function MyComponent() {
  return (
    <OverflowList
      items={items}
      renderItem={(item) => <span>{item}</span>}
      renderOverflow={(items) => <CustomOverflowElement items={items} />}
      style={{ gap: "8px" }}
    />
  );
}
```

### Responsive Design

Create responsive toolbars and interfaces that adapt to container size changes.

```tsx
import { OverflowList } from "react-responsive-overflow-list";

function ResponsiveToolbar() {
  return (
    <div
      style={{
        width: "100%",
        resize: "horizontal",
        overflow: "auto",
        border: "1px solid #ccc",
      }}
    >
      <OverflowList maxRows={1} style={{ padding: "8px", gap: "8px" }}>
        <button>New</button>
        <button>Open</button>
        <button>Save</button>
        <button>Print</button>
        <button>Export</button>
        <button>Settings</button>
      </OverflowList>
    </div>
  );
}
```

> 🎯 **Try it yourself**: The [live demo](https://eliav2.github.io/react-responsive-overflow-list/) includes interactive examples where you can resize containers to see the responsive behavior in real-time.

## Technical Details

### How It Works

The `OverflowList` component uses a sophisticated three-phase measurement strategy to determine exactly how many items can fit within the container constraints. This approach ensures accurate overflow detection while maintaining optimal performance.

#### Three-Phase Measurement Strategy

The component operates in three distinct phases, each serving a specific purpose:

1. **"measuring" Phase**

   - Renders all items to calculate their positions and dimensions
   - Uses `getBoundingClientRect()` to measure actual rendered sizes
   - Determines how many items fit within the specified `maxRows` constraint
   - This phase is invisible to users but essential for accurate calculations

2. **"measuring-overflow-indicator" Phase**

   - Tests whether the overflow indicator (e.g., "+3 more" button) fits without creating a new row
   - If the overflow indicator would cause a new row to appear, removes the last visible item
   - This ensures the overflow indicator doesn't inadvertently increase the row count
   - Uses geometric calculations to determine if the overflow element's middle point exceeds the last row's bottom boundary

3. **"normal" Phase**
   - Shows the final stable state with the correct number of visible items
   - This is the only phase visible to users
   - Maintains this state until container dimensions change

#### Browser Painting Synchronization

The component leverages React's rendering cycle and browser painting mechanisms for optimal performance:

- **When `flushImmediately=true` (default)**: Uses `flushSync()` to synchronously update the DOM and immediately measure dimensions. This prevents flickering but may impact performance during rapid resize events.

- **When `flushImmediately=false`**: Uses `requestAnimationFrame()` to defer updates until the next paint cycle. This avoids forced reflows and improves performance but may cause slight visual flickering during resize.

The measurement process works by:

1. Letting the browser paint the current state
2. Synchronously measuring element positions and dimensions
3. Calculating the optimal number of visible items
4. Updating the DOM with the new state

#### Performance Optimizations

- **ResizeObserver Integration**: Uses `ResizeObserver` for efficient resize detection without polling
- **React.memo**: Optimized re-renders with careful state management
- **Minimal Re-renders**: Only updates when the number of visible items actually changes
- **Efficient DOM Queries**: Batches DOM measurements to minimize layout thrashing

#### Edge Cases Handled

- **Single Item Overflow**: When only one item is provided and it's wider than the container
- **Minimum Items**: Respects `minVisibleItems` to ensure critical items remain visible
- **Maximum Items**: Honors `maxVisibleItems` to prevent excessive rendering
- **Dynamic Content**: Handles items with varying sizes and responsive content

### Advanced Overflow Elements

The default overflow element is intentionally simple. For more advanced features like dropdowns or complex UI frameworks, you can create custom overflow renderers. The examples below show different approaches you can take:

> 💡 **Creating Your Own Wrappers**: In real-world applications, it's expected that you'll wrap OverflowList with your own components tailored to your specific needs, design system, and UI framework. The examples below are demonstrations of what's possible.

#### With Radix UI

```tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { OverflowList } from "react-responsive-overflow-list";

function RadixOverflowElement({ items }: { items: string[] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>+{items.length} more</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item, index) => (
          <DropdownMenu.Item key={index}>{item}</DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function MyComponent() {
  return (
    <OverflowList
      items={items}
      renderItem={(item) => <span>{item}</span>}
      renderOverflow={(items) => <RadixOverflowElement items={items} />}
      style={{ gap: "8px" }}
    />
  );
}
```

#### Radix UI + Virtualization Example

This is an **EXAMPLE** implementation showing how to wrap OverflowList with Radix UI dropdown and virtualization support. In real-world applications, it's expected that you'll wrap OverflowList with your own components tailored to your specific needs and design system.

The example demonstrates:

- **Automatic virtualization** for large datasets (1000+ items)
- **Built-in search functionality** for filtering items
- **Radix UI integration** with full accessibility support
- **Performance optimizations** and customizable thresholds

```tsx
import { RadixVirtualizedOverflowList } from "./examples/RadixVirtualizedOverflowList";

function MyComponent() {
  return (
    <RadixVirtualizedOverflowList
      items={largeDataset}
      renderItem={(item) => <span>{item}</span>}
      virtualizationThreshold={100} // Enable virtualization for 100+ items
      enableSearch={true} // Add search functionality
      searchPlaceholder="Search items..."
      style={{ gap: "8px" }}
    />
  );
}
```

> 🚀 **Example Implementation**: See the [Radix UI + Virtualization demo](https://eliav2.github.io/react-responsive-overflow-list/#radix-ui-virtualization-example) for a complete example with both small and large datasets.
>
> ⚠️ **Important**: This is just an example showing how to wrap OverflowList. In real-world applications, it's expected that you'll wrap OverflowList with your own components tailored to your specific needs and design system.
>
> 📁 **Source Code**: [View implementation on GitHub](https://github.com/eliav2/react-responsive-overflow-list/blob/main/demo/src/examples/RadixVirtualizedOverflowList.tsx)

#### With Virtualization

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";
import { OverflowList, createLimitedRangeExtractor } from "react-responsive-overflow-list";

function VirtualizedOverflowElement({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    rangeExtractor: createLimitedRangeExtractor(100),
  });

  return (
    <details>
      <summary>+{items.length} more</summary>
      <div ref={parentRef} style={{ height: "200px", overflow: "auto" }}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {items[virtualItem.index]}
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
```

## Browser Support

- All modern browsers that support `ResizeObserver`
- React 16.8+ (hooks support required)

## Dependencies

### Required Dependencies

- `react` (>=16.8.0) - Peer dependency
- `react-dom` (>=16.8.0) - Peer dependency

## License

MIT

## Contributing

Issues and pull requests are welcome! Please check our contributing guidelines.
