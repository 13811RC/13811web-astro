// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    markdown: {
        shikiConfig: {
          themes: {
            light: "material-theme-lighter",
            dark: "material-theme"
          }
        },
      },
});
