# react-responsive-overflow-list

Responsive list for React that shows only items that fit and groups the rest into a customizable overflow element. Recalculates on resize.

[![npm](https://img.shields.io/npm/v/react-responsive-overflow-list.svg)](https://www.npmjs.com/package/react-responsive-overflow-list)
[![downloads](https://img.shields.io/npm/dm/react-responsive-overflow-list.svg)](https://www.npmjs.com/package/react-responsive-overflow-list)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-responsive-overflow-list)](https://bundlephobia.com/package/react-responsive-overflow-list)
[![license](https://img.shields.io/npm/l/react-responsive-overflow-list.svg)](./LICENSE)

**🔗 Live demo:** https://eliav2.github.io/react-responsive-overflow-list/

---

## Features

- **Responsive** (ResizeObserver-based)
- **Two render modes**: items + `renderItem` **or** `children`
- **Custom overflow** element (button/menu/details/etc.)
- **TypeScript + generics**, comprehensive types
- **Polymorphic** root via `as`
- **Multi-row** via `maxRows`
- **Performance toggle**: `flushImmediately`
- **Lightweight**, simple default overflow element
- **Minimal deps**: React peer deps only

## Install

```bash
npm i react-responsive-overflow-list
```

## Usage

> In real apps you’ll usually **wrap `OverflowList`** with your own component (design tokens, a11y menus, virtualization, search). See **Recipes** below and the demo for a full wrapper.

### Items + `renderItem` (most common)

Minimal usage with an items array and render function.

```tsx
import { OverflowList } from "react-responsive-overflow-list";

const items = ["One", "Two", "Three", "Four", "Five"];

export default function Example() {
  return (
    <OverflowList
      items={items}
      renderItem={(item) => <span style={{ padding: 4 }}>{item}</span>}
      style={{ gap: 8 }} // root is display:flex; flex-wrap:wrap
      maxRows={1}
    />
  );
}
```

### Children pattern

Use children instead of `items + renderItem`.

```tsx
<OverflowList style={{ gap: 8 }}>
  <button>A</button>
  <button>B</button>
  <button>C</button>
  <button>D</button>
</OverflowList>
```

### Custom overflow element

Provide your own overflow UI (button, menu, details/summary, etc.).

```tsx
<OverflowList
  items={items}
  renderItem={(item) => <span>{item}</span>}
  renderOverflow={(hidden) => <button>+{hidden.length} more</button>}
/>
```

### Polymorphic root

Render using a different HTML element via `as`.

```tsx
<OverflowList as="nav">
  <a href="#home">Home</a>
  <a href="#about">About</a>
  <a href="#contact">Contact</a>
</OverflowList>
```

### Performance control

Trade visual smoothness vs peak performance during rapid resize.

```tsx
<OverflowList
  items={items}
  renderItem={(item) => <span>{item}</span>}
  flushImmediately={false} // uses rAF; faster under rapid resize, may flicker briefly
/>
```

See the **Flush Immediately** example in the live demo.

---

## API (most used)

| Prop                  | Type                                    | Default      | Notes                                                                 |
| --------------------- | --------------------------------------- | ------------ | --------------------------------------------------------------------- |
| `items`               | `T[]`                                   | —            | Use with `renderItem`. Omit when using children.                      |
| `renderItem`          | `(item: T, index: number) => ReactNode` | —            | How to render each item.                                              |
| `children`            | `ReactNode`                             | —            | Alternative to `items + renderItem`.                                  |
| `as`                  | `React.ElementType`                     | `"div"`      | Polymorphic root element.                                             |
| `maxRows`             | `number`                                | `1`          | Visible rows before overflow.                                         |
| `maxVisibleItems`     | `number`                                | `100`        | Hard cap on visible items.                                            |
| `minVisibleItems`     | `number`                                | `0`          | Keep at least N visible.                                              |
| `renderOverflow`      | `(hidden: T[]) => ReactNode`            | default chip | Custom overflow UI.                                                   |
| `renderOverflowItem`  | `(item: T, i: number) => ReactNode`     | `renderItem` | For expanded lists/menus.                                             |
| `renderOverflowProps` | `Partial<OverflowElementProps<T>>`      | —            | Props for default overflow.                                           |
| `flushImmediately`    | `boolean`                               | `true`       | `true` (flushSync, no flicker) vs `false` (rAF, faster under resize). |

**Styles:** Root uses `display:flex; flex-wrap:wrap; align-items:center;`. Override via `style`/`className`.

**Default overflow element:** A tiny chip that renders `+{count} more`. Replace via `renderOverflow`.

---

## Wrap & extend

It’s **expected** you’ll wrap `OverflowList` for product needs (design system styling, a11y menus, virtualization, search). for example:

- **Radix UI + Virtualization wrapper** (search, large datasets, a11y, perf):

  - **Demo:** see [Radix UI + Virtualization](https://eliav2.github.io/react-responsive-overflow-list/#radix-ui-virtualization-example) in the live site
  - [**Source**](demo/src/examples/RadixVirtualizedOverflowList.tsx)
  - Uses `@tanstack/react-virtual` and the helper `createLimitedRangeExtractor(...)`.

---

## How it works

1. Measure all items and compute how many fit within `maxRows`.
2. Re-test with the overflow indicator; if it would create a new row, hide one more item.
3. Render the stable “normal” state until container size changes.

`flushImmediately=true` → immediate, flicker-free (uses `flushSync`).
`flushImmediately=false` → defer with rAF; smoother under rapid resize, may flicker.

### Edge cases handled

- Single wide item exceeding container width
- `minVisibleItems` / `maxVisibleItems` respected
- Varying item widths, responsive content
- Multi-row overflow detection

---

## Requirements

- React ≥ 16.8 (hooks)
- Modern browsers with `ResizeObserver`

## License

MIT

## Contributing

Issues and PRs welcome. See the repo for examples and dev setup.

```
::contentReference[oaicite:0]{index=0}
```
