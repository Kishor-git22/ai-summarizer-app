/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,           // let you use describe/test/expect globally
    environment: 'jsdom',    // ✅ run in browser-like DOM
    // setupFiles: './src/setupTests.js',
  },
});
