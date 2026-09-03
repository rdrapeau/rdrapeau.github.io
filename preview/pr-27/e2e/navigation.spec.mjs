import { test, expect } from '@playwright/test';

test.describe('Navigation & Tab Switching', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('renders primary page header, headshot avatar, and default active tab', async ({ page }) => {
        await expect(page).toHaveTitle(/Ryan Drapeau/);
        const headshot = page.locator('img.headshot');
        await expect(headshot).toBeVisible();

        const activeTab = page.locator('.site-tab.active');
        await expect(activeTab).toHaveAttribute('data-tab', 'projects');

        const projectsSection = page.locator('#section-projects');
        await expect(projectsSection).toBeVisible();
    });

    test('switches tabs smoothly when clicked and updates URL hash', async ({ page }) => {
        // Switch to Research tab
        await page.click('#tab-research');
        await expect(page.locator('#tab-research')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-research')).toBeVisible();
        await expect(page.locator('#section-projects')).toBeHidden();
        expect(page.url()).toContain('#research');

        // Switch to Patents tab
        await page.click('#tab-patents');
        await expect(page.locator('#tab-patents')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-patents')).toBeVisible();
        await expect(page.locator('#section-research')).toBeHidden();
        expect(page.url()).toContain('#patents');

        // Switch to Writing tab
        await page.click('#tab-writing');
        await expect(page.locator('#tab-writing')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-writing')).toBeVisible();
        await expect(page.locator('#section-patents')).toBeHidden();
        expect(page.url()).toContain('#writing');

        // Switch back to Projects tab
        await page.click('#tab-projects');
        await expect(page.locator('#tab-projects')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-projects')).toBeVisible();
        await expect(page.locator('#section-writing')).toBeHidden();
        expect(page.url()).toContain('#projects');
    });

    test('activates correct tab when loaded directly with URL hash', async ({ page }) => {
        await page.goto('/#patents');
        await expect(page.locator('#tab-patents')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-patents')).toBeVisible();
        await expect(page.locator('#section-projects')).toBeHidden();
    });

    test('reacts to direct URL hash navigation', async ({ page }) => {
        await page.goto('/#research');
        await expect(page.locator('#section-research')).toBeVisible();
        await expect(page.locator('#tab-research')).toHaveClass(/\bactive\b/);

        await page.goto('/#writing');
        await expect(page.locator('#section-writing')).toBeVisible();
        await expect(page.locator('#tab-writing')).toHaveClass(/\bactive\b/);

        await page.goto('/#projects');
        await expect(page.locator('#section-projects')).toBeVisible();
        await expect(page.locator('#tab-projects')).toHaveClass(/\bactive\b/);
    });

    test('supports keyboard numeric shortcuts (1, 2, 3, 4)', async ({ page }) => {
        // Focus body to ensure window receives keyboard events across all browser engines
        await page.locator('body').click();

        // Press 2 -> Research
        await page.keyboard.press('2');
        await expect(page.locator('#section-research')).toBeVisible();

        // Press 3 -> Patents
        await page.keyboard.press('3');
        await expect(page.locator('#section-patents')).toBeVisible();

        // Press 4 -> Writing
        await page.keyboard.press('4');
        await expect(page.locator('#section-writing')).toBeVisible();

        // Press 1 -> Projects
        await page.keyboard.press('1');
        await expect(page.locator('#section-projects')).toBeVisible();
    });
});
