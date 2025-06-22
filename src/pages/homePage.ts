import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', { name: /search/i }); // Adjust as per actual label/placeholder
    this.searchButton = page.getByRole('button', { name: /search/i }); // Adjust as per actual button text
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }
}
