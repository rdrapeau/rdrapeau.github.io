import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getIndexHtml, getSubprojects, ROOT_DIR } from './helpers.mjs';

describe('Repository Rule #3: Subproject Additions & Updates', () => {
    const subprojects = getSubprojects();
    const html = getIndexHtml();

    it('identifies valid subproject directories in repository root', () => {
        assert.ok(subprojects.length >= 6, `Expected at least 6 subprojects, found ${subprojects.length}`);
    });

    for (const subproject of subprojects) {
        describe(`Subproject: ${subproject}`, () => {
            const subprojectDir = path.join(ROOT_DIR, subproject);

            it(`contains an index.html entry file`, () => {
                const indexPath = path.join(subprojectDir, 'index.html');
                assert.ok(
                    fs.existsSync(indexPath),
                    `Expected index.html to exist in ${subproject}`
                );
                const stat = fs.statSync(indexPath);
                assert.ok(stat.size > 0, `index.html in ${subproject} must not be empty`);
            });

            it(`contains a build-info.json metadata file`, () => {
                const buildInfoPath = path.join(subprojectDir, 'build-info.json');
                assert.ok(
                    fs.existsSync(buildInfoPath),
                    `Expected build-info.json to exist in ${subproject}`
                );

                const content = fs.readFileSync(buildInfoPath, 'utf-8');
                let data;
                assert.doesNotThrow(() => {
                    data = JSON.parse(content);
                }, `build-info.json in ${subproject} must be valid JSON`);

                assert.ok(data.timestamp, `build-info.json in ${subproject} must have 'timestamp'`);
                assert.ok(data.buildDate, `build-info.json in ${subproject} must have 'buildDate'`);

                const parsedDate = new Date(data.timestamp);
                assert.ok(
                    !isNaN(parsedDate.getTime()),
                    `build-info.json 'timestamp' in ${subproject} must be a valid date: ${data.timestamp}`
                );
            });

            it(`is referenced in the main index.html projects array or links`, () => {
                const expectedHref = `./${subproject}/`;
                assert.ok(
                    html.includes(expectedHref),
                    `Expected main index.html to reference ${expectedHref}`
                );
            });
        });
    }
});
