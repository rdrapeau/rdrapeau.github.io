import { test, expect } from '@playwright/test';

test.describe('1-Click BibTeX Citation Modal', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/#research');
        // Ensure Research tab is active
        await expect(page.locator('#section-research')).toBeVisible();
    });

    test('renders BibTeX cite buttons on all 5 research publication cards', async ({ page }) => {
        const cards = page.locator('#section-research .research-card');
        await expect(cards).toHaveCount(5);

        const bibtexBtns = page.locator('#section-research .bibtex-btn');
        await expect(bibtexBtns).toHaveCount(5);

        for (let i = 0; i < 5; i++) {
            const btn = bibtexBtns.nth(i);
            await expect(btn).toBeVisible();
            await expect(btn).toHaveAttribute('aria-haspopup', 'dialog');
            await expect(btn).toHaveAttribute('aria-label', /BibTeX citation for/);
        }
    });

    test('opens dialog modal populated with Microtalk BibTeX citation and auto-focuses copy button', async ({ page }) => {
        const dialog = page.locator('#bibtex-dialog');
        await expect(dialog).toBeHidden();

        // Click BibTeX button on Microtalk card
        await page.click('.bibtex-btn[data-paper="microtalk"]');

        await expect(dialog).toBeVisible();
        await expect(page.locator('#bibtex-dialog-title')).toHaveText('Citation Entry');
        await expect(page.locator('#bibtex-paper-title')).toHaveText('Microtalk: Argumentation in Crowdsourcing');

        const codeContent = await page.locator('#bibtex-code-text').textContent();
        expect(codeContent).toContain('@inproceedings{drapeau2016microtalk');
        expect(codeContent).toContain('author={Drapeau, Ryan and Chilton, Lydia B. and Bragg, Jonathan and Weld, Daniel S.}');
        expect(codeContent).toContain('booktitle={Proceedings of the Fourth AAAI Conference on Human Computation and Crowdsourcing (HCOMP \'16)}');

        const scholarLink = page.locator('#bibtex-scholar-link');
        await expect(scholarLink).toHaveAttribute('href', /scholar\.google\.com/);

        // Active element should be the copy button for rapid 1-click keyboard workflow
        await expect(page.locator('#bibtex-copy-btn')).toBeFocused();
    });

    test('copies BibTeX citation to clipboard and displays feedback state', async ({ page, context }) => {
        // Grant clipboard permissions
        await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});

        await page.click('.bibtex-btn[data-paper="tactile_graphics"]');
        const dialog = page.locator('#bibtex-dialog');
        await expect(dialog).toBeVisible();

        const copyBtn = page.locator('#bibtex-copy-btn');
        await expect(copyBtn).toHaveText('Copy BibTeX');

        await copyBtn.click();
        await expect(copyBtn).toHaveClass(/\bcopied\b/);
        await expect(page.locator('#bibtex-copy-text')).toHaveText('Copied! ✓');
    });

    test('closes dialog via close button and restores focus to triggering element', async ({ page }) => {
        const triggerBtn = page.locator('.bibtex-btn[data-paper="multiple_guesses"]');
        await triggerBtn.click();

        const dialog = page.locator('#bibtex-dialog');
        await expect(dialog).toBeVisible();

        await page.click('#bibtex-close-btn');
        await expect(dialog).toBeHidden();
        await expect(triggerBtn).toBeFocused();
    });

    test('closes dialog on Escape key and restores focus', async ({ page }) => {
        const triggerBtn = page.locator('.bibtex-btn[data-paper="kimbee"]');
        await triggerBtn.scrollIntoViewIfNeeded();
        await triggerBtn.click();

        const dialog = page.locator('#bibtex-dialog');
        await expect(dialog).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(triggerBtn).toBeFocused();
    });

    test('closes dialog when clicking on backdrop', async ({ page }) => {
        await page.click('.bibtex-btn[data-paper="microtalk"]');
        const dialog = page.locator('#bibtex-dialog');
        await expect(dialog).toBeVisible();

        // Click outside the dialog content box (top left of dialog overlay)
        await page.mouse.click(10, 10);
        await expect(dialog).toBeHidden();
    });

    test('switches dynamically between different papers in subsequent modal opens', async ({ page }) => {
        const dialog = page.locator('#bibtex-dialog');

        // Open paper 1
        await page.click('.bibtex-btn[data-paper="kimbee"]');
        await expect(dialog).toBeVisible();
        await expect(page.locator('#bibtex-paper-title')).toHaveText('KIMBEE: Speech Therapy for Children');
        await expect(page.locator('#bibtex-code-text')).toContainText('@techreport{drapeau2015kimbee');
        await page.click('#bibtex-close-btn');
        await expect(dialog).toBeHidden();

        // Open paper 2
        await page.click('.bibtex-btn[data-paper="commute"]');
        await expect(dialog).toBeVisible();
        await expect(page.locator('#bibtex-paper-title')).toHaveText('Contributing During the Commute');
        await expect(page.locator('#bibtex-code-text')).toContainText('@techreport{bonnar2015contributing');
        await page.click('#bibtex-close-btn');
        await expect(dialog).toBeHidden();
    });
});
