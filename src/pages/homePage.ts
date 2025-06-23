import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  // eBay main search bar
  readonly searchInput: Locator = this.page.locator('#gh-ac');
  // eBay search button
  readonly searchButton: Locator = this.page.locator('#gh-btn');
  // eBay category dropdown
  readonly categoryDropdown: Locator = this.page.locator('#gh-cat');
  // eBay logo (for page load verification)
  readonly logo: Locator = this.page.locator('#gh-logo');

  constructor(page: Page) {
    super(page);
  }

  async searchFor(term: string, category: string = 'All Categories') {
    // Select category if not default
    if (category && category !== 'All Categories') {
      await this.categoryDropdown.selectOption({ label: category });
    }
    await this.searchInput.fill(term);
    await this.searchButton.click();
    // Wait for navigation to search results page
    await this.page.waitForURL(/\/sch\//i, { timeout: 15000 });
  }

  async isLoaded(): Promise<boolean> {
    return await this.logo.isVisible();
  }
}
