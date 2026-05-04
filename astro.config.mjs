import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Production URL — used for sitemap, canonical URLs, and OG images.
  // Update to your real domain once you point one to GitHub Pages.
  site: 'https://7vred7.github.io',
  base: '/iris-web.studio',

  integrations: [
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],

  // Keep CSS in separate .css files (don't inline into HTML).
  build: {
    inlineStylesheets: 'never',
    assets: 'assets',
  },

  vite: {
    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/js/[name].[hash].js',
          chunkFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name ?? '';
            if (name.endsWith('.css')) return 'assets/css/[name].[hash][extname]';
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
              return 'assets/img/[name].[hash][extname]';
            }
            return 'assets/[name].[hash][extname]';
          },
        },
      },
    },
  },
});
