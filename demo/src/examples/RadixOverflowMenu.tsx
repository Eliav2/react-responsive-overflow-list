import React from "react";
import { DropdownMenu } from "@radix-ui/themes";

const RadixOverflowMenu = React.forwardRef<HTMLButtonElement, { items: string[] }>(({ items }, ref) => (
  <DropdownMenu.Root modal={false}>
    <DropdownMenu.Trigger>
      <button ref={ref} className="demo-button demo-button--primary">
        +{items.length} more
      </button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      {items.map((item, index) => (
        <DropdownMenu.Item key={index}>#{item}</DropdownMenu.Item>
      ))}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
));

export { RadixOverflowMenu };
