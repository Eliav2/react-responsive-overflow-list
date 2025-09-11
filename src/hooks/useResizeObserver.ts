import { useEffect, useRef, useState } from "react";

export interface ResizeObserverDimensions {
	width: number;
	height: number;
	contentWidth: number;
	contentHeight: number;
}

export function useResizeObserver<T extends HTMLElement>(
	elementRef: React.RefObject<T>,
): ResizeObserverDimensions | null {
	const resizeObserverRef = useRef<ResizeObserver | null>(null);
	const [dimensions, setDimensions] = useState<ResizeObserverDimensions | null>(null);

	// Initialize resize observer
	useEffect(() => {
		if (!elementRef.current) return;

		// Create resize observer
		resizeObserverRef.current = new ResizeObserver((entries) => {
			// Use requestAnimationFrame to ensure DOM updates are complete
			requestAnimationFrame(() => {
				if (entries[0]) {
					const entry = entries[0];
					setDimensions({
						width: entry.borderBoxSize[0]?.inlineSize ?? entry.target.clientWidth,
						height: entry.borderBoxSize[0]?.blockSize ?? entry.target.clientHeight,
						contentWidth: entry.contentRect.width,
						contentHeight: entry.contentRect.height,
					});
				}
			});
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
