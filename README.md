# @cortanix/overflow-list

A responsive React component that shows as many items as can fit within constraints, hiding overflow items behind a configurable overflow renderer. Automatically recalculates visible items on resize.

## Features

- ✅ **Responsive**: Automatically adjusts to container size changes
- ✅ **Flexible Rendering**: Support for both items array and children patterns
- ✅ **Customizable Overflow**: Custom overflow renderers and styling
- ✅ **TypeScript**: Full TypeScript support with comprehensive types
- ✅ **Lightweight**: Simple, performant default overflow menu without heavy dependencies
- ✅ **Accessibility**: Built with accessibility in mind
- ✅ **Zero Dependencies**: Only peer dependencies on React and classnames for styling

## Installation

```bash
npm install @cortanix/overflow-list
```

## Quick Start

### Basic Usage with Items Array

```tsx
import { OverflowList } from "@cortanix/overflow-list";

const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

function MyComponent() {
	return (
		<OverflowList
			items={items}
			renderItem={(item, index) => (
				<span key={index} style={{ padding: "4px 8px", background: "#f0f0f0", borderRadius: "4px" }}>
					{item}
				</span>
			)}
			maxRows={1}
			gap="2"
		/>
	);
}
```

### Usage with Children Pattern

```tsx
import { OverflowList } from "@cortanix/overflow-list";

function MyComponent() {
	return (
		<OverflowList maxRows={1} gap="2">
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
import { OverflowList } from "@cortanix/overflow-list";

function MyComponent() {
	return (
		<OverflowList
			items={items}
			renderItem={(item) => <span>{item}</span>}
			renderOverflow={(overflowItems) => <button>{overflowItems.length} more items</button>}
			maxRows={2}
		/>
	);
}
```

## API Reference

### OverflowList Props

#### Core Props

| Prop         | Type                                    | Default | Description                                      |
| ------------ | --------------------------------------- | ------- | ------------------------------------------------ |
| `items`      | `T[]`                                   | -       | Array of items to render (use with `renderItem`) |
| `renderItem` | `(item: T, index: number) => ReactNode` | -       | Function to render each item                     |
| `children`   | `ReactNode`                             | -       | Alternative to items/renderItem pattern          |

#### Layout Props

| Prop              | Type               | Default | Description                                        |
| ----------------- | ------------------ | ------- | -------------------------------------------------- |
| `maxRows`         | `number`           | `1`     | Maximum number of rows before overflow             |
| `maxVisibleItems` | `number`           | `100`   | Maximum number of visible items                    |
| `minVisibleItems` | `number`           | `0`     | Minimum number of items to keep visible            |
| `gap`             | `string \| number` | `"1"`   | Gap between items (supports theme values: "1"-"6") |

#### Overflow Props

| Prop                  | Type                                    | Default               | Description                        |
| --------------------- | --------------------------------------- | --------------------- | ---------------------------------- |
| `renderOverflow`      | `(items: T[]) => ReactNode`             | `DefaultOverflowMenu` | Custom overflow renderer           |
| `renderOverflowItem`  | `(item: T, index: number) => ReactNode` | `renderItem`          | Custom renderer for overflow items |
| `renderOverflowProps` | `Partial<DefaultOverflowMenuProps<T>>`  | -                     | Props for default overflow menu    |

#### Style Props

Inherits all standard div props. The container uses `display: flex` with `flex-wrap: wrap` and `align-items: center` by default. You can override any styles via the `style` prop or `className`.

### DefaultOverflowMenu Props

| Prop           | Type                                            | Default                          | Description                           |
| -------------- | ----------------------------------------------- | -------------------------------- | ------------------------------------- |
| `items`        | `T[]`                                           | -                                | Items to show in overflow menu        |
| `visibleCount` | `number`                                        | -                                | Number of visible items (for context) |
| `renderItem`   | `(item: T, index: number) => ReactNode`         | -                                | How to render each overflow item      |
| `renderText`   | `(count: number) => ReactNode`                  | `(count) => \`+\${count} more\`` | Text for overflow trigger             |
| `triggerProps` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | -                                | Props for overflow trigger button     |

## Advanced Usage

### Custom Overflow Menu

```tsx
import { OverflowList } from "@cortanix/overflow-list";

function CustomOverflowMenu({ items }: { items: string[] }) {
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
			renderOverflow={(items) => <CustomOverflowMenu items={items} />}
		/>
	);
}
```

### Responsive Design

```tsx
import { OverflowList } from "@cortanix/overflow-list";

function ResponsiveToolbar() {
	return (
		<div style={{ width: "100%", resize: "horizontal", overflow: "auto", border: "1px solid #ccc" }}>
			<OverflowList maxRows={1} gap="2" style={{ padding: "8px" }}>
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

1. **"measuring"** - Renders all items to calculate positions
2. **"measuring overflow"** - Tests if overflow indicator fits without creating new row
3. **"normal"** - Shows final stable state with proper item count

### Performance

- Uses `ResizeObserver` for efficient resize detection
- Optimized re-renders with `React.memo` and careful state management
- Simple default overflow menu for minimal bundle impact

### Advanced Overflow Menus

The default overflow menu is intentionally simple. For more advanced features like virtualization or complex UI frameworks, you can create custom overflow renderers:

#### With Radix UI

```tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { OverflowList } from "@cortanix/overflow-list";

function RadixOverflowMenu({ items }: { items: string[] }) {
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
			renderOverflow={(items) => <RadixOverflowMenu items={items} />}
		/>
	);
}
```

#### With Virtualization

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";
import { OverflowList, createLimitedRangeExtractor } from "@cortanix/overflow-list";

function VirtualizedOverflowMenu({ items }: { items: string[] }) {
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
				<div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
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

## License

MIT

## Contributing

Issues and pull requests are welcome! Please check our contributing guidelines.
