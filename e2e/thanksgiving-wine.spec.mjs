import { test, expect } from '@playwright/test';

test.describe('Thanksgiving Sommelier Pairing Subproject', () => {
    test('renders all courses, filters cleanly, and navigates cue-card reader without errors', async ({ page }) => {
        const pageErrors = [];
        page.on('pageerror', err => pageErrors.push(err.message));

        await page.goto('/thanksgiving_wine/');
        await expect(page).toHaveTitle(/The Valley Crush/);

        // 14 wine cards (12 primary + 2 optional swaps)
        await expect(page.locator('.wine-card')).toHaveCount(14);
        await expect(page.locator('#poured-counter')).toHaveText('0 / 12 primary poured');

        // Filter to Course 3
        await page.click('.filter-btn[data-filter="course-3"]');
        await expect(page.locator('.course-section[data-course="course-3"]')).toBeVisible();
        await expect(page.locator('.course-section[data-course="course-1"]')).toBeHidden();

        // Reset to All Courses
        await page.click('.filter-btn[data-filter="all"]');
        await expect(page.locator('.course-section[data-course="course-1"]')).toBeVisible();

        // Launch Cue-Card Reader modal
        await page.click('#open-reader-btn');
        const dialog = page.locator('#cue-dialog');
        await expect(dialog).toBeVisible();
        await expect(page.locator('#dialog-wine-title')).toContainText('Marine Layer Brut Rosé');

        // Advance to next pour and mark poured
        await page.click('#dlg-next-btn');
        await expect(page.locator('#dialog-wine-title')).toContainText('Mumm Napa Brut Prestige');
        await page.click('#dlg-poured-check');
        await expect(page.locator('#poured-counter')).toHaveText('1 / 12 primary poured');

        // Close modal
        await page.click('#dlg-close-btn');
        await expect(dialog).toBeHidden();
        expect(pageErrors).toEqual([]);
    });

    test('renders cleanly on mobile viewport without horizontal overflow', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/thanksgiving_wine/');

        const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalOverflow).toBe(false);
    });

    test('serves valid Open Graph and Apple iMessage rich preview metadata and assets', async ({ page, request }) => {
        await page.goto('/thanksgiving_wine/');

        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /The Valley Crush/);
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://drapeau.dev/thanksgiving_wine/og-image.jpg');
        await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
        await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
        await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', './apple-touch-icon.png');

        const ogResp = await request.get('/thanksgiving_wine/og-image.jpg');
        expect(ogResp.status()).toBe(200);
        expect(ogResp.headers()['content-type']).toContain('image/jpeg');

        const iconResp = await request.get('/thanksgiving_wine/apple-touch-icon.png');
        expect(iconResp.status()).toBe(200);
        expect(iconResp.headers()['content-type']).toContain('image/png');
    });
});
