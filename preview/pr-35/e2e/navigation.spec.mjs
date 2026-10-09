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
        await expect(projectsSection).toHaveClass(/\bactive-panel\b/);
    });

    test('switches tabs smoothly when clicked and updates URL hash', async ({ page }) => {
        // Switch to Writing tab
        await page.click('#tab-writing');
        await expect(page.locator('#tab-writing')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-writing')).toBeVisible();
        await expect(page.locator('#section-writing')).toHaveClass(/\bactive-panel\b/);
        await expect(page.locator('#section-projects')).toBeHidden();
        expect(page.url()).toContain('#writing');

        // Switch to Patents tab
        await page.click('#tab-patents');
        await expect(page.locator('#tab-patents')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-patents')).toBeVisible();
        await expect(page.locator('#section-patents')).toHaveClass(/\bactive-panel\b/);
        await expect(page.locator('#section-writing')).toBeHidden();
        expect(page.url()).toContain('#patents');

        // Switch to Research tab
        await page.click('#tab-research');
        await expect(page.locator('#tab-research')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-research')).toBeVisible();
        await expect(page.locator('#section-research')).toHaveClass(/\bactive-panel\b/);
        await expect(page.locator('#section-patents')).toBeHidden();
        expect(page.url()).toContain('#research');

        // Switch back to Projects tab
        await page.click('#tab-projects');
        await expect(page.locator('#tab-projects')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-projects')).toBeVisible();
        await expect(page.locator('#section-projects')).toHaveClass(/\bactive-panel\b/);
        await expect(page.locator('#section-research')).toBeHidden();
        expect(page.url()).toContain('#projects');
    });

    test('activates correct tab when loaded directly with URL hash', async ({ page }) => {
        await page.goto('/#patents');
        await expect(page.locator('#tab-patents')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-patents')).toBeVisible();
        await expect(page.locator('#section-projects')).toBeHidden();
    });

    test('reacts to direct URL hash navigation', async ({ page }) => {
        await page.goto('/#writing');
        await expect(page.locator('#section-writing')).toBeVisible();
        await expect(page.locator('#tab-writing')).toHaveClass(/\bactive\b/);

        await page.goto('/#patents');
        await expect(page.locator('#section-patents')).toBeVisible();
        await expect(page.locator('#tab-patents')).toHaveClass(/\bactive\b/);

        await page.goto('/#research');
        await expect(page.locator('#section-research')).toBeVisible();
        await expect(page.locator('#tab-research')).toHaveClass(/\bactive\b/);

        await page.goto('/#projects');
        await expect(page.locator('#section-projects')).toBeVisible();
        await expect(page.locator('#tab-projects')).toHaveClass(/\bactive\b/);
    });

    test('supports keyboard numeric shortcuts (1, 2, 3, 4)', async ({ page }) => {
        // Focus page heading to ensure window receives keyboard events without colliding with link targets
        await page.locator('h1').click();

        // Press 2 -> Writing
        await page.keyboard.press('2');
        await expect(page.locator('#section-writing')).toBeVisible();
        await expect(page.locator('#tab-writing')).toHaveClass(/\bactive\b/);

        // Press 3 -> Patents
        await page.keyboard.press('3');
        await expect(page.locator('#section-patents')).toBeVisible();
        await expect(page.locator('#tab-patents')).toHaveClass(/\bactive\b/);

        // Press 4 -> Research
        await page.keyboard.press('4');
        await expect(page.locator('#section-research')).toBeVisible();
        await expect(page.locator('#tab-research')).toHaveClass(/\bactive\b/);

        // Press 1 -> Projects
        await page.keyboard.press('1');
        await expect(page.locator('#section-projects')).toBeVisible();
        await expect(page.locator('#tab-projects')).toHaveClass(/\bactive\b/);
    });

    test('supports arrow key navigation across tabs in order (Projects -> Writing -> Patents -> Research)', async ({ page }) => {
        await page.locator('#tab-projects').focus();

        // Right arrow -> Writing
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('#tab-writing')).toBeFocused();
        await expect(page.locator('#section-writing')).toBeVisible();

        // Right arrow -> Patents
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('#tab-patents')).toBeFocused();
        await expect(page.locator('#section-patents')).toBeVisible();

        // Right arrow -> Research
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('#tab-research')).toBeFocused();
        await expect(page.locator('#section-research')).toBeVisible();

        // Left arrow -> Patents
        await page.keyboard.press('ArrowLeft');
        await expect(page.locator('#tab-patents')).toBeFocused();
        await expect(page.locator('#section-patents')).toBeVisible();
    });

    test('serves valid Schema.org JSON-LD microdata in head', async ({ page }) => {
        const jsonLdContent = await page.locator('script[type="application/ld+json"]').textContent();
        expect(jsonLdContent).not.toBeNull();

        const data = JSON.parse(jsonLdContent);
        expect(data['@context']).toBe('https://schema.org');
        expect(Array.isArray(data['@graph'])).toBe(true);

        const person = data['@graph'].find(item => item['@type'] === 'Person');
        expect(person).toBeDefined();
        expect(person.name).toBe('Ryan Drapeau');
        expect(person.jobTitle).toBe('Principal Machine Learning Engineer');
        expect(person.worksFor.name).toBe('Stripe');
    });

    test('supports find-in-page beforematch event to activate hidden tab panels', async ({ page }) => {
        // Initially on projects tab
        await expect(page.locator('#tab-projects')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#section-patents')).toHaveAttribute('hidden', 'until-found');

        // Simulate browser Find-in-page beforematch event targeting an element inside patents section
        await page.evaluate(() => {
            const patentSection = document.getElementById('section-patents');
            patentSection.dispatchEvent(new Event('beforematch', { bubbles: true }));
        });

        // Tab and panel states should be automatically synchronized
        await expect(page.locator('#tab-patents')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#tab-patents')).toHaveAttribute('aria-selected', 'true');
        await expect(page.locator('#section-patents')).toBeVisible();
        await expect(page.locator('#section-patents')).toHaveClass(/\bactive-panel\b/);
        await expect(page.locator('#section-projects')).toHaveAttribute('hidden', 'until-found');
        expect(page.url()).toContain('#patents');
    });

    test('includes Speculation Rules API script, manifest, and modern head attributes', async ({ page }) => {
        // Speculation Rules
        const specRulesScript = page.locator('script[type="speculationrules"]');
        await expect(specRulesScript).toBeAttached();
        const specContent = await specRulesScript.textContent();
        const specJson = JSON.parse(specContent);
        expect(specJson.prefetch).toBeDefined();
        expect(specJson.prefetch[0].eagerness).toBe('moderate');

        // Web Manifest
        const manifestLink = page.locator('link[rel="manifest"]');
        await expect(manifestLink).toHaveAttribute('href', './manifest.webmanifest');

        // Headshot fetchpriority="high"
        const headshot = page.locator('img.headshot');
        await expect(headshot).toHaveAttribute('fetchpriority', 'high');

        // Dual theme-color meta tags
        const lightTheme = page.locator('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
        const darkTheme = page.locator('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
        await expect(lightTheme).toHaveAttribute('content', '#fafafa');
        await expect(darkTheme).toHaveAttribute('content', '#0f1117');
    });
});

