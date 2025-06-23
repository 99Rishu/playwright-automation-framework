# eBay Wallet Best Sellers Automation Framework
A robust automation framework built with Playwright and TypeScript for testing eBay's wallet best sellers feature, covering all positive, negative, and edge cases as per the QA Skills Assessment requirements.

🚀 Motivation
This framework is designed to automate the validation of eBay's wallet best sellers feature, ensuring that:

Searching for wallets works correctly

Product pages display correct details

Related best seller products are shown in the same category and price range

All scenarios (positive, negative, edge cases) are covered

🏗️ Project Structure
src/
├── pages/            # Page Object Model classes
│   ├── homePage.ts
│   ├── searchPage.ts
│   └── productPage.ts
├── tests/            # Test specifications
│   └── ebayWalletTests.spec.ts
├── config/           # Configuration files
│   └── config.ts
└── utils/            # Utility functions
playwright.config.ts  # Playwright configuration
package.json          # Node.js dependencies


🛠️ Technology & Framework
Testing Framework: Playwright

Language: TypeScript

Design Pattern: Page Object Model (POM)

Reporting: Playwright HTML Report

📊 Test Coverage
Positive test cases: Search, product details, related products, mobile/tablet responsiveness, performance

Negative test cases: Invalid/empty/special character/long search, network interruption, missing related products, invalid URL, JavaScript disabled

Edge cases: High/low price products, page refresh, multiple rapid clicks, session maintenance

🧩 Features
Page Object Model (POM): Clean separation of test logic and UI locators.

Robust locators: Updated for eBay's June 2025 UI.

Parallel execution: Runs tests in parallel for speed.

Comprehensive reporting: HTML, JSON, and JUnit reports.



📝 Code Example
typescript
// Example test case
test('Should navigate to first wallet product', async () => {
  await homePage.navigateTo(config.baseUrl);
  await homePage.searchFor('wallet', 'All Categories');
  await searchPage.clickFirstResult();
  expect(await productPage.getProductTitle()).toBeTruthy();
});

🤝 Contribute
Feel free to fork, open issues, or submit pull requests. Contributions are welcome!



