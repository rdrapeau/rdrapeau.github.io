import { test, expect } from '@playwright/test';

test.describe('Custom 404 Page (404.html)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/404.html');
    });

    test('renders 404 header, headshot avatar, and status badge', async ({ page }) => {
        await expect(page).toHaveTitle(/404 — Page Not Found/);

        const headshot = page.locator('img.headshot');
        await expect(headshot).toBeVisible();

        const badge = page.locator('.status-badge');
        await expect(badge).toBeVisible();
        await expect(badge).toContainText('404 · NOT FOUND');

        const heading = page.locator('h1');
        await expect(heading).toHaveText('Page Not Found');

        const description = page.locator('.description');
        await expect(description).toBeVisible();
    });

    test('verifies headshot image loads successfully with HTTP 200', async ({ page }) => {
        const headshot = page.locator('img.headshot');
        const naturalWidth = await headshot.evaluate((img) => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
    });

    test('clicking "Return to drapeau.dev" navigates back to home page', async ({ page }) => {
        const homeBtn = page.locator('.btn-home');
        await expect(homeBtn).toBeVisible();
        await homeBtn.click();
        await page.waitForURL(/\/(#.*)?$/);
        await expect(page.locator('h1')).toContainText('Ryan Drapeau');
    });

    test('quick links navigate to home section tabs', async ({ page }) => {
        const projectsLink = page.locator('.quick-nav a[href="./#projects"]');
        await expect(projectsLink).toBeVisible();

        const writingLink = page.locator('.quick-nav a[href="./#writing"]');
        await expect(writingLink).toBeVisible();

        const patentsLink = page.locator('.quick-nav a[href="./#patents"]');
        await expect(patentsLink).toBeVisible();

        const researchLink = page.locator('.quick-nav a[href="./#research"]');
        await expect(researchLink).toBeVisible();
    });

    test('supports dark mode and light mode color schemes', async ({ page }) => {
        // Light mode
        await page.emulateMedia({ colorScheme: 'light' });
        const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        expect(lightBg).toBe('rgb(250, 250, 250)'); // #fafafa

        // Dark mode
        await page.emulateMedia({ colorScheme: 'dark' });
        const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        expect(darkBg).toBe('rgb(15, 17, 23)'); // #0f1117
    });

    test('declares apple-touch-icon linking to drapeau.jpg', async ({ page }) => {
        const appleIcon = page.locator('link[rel="apple-touch-icon"]');
        await expect(appleIcon).toHaveAttribute('href', './drapeau.jpg');
    });

    test('emits zero page errors or uncaught exceptions', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (err) => errors.push(err));
        await page.goto('/404.html');
        expect(errors).toEqual([]);
    });
});
