import { createFileRoute } from "@tanstack/react-router";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import { BasicExample } from "../../examples/BasicExample";
import { ChildrenPatternExample } from "../../examples/ChildrenPatternExample";
import { MultiRowExample } from "../../examples/MultiRowExample";
import { CustomOverflowExample } from "../../examples/CustomOverflowExample";
import { CustomHostElementExample } from "../../examples/CustomHostElementExample";
import { RadixVirtualizationExample } from "../../examples/RadixVirtualizationExample";
import { FlushImmediatelyExample } from "../../examples/FlushImmediatelyExample";
import { OneItemWiderExample } from "../../examples/OneItemWiderExample";
import { ReverseOrderExample } from "../../examples/ReverseOrderExample";
import { DynamicSizeExample } from "../../examples/DynamicSizeExample";

export const Route = createFileRoute("/docs/examples")({
  component: ExamplesPage,
});

function ExamplesPage() {
  return (
    <Theme>
      <div className="max-w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Examples</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Explore different usage patterns and features of the OverflowList
          component. Resize the demo containers to see the responsive behavior
          in action.
        </p>

        <div className="flex flex-col gap-6">
          <BasicExample />
          <ChildrenPatternExample />
          <MultiRowExample />
          <CustomOverflowExample />
          <CustomHostElementExample />
          <RadixVirtualizationExample />
          <FlushImmediatelyExample />
          <OneItemWiderExample />
          <ReverseOrderExample />
          <DynamicSizeExample />
        </div>
      </div>
    </Theme>
  );
}
