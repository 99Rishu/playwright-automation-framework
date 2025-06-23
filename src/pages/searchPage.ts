import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class SearchPage extends BasePage {
  // Updated selectors for June 2025
  readonly searchResults: Locator;
  readonly firstResultLink: Locator;
  readonly resultsCount: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    // Use robust selectors: prefer roles, text, and data attributes if available
    this.searchResults = page.locator('.srp-results .s-item:not(.s-item--watch-at-auction)');
    this.firstResultLink = this.searchResults.locator('.s-item__link').first();
    this.resultsCount = page.locator('.srp-controls__count-heading, .listingscnt');
    this.sortDropdown = page.locator('.x-flyout__button');
  }

  /**
   * Clicks the first result in the search results.
   * Waits for navigation to the product page.
   */
  async clickFirstResult() {
  await expect(this.firstResultLink).toBeVisible({ timeout: 15000 });

  // Try to detect if the link opens in a new tab
  const [popup] = await Promise.all([
    this.page.context().waitForEvent('page').catch(() => null),
    this.firstResultLink.click()
  ]);

  if (popup) {
    await popup.waitForLoadState('domcontentloaded');
    return popup;
  } else {
    // If no popup, wait for navigation in the same tab
    await this.page.waitForLoadState('domcontentloaded');
    return this.page;
  }
}


  /**
   * Returns the number of search results found (parsed from the results count element).
   */
  async getResultsCount(): Promise<number> {
    await expect(this.resultsCount.first()).toBeVisible({ timeout: 10000 });
    const countText = await this.resultsCount.first().textContent();
    if (!countText) return 0;
    // Extract the first number from the text
    const match = countText.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Returns an array of Locators for all result items on the page.
   */
  async getResultItems(): Promise<Locator[]> {
    const count = await this.searchResults.count();
    const items: Locator[] = [];
    for (let i = 0; i < count; i++) {
      items.push(this.searchResults.nth(i));
    }
    return items;
  }
}
