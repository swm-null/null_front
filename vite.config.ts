import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    proxy: {
      '/audio': {
        target: 'https://static-stage.oatnote.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/audio/, ''),
      },
    },
  },
  plugins: [react(), svgr(), tsconfigPaths()],
});
