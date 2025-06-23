import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductPage extends BasePage {
  // Updated eBay product page locators for June 2025
  readonly productTitle: Locator = this.page.locator(
    'h1[id="x-item-title-label"], h1.x-item-title__mainTitle, h1[data-testid="x-item-title-label"], .x-item-title .x-item-title__mainTitle'
  );
  
  readonly productPrice: Locator = this.page.locator(
    '.x-price-primary .x-price-approx__price, .display-price, .x-price-primary, .notranslate'
  );
  
  // Related/Similar products section - Updated selectors for June 2025
  readonly relatedItemsSection: Locator = this.page.locator(
    '[data-testid="related-items"], .similar-items, .related-items, section[aria-label*="Related"], section[aria-label*="Best"], .lstg-also-rec'
  );
  
  readonly relatedItems: Locator = this.page.locator(
    '.similar-items .s-item, .related-items .s-item, [data-testid="related-items"] .s-item, .lstg-also-rec .s-item, .similar-items .item'
  );

  // Alternative selectors if main ones don't work
  readonly alternativeRelatedSection: Locator = this.page.locator(
    '.x-refine__main__list, .ebay-related-items, .w2b-sme, .vim-similar-items'
  );

  constructor(page: Page) {
    super(page);
  }

  async getProductTitle(): Promise<string> {
    try {
      await this.productTitle.first().waitFor({ state: 'visible', timeout: 15000 });
      const title = await this.productTitle.first().textContent();
      return title?.trim() || '';
    } catch (error) {
      console.log(`Failed to get product title: ${error}`);
      return '';
    }
  }

  async getProductPrice(): Promise<number> {
    try {
      await this.productPrice.first().waitFor({ state: 'visible', timeout: 15000 });
      const priceText = await this.productPrice.first().textContent();
      if (!priceText) return 0;
      
      // Remove currency symbols and extract numeric value
      const cleanPrice = priceText.replace(/[^\d.,]/g, '').replace(/,/g, '');
      return parseFloat(cleanPrice || '0');
    } catch (error) {
      console.log(`Failed to get product price: ${error}`);
      return 0;
    }
  }

  async getBestSellerItemsCount(): Promise<number> {
    try {
      // Try multiple selectors for related items
      const selectors = [
        '.similar-items .s-item',
        '.related-items .s-item', 
        '[data-testid="related-items"] .s-item',
        '.lstg-also-rec .s-item',
        '.vim-similar-items .item',
        '.w2b-sme .item'
      ];

      for (const selector of selectors) {
        try {
          const elements = this.page.locator(selector);
          await elements.first().waitFor({ state: 'visible', timeout: 5000 });
          const count = await elements.count();
          if (count > 0) {
            console.log(`Found ${count} related items using selector: ${selector}`);
            return Math.min(count, 6); // Cap at 6 as per requirement
          }
        } catch {
          continue;
        }
      }
      
      return 0;
    } catch (error) {
      console.log(`Failed to get related items count: ${error}`);
      return 0;
    }
  }

  async getBestSellerProductTitles(): Promise<string[]> {
    const titles: string[] = [];
    
    try {
      const selectors = [
        '.similar-items .s-item',
        '.related-items .s-item',
        '[data-testid="related-items"] .s-item',
        '.lstg-also-rec .s-item'
      ];

      for (const selector of selectors) {
        try {
          const items = this.page.locator(selector);
          const count = await items.count();
          
          if (count > 0) {
            for (let i = 0; i < Math.min(count, 6); i++) {
              try {
                const item = items.nth(i);
                const titleElement = item.locator('.s-item__title, .item-title, .item__title, h3');
                const title = await titleElement.textContent();
                if (title && title.trim() !== '') {
                  titles.push(title.trim());
                }
              } catch {
                continue;
              }
            }
            if (titles.length > 0) break;
          }
        } catch {
          continue;
        }
      }
    } catch (error) {
      console.log(`Failed to get product titles: ${error}`);
    }
    
    return titles;
  }

  async getBestSellerProductPrices(): Promise<number[]> {
    const prices: number[] = [];
    
    try {
      const selectors = [
        '.similar-items .s-item',
        '.related-items .s-item',
        '[data-testid="related-items"] .s-item',
        '.lstg-also-rec .s-item'
      ];

      for (const selector of selectors) {
        try {
          const items = this.page.locator(selector);
          const count = await items.count();
          
          if (count > 0) {
            for (let i = 0; i < Math.min(count, 6); i++) {
              try {
                const item = items.nth(i);
                const priceElement = item.locator('.s-item__price, .item-price, .price, .amt');
                const priceText = await priceElement.textContent();
                
                if (priceText) {
                  const cleanPrice = priceText.replace(/[^\d.,]/g, '').replace(/,/g, '');
                  const price = parseFloat(cleanPrice || '0');
                  if (price > 0) {
                    prices.push(price);
                  }
                }
              } catch {
                continue;
              }
            }
            if (prices.length > 0) break;
          }
        } catch {
          continue;
        }
      }
    } catch (error) {
      console.log(`Failed to get product prices: ${error}`);
    }
    
    return prices;
  }

  async isBestSellerSectionVisible(): Promise<boolean> {
    const selectors = [
      '.similar-items',
      '.related-items',
      '[data-testid="related-items"]',
      '.lstg-also-rec',
      '.vim-similar-items',
      '.w2b-sme'
    ];

    for (const selector of selectors) {
      if (await this.isElementVisible(selector, 3000)) {
        return true;
      }
    }
    
    return false;
  }
}
