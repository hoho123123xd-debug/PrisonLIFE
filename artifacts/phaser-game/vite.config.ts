import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4174,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port: 4174,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
