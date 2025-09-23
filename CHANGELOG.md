# Changelog

## 0.2.1

ship default styles as css-in-js instead of css file (better for shipping)

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
