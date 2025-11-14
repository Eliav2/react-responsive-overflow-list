## Issue #4 Hypothesis – `wa-tag` + `OverflowList`

### Observed behaviour

- Replacing regular `<span>` items with Web Awesome’s `<wa-tag>` in `OverflowList` causes the list to flicker between “all items” and “overflowed” states.
- Console logs show `ResizeObserver loop completed with undelivered notifications`.

### Why it happens

1. `OverflowList` measures layout by rendering every item, hiding those past `maxRows`, and rerunning that cycle whenever the container’s `ResizeObserver` fires.
2. The observer uses `flushSync` (`flushImmediately=true` by default), so it mutates React state during the same delivery frame that triggered the notification. That produces the ResizeObserver warning.
3. Each time items are reinserted, `<wa-tag>` runs its custom-element lifecycle: it loads shadow DOM, injects styles, and briefly changes its own border-box size. That tiny size change alters the container’s measured height right after the list finishes measuring, so the ResizeObserver fires again immediately.
4. Steps 1‑3 loop forever: measure → hide overflow → `<wa-tag>` upgrades → container height changes → observer fires → measure again.

### Ways to stabilise

- **Defer observer updates** – pass `flushImmediately={false}` so `useResizeObserver` runs `requestAnimationFrame(update)` instead of `flushSync`. This lets the browser finish delivering the current batch of resize notifications before React mutates the DOM, which eliminates the warning (at the cost of a single-frame flash during measurement).
- **Wait until the custom element is defined** – gate the list render on `customElements.whenDefined('wa-tag')` so the items don’t keep changing size after each reconnect.
- **Wrap the tag in a stable shell** – render `<span class="tag-shell"><wa-tag …/></span>` and size the wrapper (`display:inline-flex; flex:0 0 auto; contain:content;`). The observer tracks the wrapper, whose box no longer changes when `wa-tag` updates, so the measurement settles.

With any of these guardrails, the list only re-measures when the user actually resizes the container, and the warning disappears.
