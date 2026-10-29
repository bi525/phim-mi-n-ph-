import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:8793',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'FILMMOI_FIXTURES=1 FILMMOI_PORT=8793 FILMMOI_DATA_DIR=.e2e-data node dist/server/index.js',
    url: 'http://127.0.0.1:8793/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
