export interface NavItem {
  title: string;
  href: string;
  isAnchor?: boolean;
  badge?: string;
  disabled?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [{ title: "Introduction", href: "/docs/getting-started" }],
  },
  {
    title: "Examples",
    items: [
      { title: "Basic", href: "/docs/examples#basic-example", isAnchor: true },
      {
        title: "Children Pattern",
        href: "/docs/examples#children-pattern",
        isAnchor: true,
      },
      {
        title: "Multi Row",
        href: "/docs/examples#multi-row-example",
        isAnchor: true,
      },
      {
        title: "Custom Overflow",
        href: "/docs/examples#custom-overflow-example",
        isAnchor: true,
      },
      {
        title: "Custom Host Element",
        href: "/docs/examples#custom-host-element",
        isAnchor: true,
      },
      {
        title: "Radix + Virtualization",
        href: "/docs/examples#radix-ui-virtualization-example",
        isAnchor: true,
      },
      {
        title: "Flush Immediately",
        href: "/docs/examples#flush-immediately-example",
        isAnchor: true,
      },
      {
        title: "One Item Wider",
        href: "/docs/examples#one-item-wider-than-container",
        isAnchor: true,
      },
      {
        title: "Reverse Order",
        href: "/docs/examples#reverse-order-example",
        isAnchor: true,
      },
      {
        title: "Dynamic Size",
        href: "/docs/examples#dynamic-size-example",
        isAnchor: true,
      },
    ],
  },
  {
    title: "API Reference",
    items: [{ title: "Props & Types", href: "/docs/api" }],
  },
  {
    title: "Integrations",
    items: [
      {
        title: "shadcn/ui",
        href: "/docs/shadcn",
        badge: "Coming Soon",
        disabled: true,
      },
    ],
  },
];
