# react-responsive-overflow-list

A responsive React component that shows as many items as can fit within constraints, hiding overflow items behind a configurable overflow renderer. Automatically recalculates visible items on resize.

## Features

- ✅ **Responsive**: Automatically adjusts to container size changes
- ✅ **Flexible Rendering**: Support for both items array and children patterns
- ✅ **Customizable Overflow**: Custom overflow renderers and styling
- ✅ **TypeScript**: Full TypeScript support with comprehensive types
- ✅ **Lightweight**: Simple, performant default overflow element without heavy dependencies
- ✅ **Polymorphic**: Use the `as` prop to render as different HTML elements
- ✅ **Performance Control**: Configurable flush behavior for resize updates
- ✅ **Multi-row Support**: Control maximum rows before overflow
- ✅ **Minimal Dependencies**: Only peer dependencies on React and classnames for styling

## Installation

```bash
npm install react-responsive-overflow-list
```

## Quick Start

### Basic Usage with Items Array

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

## Technical Details

### Measurement Strategy

The component uses a three-phase approach:

1. **"measuring"** - Renders all items to calculate positions and determine how many fit
2. **"measuring-overflow-indicator"** - Tests if overflow indicator fits without creating new row
3. **"normal"** - Shows final stable state with proper item count

### Performance

- Uses `ResizeObserver` for efficient resize detection
- Optimized re-renders with `React.memo` and careful state management
- Simple default overflow element for minimal bundle impact
- Configurable flush behavior: `flushImmediately=true` (default) avoids flickering but may impact performance, `flushImmediately=false` improves performance but may cause slight flickering

### Advanced Overflow Elements

The default overflow element is intentionally simple. For more advanced features like dropdowns or complex UI frameworks, you can create custom overflow renderers:

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
- `classnames` (^2.3.2) - For conditional CSS classes

### Optional Dependencies

- `@tanstack/react-virtual` (^3.0.0) - For virtualization support in custom overflow elements

## License

MIT

## Contributing

Issues and pull requests are welcome! Please check our contributing guidelines.
