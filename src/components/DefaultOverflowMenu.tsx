import React, { useState } from "react";
import { OverflowElementProps } from "./OverflowList";

const DEFAULT_OVERFLOW_BUTTON_STYLES: React.CSSProperties = {
  borderRadius: "4px",
  border: "1px solid #ccc",
  padding: "4px 8px",
  fontSize: "12px",
};

/**
 * Simple default overflow menu component that displays hidden items in a basic dropdown
 */

interface DefaultOverflowElementProps<T> extends OverflowElementProps<T> {}

export const DefaultOverflowElement = React.forwardRef(function DefaultOverflowElement<T>(
  props: DefaultOverflowElementProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { items } = props;
  const count = items.length;

  return (
    <div ref={ref} style={DEFAULT_OVERFLOW_BUTTON_STYLES}>
      {`+${count} more`}
    </div>
  );
}) as <T>(props: DefaultOverflowElementProps<T> & { ref?: React.Ref<HTMLDivElement> }) => React.ReactElement;
