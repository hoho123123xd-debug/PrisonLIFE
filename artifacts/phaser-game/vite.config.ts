import { defineConfig } from 'vite';

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const rawBasePath = process.env.BASE_PATH;

if (!rawBasePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

// Vite's `base` is used as a literal prefix for asset URLs (base + 'images/x.png'),
// so a missing trailing slash silently glues the two together into a wrong
// path. Vite's own dev server doesn't 404 on that - it falls through to the
// SPA index.html fallback with a 200, which then fails to parse as whatever
// asset type was actually requested. Normalize once here instead of relying
// on every caller to pass a correctly-slashed value.
const basePath = rawBasePath.endsWith('/') ? rawBasePath : `${rawBasePath}/`;

export default defineConfig({
  base: basePath,
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
