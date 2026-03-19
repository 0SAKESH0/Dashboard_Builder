// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
// ... existing server config
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    coverage: {
      provider: 'v8'
    },
  },
});
