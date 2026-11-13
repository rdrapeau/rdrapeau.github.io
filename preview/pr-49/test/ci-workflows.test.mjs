import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT_DIR } from './helpers.mjs';

describe('CI/CD & GitHub Actions Workflows Integrity', () => {
    const workflowsDir = path.resolve(ROOT_DIR, '.github', 'workflows');
    const staticPath = path.resolve(workflowsDir, 'static.yml');
    const previewPath = path.resolve(workflowsDir, 'preview.yml');
    const testPath = path.resolve(workflowsDir, 'test.yml');

    it('all expected workflow files exist in .github/workflows', () => {
        assert.ok(fs.existsSync(staticPath), 'static.yml must exist');
        assert.ok(fs.existsSync(previewPath), 'preview.yml must exist');
        assert.ok(fs.existsSync(testPath), 'test.yml must exist');
    });

    it('enforces serialized gh-pages deployment concurrency between master and PR previews', () => {
        const staticContent = fs.readFileSync(staticPath, 'utf8');
        const previewContent = fs.readFileSync(previewPath, 'utf8');

        // Verify static.yml concurrency
        assert.match(
            staticContent,
            /group:\s*["']?gh-pages-write["']?/,
            'static.yml must use gh-pages-write concurrency group'
        );
        assert.match(
            staticContent,
            /cancel-in-progress:\s*false/,
            'static.yml must not cancel in-progress master deploys'
        );

        // Verify preview.yml job-level concurrency
        assert.match(
            previewContent,
            /group:\s*["']?gh-pages-write["']?/,
            'preview.yml deploy-preview job must use gh-pages-write concurrency group'
        );
        assert.match(
            previewContent,
            /cancel-in-progress:\s*false/,
            'preview.yml deploy-preview job must serialize gh-pages updates'
        );
    });

    it('pins modern actions/setup-node with Node 24 runtime support', () => {
        const workflowFiles = [staticPath, previewPath, testPath];
        for (const filePath of workflowFiles) {
            const content = fs.readFileSync(filePath, 'utf8');
            assert.doesNotMatch(
                content,
                /actions\/setup-node@v4/,
                `${path.basename(filePath)} must not use deprecated actions/setup-node@v4`
            );
            assert.match(
                content,
                /actions\/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1\s*#\s*v7\.1\.0/,
                `${path.basename(filePath)} must pin actions/setup-node to v7.1.0 sha`
            );
        }
    });

    it('pins modern peaceiris/actions-gh-pages to v4.1.0 in static.yml', () => {
        const staticContent = fs.readFileSync(staticPath, 'utf8');
        assert.match(
            staticContent,
            /peaceiris\/actions-gh-pages@84c30a85c19949d7eee79c4ff27748b70285e453\s*#\s*v4\.1\.0/,
            'static.yml must pin peaceiris/actions-gh-pages to v4.1.0 sha'
        );
    });
});
