import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    }
  ]
});