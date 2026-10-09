import { test, expect } from '@playwright/test';

test.describe('Le Drapeau Flag Hover Easter Egg', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('renders interactive drapeau element with accessible attributes', async ({ page }) => {
        const drapeau = page.locator('#drapeau-name');
        await expect(drapeau).toBeVisible();
        await expect(drapeau).toHaveAttribute('role', 'button');
        await expect(drapeau).toHaveAttribute('tabindex', '0');
        await expect(drapeau).toHaveAttribute('title', /flag 🇫🇷/);

        const textSpan = drapeau.locator('.drapeau-text');
        const flagSpan = drapeau.locator('.drapeau-flag');

        await expect(textSpan).toHaveText('Drapeau');
        await expect(flagSpan).toHaveText('🇫🇷');
    });

    test('reveals flag on hover', async ({ page }) => {
        const drapeau = page.locator('#drapeau-name');
        const flagSpan = drapeau.locator('.drapeau-flag');

        // Initially flag opacity is 0
        const initialOpacity = await flagSpan.evaluate(el => window.getComputedStyle(el).opacity);
        expect(parseFloat(initialOpacity)).toBe(0);

        // Hover over name
        await drapeau.hover();
        await page.waitForTimeout(250);

        const hoverOpacity = await flagSpan.evaluate(el => window.getComputedStyle(el).opacity);
        expect(parseFloat(hoverOpacity)).toBeGreaterThan(0.8);
    });

    test('toggles active state on click/tap for touch users', async ({ page }) => {
        const drapeau = page.locator('#drapeau-name');

        await drapeau.click();
        await expect(drapeau).toHaveClass(/\bactive\b/);

        // Clicking outside removes active state
        await page.click('body', { position: { x: 10, y: 10 } });
        await expect(drapeau).not.toHaveClass(/\bactive\b/);
    });

    test('supports keyboard activation with Enter and Space', async ({ page }) => {
        const drapeau = page.locator('#drapeau-name');
        await drapeau.focus();

        // Press Enter
        await page.keyboard.press('Enter');
        await expect(drapeau).toHaveClass(/\bactive\b/);

        // Press Enter again to toggle off
        await page.keyboard.press('Enter');
        await expect(drapeau).not.toHaveClass(/\bactive\b/);

        // Press Space
        await page.keyboard.press('Space');
        await expect(drapeau).toHaveClass(/\bactive\b/);
    });
});
