import { Page, expect, Locator } from '@playwright/test';

// Wait for a selector to be visible
export async function waitForVisible(page: Page, selector: string, timeout = 10000) {
  await expect(page.locator(selector)).toBeVisible({ timeout });
}

// Wait for a locator to be visible
export async function waitForLocatorVisible(locator: Locator, timeout = 10000) {
  await expect(locator).toBeVisible({ timeout });
}
// Get text content safely (returns empty string if null)
export async function getTextSafe(locator: Locator): Promise<string> {
  const text = await locator.textContent();
  return text ? text.trim() : '';
}
// Generate a random string of given length
export function randomString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
// Soft assertion: logs error but doesn't throw
export function softAssert(condition: boolean, message: string) {
  if (!condition) {
    console.warn(`Soft assertion failed: ${message}`);
  }
}
export const SHORT_TIMEOUT = 5000;
export const DEFAULT_TIMEOUT = 10000;
export const LONG_TIMEOUT = 30000;

// Click an element and wait for navigation or a selector
export async function clickAndWait(page: Page, clickSelector: string, waitForSelector: string, timeout = 10000) {
  await Promise.all([
    page.waitForSelector(waitForSelector, { timeout }),
    page.click(clickSelector)
  ]);
}
