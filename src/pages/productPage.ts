import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductPage extends BasePage {
  // Main product title (works for most eBay product pages)
  readonly productTitle: Locator = this.page.locator('h1[data-testid="x-item-title-label"], h1[itemprop="name"]');
  // Main product price (covers possible price containers)
  readonly productPrice: Locator = this.page.locator('.x-price-primary, .display-price, .x-price-approx__price');
  // Main product image (optional, for visual checks)
  readonly productImage: Locator = this.page.locator('#icImg, #mainImgHldr img, [data-testid="x-item-image"] img');

  // Best Seller / Related Products section (robust selectors for 2025 eBay)
  readonly bestSellerSection: Locator = this.page.locator(
    'section[aria-label*="Best Seller"], section[aria-label*="Related"], [data-testid="related-items"], .x-related-items'
  );
  // Individual related/best seller items
  readonly bestSellerItems: Locator = this.page.locator(
    '[data-testid="related-items"] .s-item, .x-related-items .s-item, section[aria-label*="Best Seller"] .s-item'
  );

  constructor(page: Page) {
    super(page);
  }

  /**
   * Gets the main product's title.
   */
  async getProductTitle(): Promise<string> {
    return (await this.productTitle.textContent())?.trim() || '';
  }

  /**
   * Gets the main product's price as a number.
   */
  async getProductPrice(): Promise<number> {
    const priceText = await this.productPrice.first().textContent();
    if (!priceText) return 0;
    const match = priceText.replace(/[^\d.]/g, '');
    return parseFloat(match || '0');
  }

  /**
   * Returns the count of best seller/related items.
   */
  async getBestSellerItemsCount(): Promise<number> {
    return await this.bestSellerItems.count();
  }

  /**
   * Returns all best seller/related product titles as an array.
   */
  async getBestSellerProductTitles(): Promise<string[]> {
    const items = await this.bestSellerItems.all();
    const titles: string[] = [];
    for (const item of items) {
      // Try to get the title from the most common eBay classes
      const title = await item.locator('.s-item__title, .item-title').textContent();
      if (title) titles.push(title.trim());
    }
    return titles;
  }

  /**
   * Returns all best seller/related product prices as an array of numbers.
   */
  async getBestSellerProductPrices(): Promise<number[]> {
    const items = await this.bestSellerItems.all();
    const prices: number[] = [];
    for (const item of items) {
      const priceText = await item.locator('.s-item__price, .item-price, .x-price-primary').first().textContent();
      if (priceText) {
        const match = priceText.replace(/[^\d.]/g, '');
        const price = parseFloat(match || '0');
        if (price > 0) prices.push(price);
      }
    }
    return prices;
  }

  /**
   * Checks if the best seller/related section is visible.
   */
  async isBestSellerSectionVisible(): Promise<boolean> {
    return await this.bestSellerSection.isVisible();
  }
}
