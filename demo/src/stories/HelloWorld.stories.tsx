import type { Meta, StoryObj } from "@storybook/react-vite";

const HelloWorld = () => <div>Hello World</div>;

const meta = {
  title: "Example/HelloWorld",
  component: HelloWorld,
} satisfies Meta<typeof HelloWorld>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
