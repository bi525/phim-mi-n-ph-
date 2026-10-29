import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'server',
          environment: 'node',
          include: ['server/**/*.test.ts', 'shared/**/*.test.ts']
        }
      },
      {
        plugins: [svelte({ configFile: fileURLToPath(new URL('./client/svelte.config.js', import.meta.url)) })],
        resolve: {
          conditions: ['browser'],
          alias: {
            '@': fileURLToPath(new URL('./client/src', import.meta.url)),
            '@shared': fileURLToPath(new URL('./shared', import.meta.url))
          }
        },
        test: {
          name: 'client',
          // jsdom (không phải happy-dom) — DOMPurify (Task 3, sanitizeContentHtml) chỉ được kiểm chứng
          // chính thức với jsdom/trình duyệt thật; happy-dom có khác biệt DOM nhỏ khiến sanitize ra sai kết quả.
          environment: 'jsdom',
          include: ['client/src/**/*.test.ts'],
          root: fileURLToPath(new URL('.', import.meta.url))
        }
      }
    ]
  }
});
