import type { Preview } from '@storybook/react-vite'

// The Storybook vite config runs the tailwind plugin, but nothing imported the stylesheet, so every Tailwind
// class in every story was inert. The demo app pulls these in from its root route.
import '../src/index.css'
import '../src/shadcn.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;