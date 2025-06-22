import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly firstResult: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstResult = page.locator('ul.srp-results > li.s-item').first(); // Adjust selector as needed
  }

  async clickFirstResult() {
    await this.firstResult.click();
  }
}
