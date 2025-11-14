# Changelog

# Changelog

## 0.3.0

- Added a new `renderHiddenItem` prop so apps can decide how overflowed children stay mounted (supports React 19
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
