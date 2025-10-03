import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // output: 'hybrid'
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Fredoka",
        cssVariable: "--font-fredoka",
        weights: [300, 400, 500, 600, 700],
      },
    ],
  },
});
