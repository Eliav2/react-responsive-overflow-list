import classNames from "classnames";
import React from "react";
import styles from "./OverflowList.module.css";
import { OverflowElementProps } from "./OverflowList";

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
    <div ref={ref} className={classNames(styles.defaultOverflowButton)}>
      {`+${count} more`}
    </div>
  );
}) as <T>(props: DefaultOverflowElementProps<T> & { ref?: React.Ref<HTMLDivElement> }) => React.ReactElement;
