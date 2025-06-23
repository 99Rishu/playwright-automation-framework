import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigateTo(url: string, timeout = 60000) {
    try {
      await this.page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout 
      });
      await this.page.waitForSelector('body', { timeout: 10000 });
    } catch (error) {
      console.log(`Navigation to ${url} failed: ${error}`);
      throw error;
    }
  }

  async waitForElement(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async isElementVisible(selector: string, timeout = 5000): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }
}
