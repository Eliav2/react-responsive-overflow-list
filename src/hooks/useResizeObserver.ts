import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export interface ResizeObserverDimensions {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
}

export function useResizeObserver<T extends HTMLElement>(
  elementRef: React.RefObject<T>,
  flushImmediately: boolean = false
): ResizeObserverDimensions | null {
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [dimensions, setDimensions] = useState<ResizeObserverDimensions | null>(null);

  // Initialize resize observer
  useEffect(() => {
    if (!elementRef.current) return;

    // Create resize observer
    resizeObserverRef.current = new ResizeObserver((entries) => {
      if (entries[0]) {
        const entry = entries[0];
        const updateDimensions = () => {
          setDimensions({
            width: entry.borderBoxSize[0]?.inlineSize ?? entry.target.clientWidth,
            height: entry.borderBoxSize[0]?.blockSize ?? entry.target.clientHeight,
            contentWidth: entry.contentRect.width,
            contentHeight: entry.contentRect.height,
          });
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
  }, [elementRef.current]);

  return dimensions;
}
