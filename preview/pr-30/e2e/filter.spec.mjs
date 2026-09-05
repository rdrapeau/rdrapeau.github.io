import { test, expect } from '@playwright/test';

test.describe('Projects Filter Bar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('defaults to Live Projects filter on initial load', async ({ page }) => {
        const liveBtn = page.locator('.filter-btn[data-filter="live"]');
        await expect(liveBtn).toHaveClass(/active/);

        const visibleProjects = page.locator('#section-projects .project:not(.hidden)');
        await expect(visibleProjects).toHaveCount(5);

        const hiddenProjects = page.locator('#section-projects .project.hidden');
        await expect(hiddenProjects).toHaveCount(2);
    });

    test('filters to In Development projects when clicked', async ({ page }) => {
        await page.click('.filter-btn[data-filter="in-dev"]');

        const inDevBtn = page.locator('.filter-btn[data-filter="in-dev"]');
        await expect(inDevBtn).toHaveClass(/active/);

        const visibleProjects = page.locator('#section-projects .project:not(.hidden)');
        await expect(visibleProjects).toHaveCount(2);

        // Verify only in-dev items are shown
        const statuses = await visibleProjects.evaluateAll(els => els.map(e => e.getAttribute('data-status')));
        expect(statuses.every(s => s === 'in-dev')).toBe(true);
    });

    test('filters to All projects when All button is clicked', async ({ page }) => {
        await page.click('.filter-btn[data-filter="all"]');

        const allBtn = page.locator('.filter-btn[data-filter="all"]');
        await expect(allBtn).toHaveClass(/active/);

        const visibleProjects = page.locator('#section-projects .project:not(.hidden)');
        await expect(visibleProjects).toHaveCount(7);

        const hiddenProjects = page.locator('#section-projects .project.hidden');
        await expect(hiddenProjects).toHaveCount(0);
    });

    test('switches between filters repeatedly without layout glitches', async ({ page }) => {
        await page.click('.filter-btn[data-filter="in-dev"]');
        await expect(page.locator('#section-projects .project:not(.hidden)')).toHaveCount(2);

        await page.click('.filter-btn[data-filter="live"]');
        await expect(page.locator('#section-projects .project:not(.hidden)')).toHaveCount(5);

        await page.click('.filter-btn[data-filter="all"]');
        await expect(page.locator('#section-projects .project:not(.hidden)')).toHaveCount(7);
    });
});
