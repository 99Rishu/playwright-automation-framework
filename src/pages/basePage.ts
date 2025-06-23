import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigateTo(url: string, timeout = 30000) {
    await this.page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout 
    });
    await this.page.waitForLoadState('networkidle');
  }
}