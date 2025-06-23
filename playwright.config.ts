import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 120000,
  expect: { timeout: 30000 },
  fullyParallel: false,
  workers: 1,
  retries: 2,
  
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000,
    navigationTimeout: 60000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  reporter: [
    ['list'], // Console output
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // HTML report
    ['json', { outputFile: 'test-results/results.json' }], // JSON report
    ['junit', { outputFile: 'test-results/results.xml' }], // JUnit XML report
  ],

  outputDir: 'test-results',
});
