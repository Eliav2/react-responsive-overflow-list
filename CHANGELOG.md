# Changelog

# Changelog

## 0.4.3

- Fixed a stale visible count when items change size on their own (#21). Measurement was only re-triggered by
  `itemCount`/`maxRows` changing or by the container's own ResizeObserver, so items that grow or shrink while the
  container's box stays put — a counter badge going from `9` to `10` in a tab bar — never caused a new pass. Usually the
  resulting wrap makes the container taller and its ResizeObserver rescues it, which is why this looked intermittent and
  browser-specific; when the container has a fixed height nothing re-triggers a pass and the overflow indicator sits on a
  second row indefinitely, violating `maxRows`. The settled content signature is now compared after each commit, so both
  directions are caught: items growing past the row, and items shrinking so more of them would fit again.

## 0.4.2

- Fixed the list collapsing to a bare overflow indicator when the container held children that are not items. Row
  measurement grouped every container child by its `top`, so a child that is not laid out together with the items still
  counted as a row, and since 0.4.1's `itemRowCount > maxRows` check that made the overflow indicator subtract items
  until nothing was left. Two cases hit this: overflowed items kept mounted but hidden (what React 19.2's
  `Activity mode="hidden"` does, and therefore what the default `renderItemVisibility` does), and the `position: fixed`
  focus guards popover libraries render next to an open trigger. Children with no client rects and out-of-flow children
  are now excluded from measurement.
- Fixed named exports failing to type-check under `moduleResolution: "Node16"` / `"NodeNext"` (#19). The published
  declarations were split across barrel files that re-exported without file extensions (`export * from "./components"`),
  which Node16 ESM resolution cannot resolve, so the package appeared to have no exported members. Declarations are now
  emitted as a single bundled `dist/index.d.ts` / `dist/index.d.cts` with no relative imports.
- Fixed the `exports` map handing CommonJS consumers the ESM declaration file. `types` is now nested per condition, so
  `require()` resolves to `dist/index.d.cts`.
- Added `sideEffects: false` for better tree-shaking.
- Build now runs `attw` and `publint` so packaging regressions fail the build.

## 0.3.3

- Fixed flex items inflating the container during measurement phase due to CSS `min-width: auto` default. Added `minWidth: 0` to the default container styles, preventing items from overflowing their row constraints (e.g., tags spreading to multiple rows despite `maxRows={1}`).

## 0.3.2

- Fixed incorrect row grouping when items have different heights (e.g., with `alignItems: "center"`). Items on the same visual row are now correctly detected via vertical overlap instead of exact `top` pixel matching.

## 0.3.1

- Restored the legacy `(item, index)` call signature for `renderItem` so existing code keeps working.
- Exported `RenderItemVisibilityMeta` and updated `renderItemVisibility` to receive that metadata.

## 0.3.0

- Added a new `renderItemVisibility` prop so apps can decide how overflowed children stay mounted (supports React 19
  `Activity` by default and makes it easier to integrate custom skeletons/widgets).
- Default hidden-item handling keeps elements connected via either `Activity` (when available) or if not available, simply return null.
- Demo now includes **DynamicSizeExample**, which simulates children that grow from 20px to 50px after load and
  showcases custom hidden-item wrappers.

## 0.2.1

some polishing, and build changes:

- ship default styles as css-in-js instead of css file (better for shipping)
- package.json is now type:"module".

## 0.2.0

- dropped `minVisibleItems` prop in favor of simplicity (same effect can achieved with reversed flex direction and reversing the items array)
- the component is now ssr-safe(tested adjusted on ssr environment).

## 0.1.0

- Initial release
- Adds a responsive overflow list component that shows as many items as can fit within constraints, hiding overflow items behind a configurable overflow renderer
- Automatically recalculates visible items on resize
- Supports both items array and children pattern
- Customizable overflow renderers
- TypeScript support
- Polymorphic, use the `as` prop to render as different HTML elements
- Performance control, configurable flush behavior for resize updates
- Multi-row support, control maximum rows before overflow
- Minimal dependencies, only peer dependencies on React
