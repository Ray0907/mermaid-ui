import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Prevent process.exit from terminating the test runner
    hookTimeout: 10000,
    restoreMocks: true,
    setupFiles: ['./test/setup.ts'],
    // Add more vitest config options as needed
  },
});