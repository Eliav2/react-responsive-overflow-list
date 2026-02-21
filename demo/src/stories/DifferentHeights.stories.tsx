import type { Meta, StoryObj } from "@storybook/react-vite";
import { OverflowList } from "react-responsive-overflow-list";

const items = [
  { label: "Short", height: 30 },
  { label: "Medium", height: 50 },
  { label: "Tall Item", height: 70 },
  { label: "Extra Tall", height: 100 },
  { label: "Small", height: 35 },
  { label: "Large Box", height: 80 },
  { label: "Tiny", height: 25 },
  { label: "Big One", height: 90 },
  { label: "Normal", height: 45 },
  { label: "Giant", height: 110 },
];

const DifferentHeightsExample = () => {
  return (
    <div style={{ width: "100%", maxWidth: 600, border: "1px dashed #ccc", padding: 16, resize: "horizontal", overflow: "auto" }}>
      <OverflowList
        items={items}
        renderItem={(item, index) => (
          <div
            key={index}
            style={{
              height: item.height,
              minWidth: 80,
              padding: "8px 16px",
              background: "#e0e7ff",
              border: "1px solid #818cf8",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            {item.label}
          </div>
        )}
        style={{ gap: 8, alignItems: "center" }}
      />
    </div>
  );
};

const meta = {
  title: "Examples/DifferentHeights",
  component: DifferentHeightsExample,
} satisfies Meta<typeof DifferentHeightsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const MultiRow: Story = {
  render: () => (
    <div style={{ width: "100%", maxWidth: 600, border: "1px dashed #ccc", padding: 16, resize: "horizontal", overflow: "auto" }}>
      <OverflowList
        items={items}
        maxRows={2}
        renderItem={(item, index) => (
          <div
            key={index}
            style={{
              height: item.height,
              minWidth: 80,
              padding: "8px 16px",
              background: "#fef3c7",
              border: "1px solid #f59e0b",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            {item.label}
          </div>
        )}
        style={{ gap: 8, alignItems: "center" }}
      />
    </div>
  ),
};
