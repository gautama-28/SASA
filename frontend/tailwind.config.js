// tailwind.config.js
import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
          ubuntu: [
            'Ubuntu',
            'ui-sans-serif',
            'system-ui',
            'sans-serif',
          ],
          lato: [
            'Lato',
            'ui-sans-serif',
            'system-ui',
            'sans-serif',
          ],
      },
    },
  },
  plugins: [],
});
