import { test, expect } from '@playwright/test';

test.describe('Interactive Visualizer Widgets', () => {
    test('renders canvas visualizers with proper dimensions and zero JS errors', async ({ page }) => {
        const pageErrors = [];
        page.on('pageerror', err => {
            pageErrors.push(err.message);
        });

        await page.goto('/');

        // Wait for visible project canvases to mount
        const visibleCanvases = page.locator('#section-projects .project:not(.hidden) canvas.preview-canvas');
        await expect(visibleCanvases.first()).toBeVisible();

        const count = await visibleCanvases.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const canvas = visibleCanvases.nth(i);
            const box = await canvas.boundingBox();
            if (box) {
                expect(box.width).toBeGreaterThan(50);
                expect(box.height).toBeGreaterThan(30);
            }
        }

        expect(pageErrors).toEqual([]);
    });

    test('supports mouse pointer scrubbing on the featured rowing canvas', async ({ page }) => {
        await page.goto('/');

        const rowingCanvas = page.locator('#canvas-rowing_performance');
        await expect(rowingCanvas).toBeVisible();

        const box = await rowingCanvas.boundingBox();
        expect(box).not.toBeNull();

        // Scrub across canvas from left to right
        await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5);
        await page.waitForTimeout(100);

        await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.5);
        await page.waitForTimeout(100);

        // Verify canvas is still intact and rendering
        await expect(rowingCanvas).toBeVisible();
    });
});
