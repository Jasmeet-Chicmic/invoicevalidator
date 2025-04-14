import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [],
    }
  },
  esbuild: {
    target: 'node14',
  },
  plugins: [
		react({
			babel: {
				plugins: [['module:@preact/signals-react-transform']],
			},
		}),
	],
})