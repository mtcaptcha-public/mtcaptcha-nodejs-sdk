import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'mtcaptcha',
      fileName: (format) => `mtcaptcha-nodejs-sdk.${format}.js`,
    },
    target: 'node14',
    rollupOptions: {
      external: ['node:https', 'https'],
    },
  },
});
