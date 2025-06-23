export const config = {
    baseUrl: 'https://www.ebay.com',
    defaultTimeout: 30000,
    testData: {
      // Main search term for the scenario
      searchTerm: 'wallet',
      // eBay category for wallets (can also use 'All Categories' or 'Fashion')
      category: 'Fashion',
      // Maximum number of best seller/related products to expect
      maxBestSellers: 6,
      // Acceptable price range for related products (adjust as needed)
      priceRange: {
        min: 5,
        max: 500
      }
    }
  };
  