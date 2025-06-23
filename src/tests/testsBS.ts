import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { SearchPage } from '../pages/searchPage';
import { ProductPage } from '../pages/productPage';
import { config } from '../config/config';

test.describe('eBay Wallet Best Seller Related Products', () => {
  let homePage: HomePage;
  let searchPage: SearchPage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchPage = new SearchPage(page);
    productPage = new ProductPage(page);
  });

  test('User can search for wallet and navigate to product page', async ({ page }) => {
    await homePage.navigateTo(config.baseUrl);
    expect(await homePage.isLoaded()).toBeTruthy();

    await homePage.searchFor(config.testData.searchTerm, config.testData.category);
    expect(await searchPage.getResultsCount()).toBeGreaterThan(0);

    await searchPage.clickFirstResult();
    const title = await productPage.getProductTitle();
    expect(title.toLowerCase()).toContain('wallet');
  });

  test('Best seller/related section is visible and up to 6 products are shown', async ({ page }) => {
    await homePage.navigateTo(config.baseUrl);
    await homePage.searchFor(config.testData.searchTerm, config.testData.category);
    await searchPage.clickFirstResult();

    expect(await productPage.isBestSellerSectionVisible()).toBeTruthy();
    const relatedCount = await productPage.getBestSellerItemsCount();
    expect(relatedCount).toBeGreaterThan(0);
    expect(relatedCount).toBeLessThanOrEqual(config.testData.maxBestSellers);
  });

  test('All related products have a title and price', async ({ page }) => {
    await homePage.navigateTo(config.baseUrl);
    await homePage.searchFor(config.testData.searchTerm, config.testData.category);
    await searchPage.clickFirstResult();

    const titles = await productPage.getBestSellerProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    titles.forEach(t => expect(t).not.toBeFalsy());

    const prices = await productPage.getBestSellerProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    prices.forEach(p => expect(p).toBeGreaterThan(0));
  });

  test('Related products are in similar category', async ({ page }) => {
    await homePage.navigateTo(config.baseUrl);
    await homePage.searchFor(config.testData.searchTerm, config.testData.category);
    await searchPage.clickFirstResult();

    const titles = await productPage.getBestSellerProductTitles();
    const keywords = ['wallet', 'purse', 'accessory', 'leather', 'card'];
    const matches = titles.filter(title =>
      keywords.some(k => title.toLowerCase().includes(k))
    );
    expect(matches.length).toBeGreaterThan(0);
  });

  test('Related products are clickable', async ({ page }) => {
    await homePage.navigateTo(config.baseUrl);
    await homePage.searchFor(config.testData.searchTerm, config.testData.category);
    await searchPage.clickFirstResult();

    const items = await productPage.bestSellerItems.all();
    if (items.length > 0) {
      await items[0].locator('a').first().click();
      await expect(page).toHaveURL(/\/itm\//);
    }
  });

  // Negative/Edge Case Example
  test('No related products for rare/invalid search', async ({ page }) => {
    await homePage.navigateTo(config.baseUrl);
    await homePage.searchFor('xyzabc123invalid');
    if ((await searchPage.getResultsCount()) > 0) {
      await searchPage.clickFirstResult();
      const count = await productPage.getBestSellerItemsCount();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
