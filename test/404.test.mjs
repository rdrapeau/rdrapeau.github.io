import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getAllAttributes, ROOT_DIR } from './helpers.mjs';

describe('Custom 404 Page Integrity (404.html)', () => {
    const file404Path = path.join(ROOT_DIR, '404.html');

    it('404.html must exist in repository root', () => {
        assert.ok(fs.existsSync(file404Path), 'Expected 404.html to exist in root directory');
    });

    const html = fs.readFileSync(file404Path, 'utf-8');

    it('declares semantic doctype, lang, and page title', () => {
        assert.ok(html.includes('<!DOCTYPE html>'), 'Missing HTML5 DOCTYPE');
        assert.ok(html.includes('<html lang="en">'), 'Missing lang="en"');
        assert.ok(html.includes('<title>404 — Page Not Found · Ryan Drapeau</title>'), 'Missing or incorrect title');
    });

    it('contains strict security and privacy meta tags', () => {
        assert.ok(html.includes('name="robots" content="noindex, nofollow'), 'Missing noindex/nofollow robots meta tag');
        assert.ok(html.includes('name="referrer" content="strict-origin-when-cross-origin"'), 'Missing strict-origin-when-cross-origin referrer');
        assert.ok(html.includes('http-equiv="Content-Security-Policy"'), 'Missing Content-Security-Policy header');
        assert.ok(html.includes("base-uri 'self'"), 'CSP missing base-uri self');
    });

    it('all internal src and href attributes must start with ./ or #', () => {
        const srcAttributes = getAllAttributes(html, 'src');
        for (const { value, tag } of srcAttributes) {
            if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) continue;
            assert.ok(value.startsWith('./'), `Non-relative src in 404.html: ${value} in <${tag}>`);
        }

        const hrefAttributes = getAllAttributes(html, 'href');
        for (const { value, tag } of hrefAttributes) {
            if (
                value.startsWith('http://') ||
                value.startsWith('https://') ||
                value.startsWith('mailto:') ||
                value.startsWith('#')
            ) continue;
            assert.ok(value.startsWith('./'), `Non-relative href in 404.html: ${value} in <${tag}>`);
        }
    });

    it('every local file referenced in 404.html must exist on disk', () => {
        const allRefs = [
            ...getAllAttributes(html, 'src'),
            ...getAllAttributes(html, 'href')
        ];

        for (const { value } of allRefs) {
            if (
                value.startsWith('http://') ||
                value.startsWith('https://') ||
                value.startsWith('mailto:') ||
                value.startsWith('#') ||
                value.startsWith('data:')
            ) continue;

            const cleanPath = value.replace(/^\.\//, '').split('?')[0].split('#')[0];
            if (!cleanPath) continue; // href="./" points to root directory itself
            const localPath = path.join(ROOT_DIR, cleanPath);
            assert.ok(fs.existsSync(localPath), `File referenced in 404.html does not exist: ${value} -> ${localPath}`);
        }
    });

    it('contains accessible semantic landmarks and elements', () => {
        assert.ok(html.includes('<main class="container" id="main-content">'), 'Missing main landmark with id="main-content"');
        assert.ok(html.includes('<h1>Page Not Found</h1>'), 'Missing h1 heading');
        assert.ok(html.includes('alt="Ryan Drapeau"'), 'Headshot img missing alt attribute');
        assert.ok(html.includes('class="btn-home"'), 'Missing primary return button');
        assert.ok(html.includes('aria-label="Quick links"'), 'Missing aria-label on quick links nav');
    });

    it('preloads and self-hosts Inter and JetBrains Mono fonts', () => {
        assert.ok(html.includes('./assets/fonts/inter-latin.woff2'), 'Missing Inter font reference');
        assert.ok(html.includes('./assets/fonts/jetbrains-mono-latin.woff2'), 'Missing JetBrains Mono font reference');
        assert.ok(html.includes('rel="preload"'), 'Missing font preload link');
    });

    it('declares adaptive light and dark color scheme', () => {
        assert.ok(html.includes('color-scheme: light dark;'), 'Missing color-scheme declaration');
        assert.ok(html.includes('prefers-color-scheme: dark'), 'Missing dark mode media query');
        assert.ok(html.includes('media="(prefers-color-scheme: dark)" content="#0f1117"'), 'Missing dark theme-color meta tag');
    });
});
