import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export interface ResizeObserverDimensions {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
}

export function useResizeObserver<T extends HTMLElement | null>(
  elementRef: React.RefObject<T>,
  flushImmediately: boolean = false,
): ResizeObserverDimensions | null {
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [dimensions, setDimensions] = useState<ResizeObserverDimensions | null>(null);
  const lastDimensionsRef = useRef<ResizeObserverDimensions | null>(null);

  // Initialize resize observer
  useEffect(() => {
    if (!elementRef.current) return;

    // Create resize observer
    resizeObserverRef.current = new ResizeObserver((entries) => {
      if (entries[0]) {
        const entry = entries[0];
        const updateDimensions = () => {
          const next: ResizeObserverDimensions = {
            width: entry.borderBoxSize[0]?.inlineSize ?? entry.target.clientWidth,
            height: entry.borderBoxSize[0]?.blockSize ?? entry.target.clientHeight,
            contentWidth: entry.contentRect.width,
            contentHeight: entry.contentRect.height,
          };

          // Consumers key off the returned object's identity, so storing a fresh object per notification made
          // every notification look like a change. Notifications reporting the same box do happen: an observer
          // delivers one when it starts observing, and hiding or revealing an element can produce one without
          // its box moving. Each of those cost a full re-measure downstream.
          const last = lastDimensionsRef.current;
          if (
            last &&
            last.width === next.width &&
            last.height === next.height &&
            last.contentWidth === next.contentWidth &&
            last.contentHeight === next.contentHeight
          ) {
            return;
          }

          lastDimensionsRef.current = next;
          setDimensions(next);
        };

        if (flushImmediately) {
          // Update DOM immediately using flushSync
          flushSync(updateDimensions);
        } else {
          // Use requestAnimationFrame to defer this update and avoid forced reflow
          requestAnimationFrame(updateDimensions);
        }
      }
    });

    resizeObserverRef.current.observe(elementRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [elementRef.current, flushImmediately]);

  return dimensions;
}
