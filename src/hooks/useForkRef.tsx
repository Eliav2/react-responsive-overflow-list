// Utility to combine refs (similar to MUI's useForkRef but simpler)
import React from "react";

export const useForkRef = <T,>(...refs: (React.Ref<T> | null)[]): React.RefCallback<T> | null => {
	return React.useMemo(() => {
		if (refs.every((ref) => ref == null)) {
			return null;
		}
		return (refValue: T) => {
			refs.forEach((ref) => {
				if (typeof ref === "function") {
					ref(refValue);
				} else if (ref) {
					(ref as React.MutableRefObject<T>).current = refValue;
				}
			});
		};
	}, refs);
};
