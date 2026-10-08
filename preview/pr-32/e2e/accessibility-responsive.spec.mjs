import { test, expect } from '@playwright/test';

test.describe('Responsive Layout & Accessibility', () => {
    test('renders mobile 2x2 tab grid without horizontal overflow', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Verify tabs are visible
        const tabsContainer = page.locator('.site-tabs');
        await expect(tabsContainer).toBeVisible();

        // Verify zero horizontal page overflow
        const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalOverflow).toBe(false);

        // Verify tab switching works on mobile viewport
        await page.click('#tab-research');
        await expect(page.locator('#section-research')).toBeVisible();
    });

    test('supports dark mode theme color scheme', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.goto('/');

        const bodyBg = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });

        // In dark mode body background should be dark (rgb(12, 14, 20) or rgb(15, 17, 23))
        expect(bodyBg).toMatch(/rgb\((12|13|14|15|16|17|20|23|26)/);
    });

    test('supports light mode theme color scheme', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        const bodyBg = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });

        // In light mode body background is white/light
        expect(bodyBg).toMatch(/rgb\((255|250|248|245)/);
    });

    test('verifies all internal image resources load successfully with HTTP 200', async ({ page }) => {
        const failedImages = [];
        page.on('response', resp => {
            if (resp.request().resourceType() === 'image' && resp.status() >= 400) {
                failedImages.push({ url: resp.url(), status: resp.status() });
            }
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        expect(failedImages).toEqual([]);
    });
});
