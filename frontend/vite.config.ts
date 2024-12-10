import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: ['.'],
    },
  },
  define: {
    'process.env.SVELTEKIT_DISABLE_FETCH_WARNINGS': '"true"'
  }
});