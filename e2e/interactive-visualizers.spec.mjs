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

    test('preserves canvas buffer dimensions without jitter when switching tabs back and forth', async ({ page }) => {
        await page.goto('/');

        // Wait for visible project visualizers to initialize
        const visibleCanvases = page.locator('#section-projects .project:not(.hidden) canvas.preview-canvas');
        await expect(visibleCanvases.first()).toBeVisible();

        // Capture initial canvas bitmap width/height attributes
        const initialDims = await page.evaluate(() => {
            const canvases = Array.from(document.querySelectorAll('#section-projects .project:not(.hidden) canvas.preview-canvas'));
            return canvases.map(c => ({
                id: c.id,
                width: c.width,
                height: c.height
            }));
        });

        expect(initialDims.length).toBeGreaterThan(0);
        for (const dim of initialDims) {
            expect(dim.width).toBeGreaterThan(0);
            expect(dim.height).toBeGreaterThan(0);
        }

        // Switch to Writing
        await page.click('#tab-writing');
        await expect(page.locator('#section-writing')).toBeVisible();

        // Switch to Patents
        await page.click('#tab-patents');
        await expect(page.locator('#section-patents')).toBeVisible();

        // Switch back to Projects
        await page.click('#tab-projects');
        await expect(page.locator('#section-projects')).toBeVisible();

        // Wait for View Transitions animation and settlement
        await page.waitForTimeout(300);

        const afterDims = await page.evaluate(() => {
            const canvases = Array.from(document.querySelectorAll('#section-projects .project:not(.hidden) canvas.preview-canvas'));
            return canvases.map(c => ({
                id: c.id,
                width: c.width,
                height: c.height
            }));
        });

        expect(afterDims).toEqual(initialDims);
    });
});
