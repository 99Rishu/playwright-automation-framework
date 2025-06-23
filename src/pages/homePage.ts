import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  readonly searchInput: Locator = this.page.locator('#gh-ac');
  // Updated locator for June 2025
  readonly searchButton: Locator = this.page.locator('button[type="submit"]');
  readonly categoryDropdown: Locator = this.page.locator('#gh-cat');
  readonly logo: Locator = this.page.locator('#gh-logo');
  readonly advancedSearchLink: Locator = this.page.locator('#gh-as-a');

  constructor(page: Page) {
    super(page);
  }

  async searchFor(term: string, category: string = 'All Categories') {
    try {
      await this.searchInput.waitFor({ state: 'visible', timeout: 15000 });
      await expect(this.searchInput).toBeEnabled();

      await this.searchInput.fill('');
      await this.searchInput.type(term, { delay: 50 });
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(300);

      if (category && category !== 'All Categories') {
        const categoryVisible = await this.isElementVisible('#gh-cat');
        if (categoryVisible) {
          await this.categoryDropdown.selectOption({ label: category });
        }
      }

      // Use the updated, robust locator for the search button
      await this.searchButton.waitFor({ state: 'visible', timeout: 10000 });
      await expect(this.searchButton).toBeEnabled({ timeout: 10000 });
      await this.searchButton.click();

      await this.page.waitForURL(/\/sch\//i, { timeout: 30000 });
    } catch (error) {
      console.log(`Search failed: ${error}`);
      throw error;
    }
  }

  async isLoaded(): Promise<boolean> {
    return await this.isElementVisible('#gh-logo');
  }
}
