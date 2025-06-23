import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class SearchPage extends BasePage {
  // Each product result in the search results grid
  readonly searchResults: Locator = this.page.locator('.srp-results .s-item');
  // The first clickable product link in the search results
  readonly firstResult: Locator = this.page.locator('.srp-results .s-item').first().locator('.s-item__link');
  // Heading that shows the number of results
  readonly resultsCount: Locator = this.page.locator('.srp-controls__count-heading');
  // Optional: Search results page title (for verification)
  readonly searchTitle: Locator = this.page.locator('.srp-controls__control--title, h1.srp-controls__title');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Clicks the first product in the search results.
   */
  async clickFirstResult() {
    await this.firstResult.click();
    await this.page.waitForURL(/\/itm\//, { timeout: 15000 });
  }

  /**
   * Returns the number of search results (as displayed by eBay).
   */
  async getResultsCount(): Promise<number> {
    const countText = await this.resultsCount.textContent();
    // Extracts the first number found in the heading (e.g., "1,234 Results")
    const match = countText?.match(/[\d,]+/);
    return parseInt(match?.[0]?.replace(/,/g, '') || '0');
  }

  /**
   * Returns all search result items as Locator array.
   */
  async getResultItems(): Promise<Locator[]> {
    return await this.searchResults.all();
  }

  /**
   * Returns the search page title text (optional, for validation).
   */
  async getSearchTitle(): Promise<string> {
    return (await this.searchTitle.textContent())?.trim() || '';
  }
}
