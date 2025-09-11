import classNames from "classnames";
import React from "react";
import styles from "./OverflowList.module.css";

/**
 * Simple default overflow menu component that displays hidden items in a basic dropdown
 */
export interface DefaultOverflowMenuProps<T> {
  items: T[];
  visibleCount: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderText?: (count: number) => React.ReactNode;
  triggerProps?: React.ButtonHTMLAttributes<HTMLDivElement>;
}

export const DefaultOverflowMenu = React.forwardRef(function DefaultOverflowMenu<T>(
  props: DefaultOverflowMenuProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { items, renderText = (count) => `+${count} more`, triggerProps } = props;

  return (
    <div ref={ref} {...triggerProps} className={classNames(styles.defaultOverflowButton, triggerProps?.className)}>
      {renderText(items.length)}
    </div>
  );
}) as <T>(props: DefaultOverflowMenuProps<T> & { ref?: React.Ref<HTMLButtonElement> }) => React.ReactElement;
