import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly bestSellerSection: Locator;
  readonly bestSellerItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bestSellerSection = page.locator('[data-testid="best-seller-section"]');
    this.bestSellerItems = page.locator('[data-testid="best-seller-item"]');
  }

  async getBestSellerItemsCount(): Promise<number> {
    return this.bestSellerItems.count();
  }

  async getBestSellerProductTitles(): Promise<string[]> {
    return this.bestSellerItems.allTextContents();
  }

  // Add more methods for category, price, etc.
}
