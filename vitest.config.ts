import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/modules/**/server/**/*.ts', 'src/lib/orpc/**/*.ts'],
      exclude: ['**/*.types.ts', '**/*.schemas.ts', '**/*.routes.ts'],
    },
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
