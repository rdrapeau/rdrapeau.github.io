import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getIndexHtml, getAllAttributes, ROOT_DIR } from './helpers.mjs';

describe('Repository Rule #2: Path & Asset Relativity', () => {
    const html = getIndexHtml();

    it('all internal image and asset src attributes must start with ./', () => {
        const srcAttributes = getAllAttributes(html, 'src');
        const violations = [];

        for (const { value, tag } of srcAttributes) {
            // External URLs (http/https/data:) are allowed
            if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
                continue;
            }

            if (!value.startsWith('./')) {
                violations.push({ value, tag });
            }
        }

        assert.deepEqual(
            violations,
            [],
            `Found internal src attributes not starting with "./":\n${JSON.stringify(violations, null, 2)}`
        );
    });

    it('all internal href attributes for local assets and subprojects must start with ./ or #', () => {
        const hrefAttributes = getAllAttributes(html, 'href');
        const violations = [];

        for (const { value, tag } of hrefAttributes) {
            // External URLs, mailto, tel, or fragment hashes
            if (
                value.startsWith('http://') ||
                value.startsWith('https://') ||
                value.startsWith('mailto:') ||
                value.startsWith('tel:') ||
                value.startsWith('#')
            ) {
                continue;
            }

            if (!value.startsWith('./')) {
                violations.push({ value, tag });
            }
        }

        assert.deepEqual(
            violations,
            [],
            `Found internal href attributes not starting with "./" or "#":\n${JSON.stringify(violations, null, 2)}`
        );
    });

    it('every local src file referenced in index.html must exist on disk', () => {
        const srcAttributes = getAllAttributes(html, 'src');
        const missing = [];

        for (const { value } of srcAttributes) {
            if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
                continue;
            }

            // Strip query strings or hashes
            const cleanPath = value.replace(/^\.\//, '').split('?')[0].split('#')[0];
            const localFile = path.join(ROOT_DIR, cleanPath);

            if (!fs.existsSync(localFile)) {
                missing.push({ referenced: value, resolved: localFile });
            }
        }

        assert.deepEqual(
            missing,
            [],
            `Missing local files referenced via src:\n${JSON.stringify(missing, null, 2)}`
        );
    });

    it('every local href asset or subproject referenced in index.html must exist on disk', () => {
        const hrefAttributes = getAllAttributes(html, 'href');
        const missing = [];

        for (const { value } of hrefAttributes) {
            if (
                value.startsWith('http://') ||
                value.startsWith('https://') ||
                value.startsWith('mailto:') ||
                value.startsWith('tel:') ||
                value.startsWith('#')
            ) {
                continue;
            }

            // Strip query strings or hashes
            const cleanPath = value.replace(/^\.\//, '').split('?')[0].split('#')[0];
            const localPath = path.join(ROOT_DIR, cleanPath);

            if (!fs.existsSync(localPath)) {
                missing.push({ referenced: value, resolved: localPath });
            }
        }

        assert.deepEqual(
            missing,
            [],
            `Missing local assets or subprojects referenced via href:\n${JSON.stringify(missing, null, 2)}`
        );
    });

    it('all fetch() requests in index.html scripts must use relative ./ paths', () => {
        const fetchRegex = /fetch\(\s*[`'"]([^`'"]+)[`'"]\s*\)/g;
        const violations = [];
        let match;

        while ((match = fetchRegex.exec(html)) !== null) {
            const url = match[1];
            if (url.startsWith('http://') || url.startsWith('https://')) {
                continue;
            }
            if (!url.startsWith('./')) {
                violations.push(url);
            }
        }

        assert.deepEqual(
            violations,
            [],
            `Found fetch() calls with non-relative paths:\n${JSON.stringify(violations, null, 2)}`
        );
    });
});
