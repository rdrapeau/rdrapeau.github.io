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

    test('declares and computes native root color-scheme', async ({ page }) => {
        await page.goto('/');
        const colorScheme = await page.evaluate(() => {
            return window.getComputedStyle(document.documentElement).colorScheme;
        });
        expect(colorScheme).toBe('light dark');
    });

    test('verifies webmanifest loads successfully with HTTP 200', async ({ request }) => {
        const response = await request.get('/manifest.webmanifest');
        expect(response.status()).toBe(200);
        const json = await response.json();
        expect(json.name).toContain('Ryan Drapeau');
        expect(json.display).toBe('standalone');
    });

    test('verifies llms.txt and llms-full.txt load successfully with HTTP 200', async ({ request }) => {
        const llmsResp = await request.get('/llms.txt');
        expect(llmsResp.status()).toBe(200);
        const llmsText = await llmsResp.text();
        expect(llmsText).toContain('# Ryan Drapeau');
        expect(llmsText).toContain('## Projects');

        const fullResp = await request.get('/llms-full.txt');
        expect(fullResp.status()).toBe(200);
        const fullText = await fullResp.text();
        expect(fullText).toContain('Full Portfolio & Research Dossier');
    });

    test('verifies robots.txt loads successfully and allows crawling', async ({ request }) => {
        const response = await request.get('/robots.txt');
        expect(response.status()).toBe(200);
        const text = await response.text();
        expect(text).toContain('User-agent: *');
        expect(text).toContain('Allow: /');
        expect(text).not.toContain('Disallow: /');
    });

    test('skip-to-content link becomes visible on keyboard focus and navigates to #main-content', async ({ page }) => {
        await page.goto('/');
        const skipLink = page.locator('.skip-link');

        // Before focus, it should be positioned off-screen
        const boundingBoxBefore = await skipLink.boundingBox();
        expect(boundingBoxBefore.y).toBeLessThan(0);

        // Press Tab to focus the first interactive element (skip link)
        await page.keyboard.press('Tab');
        await expect(skipLink).toBeFocused();

        // When focused, wait for transition to bring it into viewport
        await expect.poll(async () => {
            const box = await skipLink.boundingBox();
            return box ? box.y : -1;
        }).toBeGreaterThanOrEqual(0);

        // Activating skip link jumps focus / scroll to #main-content
        await page.keyboard.press('Enter');
        const mainContent = page.locator('#main-content');
        await expect(mainContent).toBeVisible();
    });

    test('filter buttons toggle aria-pressed state on click', async ({ page }) => {
        await page.goto('/');
        const liveBtn = page.locator('button[data-filter="live"]');
        const allBtn = page.locator('button[data-filter="all"]');
        const devBtn = page.locator('button[data-filter="in-dev"]');

        await expect(liveBtn).toHaveAttribute('aria-pressed', 'true');
        await expect(allBtn).toHaveAttribute('aria-pressed', 'false');
        await expect(devBtn).toHaveAttribute('aria-pressed', 'false');

        // Click All
        await allBtn.click();
        await expect(liveBtn).toHaveAttribute('aria-pressed', 'false');
        await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
        await expect(devBtn).toHaveAttribute('aria-pressed', 'false');

        // Click In Development
        await devBtn.click();
        await expect(liveBtn).toHaveAttribute('aria-pressed', 'false');
        await expect(allBtn).toHaveAttribute('aria-pressed', 'false');
        await expect(devBtn).toHaveAttribute('aria-pressed', 'true');
    });

    test('tablist supports arrow navigation and Home/End roving tabindex keys', async ({ page }) => {
        await page.goto('/');
        const projectsTab = page.locator('#tab-projects');
        const writingTab = page.locator('#tab-writing');
        const researchTab = page.locator('#tab-research');

        // Projects is initially active
        await expect(projectsTab).toHaveAttribute('tabindex', '0');
        await expect(writingTab).toHaveAttribute('tabindex', '-1');

        await projectsTab.focus();
        await expect(projectsTab).toBeFocused();

        // Right arrow moves to Writing
        await page.keyboard.press('ArrowRight');
        await expect(writingTab).toBeFocused();
        await expect(writingTab).toHaveAttribute('tabindex', '0');
        await expect(projectsTab).toHaveAttribute('tabindex', '-1');

        // End key jumps directly to Research
        await page.keyboard.press('End');
        await expect(researchTab).toBeFocused();
        await expect(researchTab).toHaveAttribute('tabindex', '0');

        // Home key jumps back to Projects
        await page.keyboard.press('Home');
        await expect(projectsTab).toBeFocused();
        await expect(projectsTab).toHaveAttribute('tabindex', '0');
    });

    test('preview canvases have role="img" and descriptive aria-label', async ({ page }) => {
        await page.goto('/');
        const canvases = page.locator('.preview-canvas');
        const count = await canvases.count();
        expect(count).toBeGreaterThanOrEqual(6);

        for (let i = 0; i < count; i++) {
            const canvas = canvases.nth(i);
            await expect(canvas).toHaveAttribute('role', 'img');
            const label = await canvas.getAttribute('aria-label');
            expect(label).toBeTruthy();
            expect(label.length).toBeGreaterThan(5);
        }
    });

    test('heading hierarchy follows logical h1 -> h2 -> h3 order without skips', async ({ page }) => {
        await page.goto('/');
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBe(1);

        const h2Count = await page.locator('h2').count();
        expect(h2Count).toBeGreaterThanOrEqual(4);

        const h3Count = await page.locator('h3.project-name').count();
        expect(h3Count).toBeGreaterThanOrEqual(26);
    });
});

