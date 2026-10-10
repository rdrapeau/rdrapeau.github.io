import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getIndexHtml, getElementsByClass, getElementTextById, getTabBadgeCount, getSectionHtml, ROOT_DIR } from './helpers.mjs';

describe('Document & HTML Structure Integrity', () => {
    const html = getIndexHtml();

    describe('Standard Head & Meta Elements', () => {
        it('has valid HTML5 doctype', () => {
            assert.match(html, /^<!DOCTYPE html>/i, 'Document must start with <!DOCTYPE html>');
        });

        it('has html tag with lang="en"', () => {
            assert.match(html, /<html\s+lang=["']en["']/i, 'Document must define <html lang="en">');
        });

        it('has charset UTF-8 declaration', () => {
            assert.match(html, /<meta\s+charset=["']UTF-8["']/i, 'Document must have charset UTF-8');
        });

        it('has responsive viewport meta tag', () => {
            assert.match(
                html,
                /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i,
                'Document must have mobile viewport meta tag'
            );
        });

        it('has informative title containing Ryan Drapeau', () => {
            const titleMatch = /<title>(.*?)<\/title>/i.exec(html);
            assert.ok(titleMatch, 'Document must have a <title> tag');
            assert.match(titleMatch[1], /Ryan Drapeau/i, 'Title must contain Ryan Drapeau');
        });

        it('has Open Graph social sharing meta tags with 1200x630 preview card', () => {
            assert.match(html, /<meta\s+property=["']og:title["']/i, 'Missing og:title');
            assert.match(html, /<meta\s+property=["']og:description["']/i, 'Missing og:description');
            assert.match(html, /<meta\s+property=["']og:type["']/i, 'Missing og:type');
            assert.match(html, /<meta\s+property=["']og:image["']\s+content=["']https:\/\/drapeau\.dev\/og-image\.png["']/i, 'Missing og:image pointing to og-image.png');
            assert.match(html, /<meta\s+property=["']og:image:width["']\s+content=["']1200["']/i, 'Missing og:image:width of 1200');
            assert.match(html, /<meta\s+property=["']og:image:height["']\s+content=["']630["']/i, 'Missing og:image:height of 630');
            assert.match(html, /<meta\s+property=["']og:image:alt["']/i, 'Missing og:image:alt description');

            // Twitter card configuration
            assert.match(html, /<meta\s+name=["']twitter:card["']\s+content=["']summary_large_image["']/i, 'Missing twitter:card summary_large_image');
            assert.match(html, /<meta\s+name=["']twitter:image["']\s+content=["']https:\/\/drapeau\.dev\/og-image\.png["']/i, 'Missing twitter:image pointing to og-image.png');

            // Ensure og-image.png exists on disk
            const ogImageOnDisk = path.join(ROOT_DIR, 'og-image.png');
            assert.ok(fs.existsSync(ogImageOnDisk), 'og-image.png must exist in repository root');
            const stats = fs.statSync(ogImageOnDisk);
            assert.ok(stats.size > 50000, 'og-image.png should be a valid high-resolution image file (> 50KB)');
        });

        it('has valid Schema.org JSON-LD structured data with Person, Articles, and Patents', () => {
            const jsonLdMatch = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i.exec(html);
            assert.ok(jsonLdMatch, 'Document must have <script type="application/ld+json"> tag');

            let parsed;
            assert.doesNotThrow(() => {
                parsed = JSON.parse(jsonLdMatch[1]);
            }, 'Schema.org JSON-LD must be valid JSON');

            assert.equal(parsed['@context'], 'https://schema.org');
            assert.ok(Array.isArray(parsed['@graph']), '@graph must be an array');

            const person = parsed['@graph'].find(item => item['@type'] === 'Person');
            assert.ok(person, 'Must contain a Person entity in @graph');
            assert.equal(person.name, 'Ryan Drapeau');
            assert.equal(person.worksFor.name, 'Stripe');
            assert.equal(person.alumniOf.name, 'University of Washington');
            assert.ok(person.sameAs.length >= 3, 'Must contain social and scholar links');

            const publications = parsed['@graph'].find(item => item['@id'] === 'https://drapeau.dev/#publications');
            assert.ok(publications, 'Must contain publications collection');
            assert.equal(publications.itemListElement.length, 5, 'Must contain 5 research publications');

            const patents = parsed['@graph'].find(item => item['@id'] === 'https://drapeau.dev/#patents');
            assert.ok(patents, 'Must contain patents collection');
            assert.equal(patents.itemListElement.length, 10, 'Must contain 10 patents');
        });
    });

    describe('Tabs & Badge Count Synchronization', () => {
        const expectedTabs = [
            { id: 'projects', sectionId: 'section-projects', buttonId: 'tab-projects', itemClass: 'project' },
            { id: 'writing', sectionId: 'section-writing', buttonId: 'tab-writing', itemClass: 'writing-card' },
            { id: 'patents', sectionId: 'section-patents', buttonId: 'tab-patents', itemClass: 'patent-card' },
            { id: 'research', sectionId: 'section-research', buttonId: 'tab-research', itemClass: 'research-card' }
        ];

        it('tab buttons are ordered: Projects, Writing, Patents, Research', () => {
            const buttonOrderRegex = /id=["']tab-projects["'][\s\S]*?id=["']tab-writing["'][\s\S]*?id=["']tab-patents["'][\s\S]*?id=["']tab-research["']/;
            assert.ok(buttonOrderRegex.test(html), 'Expected tab buttons in order: Projects, Writing, Patents, Research');
        });

        it('tab sections are ordered: Projects, Writing, Patents, Research', () => {
            const sectionOrderRegex = /id=["']section-projects["'][\s\S]*?id=["']section-writing["'][\s\S]*?id=["']section-patents["'][\s\S]*?id=["']section-research["']/;
            assert.ok(sectionOrderRegex.test(html), 'Expected tab sections in order: Projects, Writing, Patents, Research');
        });

        for (const tab of expectedTabs) {
            it(`tab "${tab.id}" section and button exist with valid ARIA roles`, () => {
                assert.ok(html.includes(`id="${tab.sectionId}"`), `Section ${tab.sectionId} must exist`);
                assert.ok(html.includes(`id="${tab.buttonId}"`), `Button ${tab.buttonId} must exist`);
                assert.ok(html.includes(`data-tab="${tab.id}"`), `Tab trigger data-tab="${tab.id}" must exist`);
            });

            it(`tab "${tab.id}" badge count matches the DOM card count`, () => {
                const expectedCount = getTabBadgeCount(html, tab.id);
                assert.ok(expectedCount !== null, `Tab badge for ${tab.id} must exist`);
                assert.ok(!isNaN(expectedCount), `Badge count for ${tab.id} must be a number`);

                const sectionContent = getSectionHtml(html, tab.sectionId);
                const items = getElementsByClass(sectionContent, tab.itemClass);
                assert.equal(
                    items.length,
                    expectedCount,
                    `Tab ${tab.id} badge count (${expectedCount}) does not match rendered .${tab.itemClass} elements (${items.length})`
                );
            });
        }

        it('initial projects section has active-panel class for View Transitions API', () => {
            assert.match(
                html,
                /<section[^>]*?id=["']section-projects["'][^>]*?class=["'][^"']*?\bactive-panel\b/i,
                'Initial section-projects must have active-panel class'
            );
        });

        it('includes View Transitions API CSS declarations with reduced-motion fallback', () => {
            assert.match(html, /view-transition-name:\s*active-tab-panel;/i, 'Missing view-transition-name: active-tab-panel');
            assert.match(html, /::view-transition-group\(active-tab-panel\)/i, 'Missing ::view-transition-group');
            assert.match(html, /::view-transition-old\(active-tab-panel\)/i, 'Missing ::view-transition-old');
            assert.match(html, /::view-transition-new\(active-tab-panel\)/i, 'Missing ::view-transition-new');
            assert.match(
                html,
                /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?view-transition-name:\s*none\s*!important/i,
                'Must disable view-transition-name under prefers-reduced-motion'
            );
        });

        it('JavaScript checks document.startViewTransition for progressive enhancement', () => {
            assert.match(html, /document\.startViewTransition/i, 'Must check document.startViewTransition in switchTab');
        });
    });

    describe('Projects Filter Synchronization', () => {
        const projects = getElementsByClass(getSectionHtml(html, 'section-projects'), 'project');

        it('total project count is 7', () => {
            assert.equal(projects.length, 7, 'Expected exactly 7 projects');
        });

        it('count-all badge matches total projects count', () => {
            const countAll = parseInt(getElementTextById(html, 'count-all'), 10);
            assert.equal(countAll, projects.length, 'Filter #count-all must match total project cards');
        });

        it('count-live badge matches data-status="live" count', () => {
            const sectionHtml = getSectionHtml(html, 'section-projects');
            const liveMatches = (sectionHtml.match(/data-status=["']live["']/g) || []).length;
            const countLive = parseInt(getElementTextById(html, 'count-live'), 10);
            assert.equal(countLive, liveMatches, 'Filter #count-live must match elements with data-status="live"');
        });

        it('count-in-dev badge matches data-status="in-dev" count', () => {
            const sectionHtml = getSectionHtml(html, 'section-projects');
            const inDevMatches = (sectionHtml.match(/data-status=["']in-dev["']/g) || []).length;
            const countInDev = parseInt(getElementTextById(html, 'count-in-dev'), 10);
            assert.equal(countInDev, inDevMatches, 'Filter #count-in-dev must match elements with data-status="in-dev"');
        });

        it('all projects must have either data-status="live" or data-status="in-dev"', () => {
            const sectionHtml = getSectionHtml(html, 'section-projects');
            const liveMatches = (sectionHtml.match(/data-status=["']live["']/g) || []).length;
            const inDevMatches = (sectionHtml.match(/data-status=["']in-dev["']/g) || []).length;
            assert.equal(liveMatches + inDevMatches, projects.length, 'Every project must specify a data-status');
        });
    });

    describe('Project Cards Aesthetics & Content', () => {
        const projectsSection = getSectionHtml(html, 'section-projects');

        it('has zero technology tags (.project-tags, .tech-tag) in project cards', () => {
            const projectTags = getElementsByClass(html, 'project-tags').length;
            const techTags = getElementsByClass(html, 'tech-tag').length;
            assert.equal(projectTags, 0, 'Expected 0 .project-tags elements in HTML');
            assert.equal(techTags, 0, 'Expected 0 .tech-tag elements in HTML');
        });

        it('every project card contains title, description, and date indicator', () => {
            const descriptions = getElementsByClass(projectsSection, 'project-description');
            const dates = getElementsByClass(projectsSection, 'project-date');
            const projects = getElementsByClass(projectsSection, 'project');

            assert.equal(descriptions.length, projects.length, 'Each project must have a description');
            assert.equal(dates.length, projects.length, 'Each project must have a date indicator');
        });

        it('interactive project previews contain matching canvas elements', () => {
            const previews = getElementsByClass(projectsSection, 'project-preview');
            const canvases = getElementsByClass(projectsSection, 'preview-canvas');

            assert.ok(previews.length > 0, 'Expected project previews');
            assert.equal(
                canvases.length,
                previews.length,
                'Every .project-preview must contain a .preview-canvas element'
            );
        });
    });

    describe('Accessibility & Security Standards', () => {
        it('all links opening in new windows have rel="noopener noreferrer"', () => {
            const targetBlankRegex = /<a\s+[^>]*?target=["']_blank["'][^>]*>/gi;
            const violations = [];
            let match;

            while ((match = targetBlankRegex.exec(html)) !== null) {
                const tag = match[0];
                if (!tag.includes('rel="noopener noreferrer"') && !tag.includes("rel='noopener noreferrer'")) {
                    violations.push(tag);
                }
            }

            assert.deepEqual(
                violations,
                [],
                `Links with target="_blank" must include rel="noopener noreferrer":\n${JSON.stringify(violations, null, 2)}`
            );
        });

        it('all img tags have alt attributes', () => {
            const imgRegex = /<img\s+[^>]*>/gi;
            const violations = [];
            let match;

            while ((match = imgRegex.exec(html)) !== null) {
                const tag = match[0];
                if (!tag.includes('alt=')) {
                    violations.push(tag);
                }
            }

            assert.deepEqual(violations, [], `Images missing alt attribute:\n${JSON.stringify(violations, null, 2)}`);
        });

        it('includes prefers-reduced-motion media query in CSS', () => {
            assert.match(
                html,
                /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i,
                'CSS must contain prefers-reduced-motion media query'
            );
        });

        it('includes a skip-to-content link pointing to #main-content', () => {
            assert.match(
                html,
                /<a\s+[^>]*?href=["']#main-content["'][^>]*?class=["'][^"']*skip-link[^"']*["'][^>]*>Skip to main content<\/a>/i,
                'Must include an accessible skip link targeting #main-content'
            );
        });

        it('wraps main portfolio sections in semantic <main id="main-content"> landmark', () => {
            assert.match(
                html,
                /<main\s+id=["']main-content["']>/i,
                'Must include semantic <main id="main-content"> landmark'
            );
            assert.match(
                html,
                /<\/main>/i,
                'Must properly close </main> landmark'
            );
        });

        it('wraps site tabs in semantic <nav> landmark with aria-label', () => {
            assert.match(
                html,
                /<nav\s+class=["'][^"']*site-tabs-nav[^"']*["']\s+aria-label=["'][^"']+["']>/i,
                'Must include semantic <nav> landmark with aria-label for tabs navigation'
            );
        });

        it('all interactive preview canvases have role="img" and descriptive aria-label', () => {
            const canvasRegex = /<canvas\s+[^>]*?class=["'][^"']*preview-canvas[^"']*["'][^>]*>/gi;
            let match;
            let count = 0;
            while ((match = canvasRegex.exec(html)) !== null) {
                count++;
                const canvasTag = match[0];
                assert.match(canvasTag, /role=["']img["']/i, `Canvas must have role="img": ${canvasTag}`);
                assert.match(canvasTag, /aria-label=["'][^"']+["']/i, `Canvas must have aria-label: ${canvasTag}`);
            }
            assert.ok(count >= 6, 'Must verify all preview canvases have accessible image semantics');
        });

        it('all portfolio card titles use h3.project-name heading elements', () => {
            const h3CardsRegex = /<h3\s+class=["']project-name["']>/gi;
            const matches = html.match(h3CardsRegex);
            assert.ok(matches && matches.length >= 26, `Expected at least 26 <h3 class="project-name"> headings, found ${matches ? matches.length : 0}`);

            // Ensure no old div.project-name remain
            const divProjectNames = html.match(/<div\s+class=["']project-name["']>/gi);
            assert.equal(divProjectNames, null, 'Must not have any lingering <div class="project-name"> elements');
        });

        it('filter buttons container has role="toolbar" and buttons declare aria-pressed', () => {
            assert.match(
                html,
                /<div\s+class=["'][^"']*filter-bar[^"']*["']\s+role=["']toolbar["']\s+aria-label=["'][^"']+["']>/i,
                'Filter buttons container must declare role="toolbar" and aria-label'
            );
            assert.match(
                html,
                /<button\s+[^>]*?data-filter=["']live["'][^>]*?aria-pressed=["']true["']/i,
                'Active Live filter button must initially have aria-pressed="true"'
            );
            assert.match(
                html,
                /<button\s+[^>]*?data-filter=["']all["'][^>]*?aria-pressed=["']false["']/i,
                'Inactive All filter button must initially have aria-pressed="false"'
            );
            assert.match(
                html,
                /<button\s+[^>]*?data-filter=["']in-dev["'][^>]*?aria-pressed=["']false["']/i,
                'Inactive In-Dev filter button must initially have aria-pressed="false"'
            );
        });

        it('tab buttons declare roving tabindex with active tab at 0 and inactive tabs at -1', () => {
            assert.match(
                html,
                /<button\s+[^>]*?id=["']tab-projects["'][^>]*?tabindex=["']0["']/i,
                'Active Projects tab button must initially have tabindex="0"'
            );
            assert.match(
                html,
                /<button\s+[^>]*?id=["']tab-writing["'][^>]*?tabindex=["']-1["']/i,
                'Inactive Writing tab button must initially have tabindex="-1"'
            );
            assert.match(
                html,
                /<button\s+[^>]*?id=["']tab-patents["'][^>]*?tabindex=["']-1["']/i,
                'Inactive Patents tab button must initially have tabindex="-1"'
            );
            assert.match(
                html,
                /<button\s+[^>]*?id=["']tab-research["'][^>]*?tabindex=["']-1["']/i,
                'Inactive Research tab button must initially have tabindex="-1"'
            );
        });

        it('declares restrictive Permissions-Policy disabling camera, microphone, geolocation, and tracking', () => {
            assert.match(
                html,
                /<meta\s+http-equiv=["']Permissions-Policy["']\s+content=["'][^"']*camera=\(\)[^"']*["']/i,
                'Must declare Permissions-Policy disabling camera'
            );
            assert.match(
                html,
                /<meta\s+http-equiv=["']Permissions-Policy["']\s+content=["'][^"']*microphone=\(\)[^"']*["']/i,
                'Must declare Permissions-Policy disabling microphone'
            );
            assert.match(
                html,
                /<meta\s+http-equiv=["']Permissions-Policy["']\s+content=["'][^"']*geolocation=\(\)[^"']*["']/i,
                'Must declare Permissions-Policy disabling geolocation'
            );
            assert.match(
                html,
                /<meta\s+http-equiv=["']Permissions-Policy["']\s+content=["'][^"']*browsing-topics=\(\)[^"']*["']/i,
                'Must declare Permissions-Policy disabling browsing-topics tracking'
            );
        });

        it('includes anti-clickjacking frame-busting defense script in document head', () => {
            const headMatch = /<head>([\s\S]*?)<\/head>/i.exec(html);
            assert.ok(headMatch, 'Must contain <head>');
            const headContent = headMatch[1];

            assert.match(
                headContent,
                /window\.top\s*!==\s*window\.self/,
                'Must include top !== self frame check'
            );
            assert.match(
                headContent,
                /window\.top\.location\.href\s*=\s*window\.self\.location\.href/,
                'Must include breakout top location redirect'
            );
            assert.match(
                headContent,
                /document\.documentElement\.style\.display\s*=\s*['"]none['"]/,
                'Must include fallback concealment for sandboxed frames'
            );
        });

        it('tightens Content-Security-Policy by disallowing external font origins and restricting font-src to self', () => {
            const cspMatch = /<meta\s+http-equiv=["']Content-Security-Policy["']\s+content="([^"]+)"/i.exec(html);
            assert.ok(cspMatch, 'Must include Content-Security-Policy meta tag');
            const csp = cspMatch[1];
            assert.doesNotMatch(csp, /fonts\.googleapis\.com/, 'CSP must not contain fonts.googleapis.com');
            assert.doesNotMatch(csp, /fonts\.gstatic\.com/, 'CSP must not contain fonts.gstatic.com');
            assert.match(csp, /font-src\s+'self'(\s+data:)?/, 'CSP font-src must be restricted to self');
        });

        it('self-hosts Inter and JetBrains Mono fonts locally with valid WOFF2 files and preloads', () => {
            // Must not contain external Google Fonts stylesheet links
            assert.doesNotMatch(html, /<link[^>]+href=["']https:\/\/fonts\.googleapis\.com/i, 'Must not link to fonts.googleapis.com');
            assert.doesNotMatch(html, /<link[^>]+href=["']https:\/\/fonts\.gstatic\.com/i, 'Must not link to fonts.gstatic.com');

            // Must preload primary latin subsets using relative paths
            assert.match(
                html,
                /<link\s+rel=["']preload["']\s+href=["']\.\/assets\/fonts\/inter-latin\.woff2["']\s+as=["']font["']\s+type=["']font\/woff2["']\s+crossorigin/i,
                'Must preload inter-latin.woff2'
            );
            assert.match(
                html,
                /<link\s+rel=["']preload["']\s+href=["']\.\/assets\/fonts\/jetbrains-mono-latin\.woff2["']\s+as=["']font["']\s+type=["']font\/woff2["']\s+crossorigin/i,
                'Must preload jetbrains-mono-latin.woff2'
            );

            // Verify local font files exist on disk with valid WOFF2 magic numbers (wOF2 = 0x774F4632)
            const expectedFonts = [
                'inter-latin.woff2',
                'inter-latin-ext.woff2',
                'jetbrains-mono-latin.woff2',
                'jetbrains-mono-latin-ext.woff2',
                'jetbrains-mono-italic-latin.woff2'
            ];

            for (const fontFile of expectedFonts) {
                const fontPath = path.join(ROOT_DIR, 'assets', 'fonts', fontFile);
                assert.ok(fs.existsSync(fontPath), `Font file ${fontFile} must exist on disk`);
                const stat = fs.statSync(fontPath);
                assert.ok(stat.size > 10000, `Font file ${fontFile} must be non-trivial (>10KB)`);

                const buffer = Buffer.alloc(4);
                const fd = fs.openSync(fontPath, 'r');
                fs.readSync(fd, buffer, 0, 4, 0);
                fs.closeSync(fd);
                assert.equal(buffer.toString('utf8'), 'wOF2', `Font file ${fontFile} must have WOFF2 header magic`);
            }
        });
    });

    describe('Modern Web Standards & Searchability', () => {
        it('declares color-scheme: light dark on root in CSS', () => {
            assert.match(
                html,
                /color-scheme:\s*light\s+dark/i,
                'Root CSS must declare color-scheme: light dark'
            );
        });

        it('includes adaptive light and dark meta theme-color tags', () => {
            assert.match(
                html,
                /<meta\s+name=["']theme-color["']\s+content=["']#fafafa["']\s+media=["']\(prefers-color-scheme:\s*light\)["']/i,
                'Must include light theme-color meta tag'
            );
            assert.match(
                html,
                /<meta\s+name=["']theme-color["']\s+content=["']#0f1117["']\s+media=["']\(prefers-color-scheme:\s*dark\)["']/i,
                'Must include dark theme-color meta tag'
            );
        });

        it('links valid web app manifest at ./manifest.webmanifest', () => {
            assert.match(
                html,
                /<link\s+rel=["']manifest["']\s+href=["']\.\/manifest\.webmanifest["']/i,
                'Must link ./manifest.webmanifest'
            );
            const manifestPath = path.join(ROOT_DIR, 'manifest.webmanifest');
            assert.ok(fs.existsSync(manifestPath), 'manifest.webmanifest file must exist on disk');
            const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            assert.equal(manifestContent.display, 'standalone');
            assert.ok(manifestContent.icons.length > 0);
        });

        it('includes Speculation Rules API script with valid JSON prefetch rules', () => {
            const specMatch = html.match(/<script\s+type=["']speculationrules["']>([\s\S]*?)<\/script>/i);
            assert.ok(specMatch, 'Expected <script type="speculationrules"> block in HTML');
            const specJson = JSON.parse(specMatch[1]);
            assert.ok(specJson.prefetch, 'Speculation rules must define prefetch rules');
            assert.ok(Array.isArray(specJson.prefetch[0].urls), 'Must declare prefetch urls list');
            assert.ok(specJson.prefetch[0].urls.includes('./fi_sim/'));
        });

        it('declares hidden="until-found" on initial inactive tab sections', () => {
            assert.match(
                html,
                /<section\s+[^>]*?id=["']section-writing["'][^>]*?hidden=["']until-found["']/i,
                'section-writing opening tag must have hidden="until-found"'
            );
            assert.match(
                html,
                /<section\s+[^>]*?id=["']section-patents["'][^>]*?hidden=["']until-found["']/i,
                'section-patents opening tag must have hidden="until-found"'
            );
            assert.match(
                html,
                /<section\s+[^>]*?id=["']section-research["'][^>]*?hidden=["']until-found["']/i,
                'section-research opening tag must have hidden="until-found"'
            );
        });

        it('headshot image specifies fetchpriority="high" for LCP optimization', () => {
            assert.match(
                html,
                /<img\s+[^>]*?class=["'][^"']*headshot[^"']*["'][^>]*?fetchpriority=["']high["']/i,
                'Headshot image must have fetchpriority="high"'
            );
        });

        it('CSS includes text-wrap: balance and text-wrap: pretty', () => {
            assert.match(html, /text-wrap:\s*balance/i, 'CSS must include text-wrap: balance');
            assert.match(html, /text-wrap:\s*pretty/i, 'CSS must include text-wrap: pretty');
        });

        it('CSS includes content-visibility: auto with contain-intrinsic-size', () => {
            assert.match(html, /content-visibility:\s*auto/i, 'CSS must include content-visibility: auto');
            assert.match(html, /contain-intrinsic-size:\s*auto\s+160px/i, 'CSS must include contain-intrinsic-size');
        });

        it('JavaScript registers beforematch event listeners on tab panels', () => {
            assert.match(
                html,
                /addEventListener\(\s*['"]beforematch['"]/i,
                'Tab navigation script must listen for beforematch events'
            );
        });

        it('links valid llms.txt summary at ./llms.txt conforming to standard', () => {
            assert.match(
                html,
                /<link\s+[^>]*?rel=["']alternate["'][^>]*?type=["']text\/markdown["'][^>]*?href=["']\.\/llms\.txt["']/i,
                'HTML must declare <link rel="alternate" type="text/markdown" href="./llms.txt">'
            );

            const llmsPath = path.resolve(ROOT_DIR, 'llms.txt');
            assert.ok(fs.existsSync(llmsPath), 'llms.txt must exist at repository root');
            const llmsContent = fs.readFileSync(llmsPath, 'utf8');
            assert.match(llmsContent, /^#\s+Ryan Drapeau/m, 'llms.txt must start with title heading');
            assert.match(llmsContent, /## Projects/i, 'llms.txt must include Projects section');
            assert.match(llmsContent, /## Writing/i, 'llms.txt must include Writing section');
            assert.match(llmsContent, /## Patents/i, 'llms.txt must include Patents section');
            assert.match(llmsContent, /## Academic Research/i, 'llms.txt must include Research section');
        });

        it('contains companion llms-full.txt file on disk with complete dossier', () => {
            const llmsFullPath = path.resolve(ROOT_DIR, 'llms-full.txt');
            assert.ok(fs.existsSync(llmsFullPath), 'llms-full.txt must exist at repository root');
            const fullContent = fs.readFileSync(llmsFullPath, 'utf8');
            assert.ok(fullContent.length > 2000, 'llms-full.txt must contain detailed dossier content');
            assert.match(fullContent, /Financial Simulator \(FiSim\)/i);
            assert.match(fullContent, /US 11,704,673/i);
            assert.match(fullContent, /Microtalk: Argumentation in Crowdsourcing/i);
        });

        it('robots.txt disallows all search engines and web crawlers', () => {
            const robotsPath = path.resolve(ROOT_DIR, 'robots.txt');
            assert.ok(fs.existsSync(robotsPath), 'robots.txt must exist at repository root');
            const robotsContent = fs.readFileSync(robotsPath, 'utf8');
            assert.match(robotsContent, /User-agent:\s*\*/i, 'robots.txt must declare User-agent: *');
            assert.match(robotsContent, /Disallow:\s*\//i, 'robots.txt must declare Disallow: /');
        });

        it('declares noindex, nofollow in meta robots tag', () => {
            assert.match(
                html,
                /<meta\s+name=["']robots["']\s+content=["']noindex,\s*nofollow,\s*noarchive,\s*nosnippet["']/i,
                'HTML must declare <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">'
            );
        });

        it('omits personal geographic location from llms.txt, llms-full.txt, and HTML for privacy', () => {
            const llmsPath = path.resolve(ROOT_DIR, 'llms.txt');
            const llmsContent = fs.readFileSync(llmsPath, 'utf8');
            const llmsFullPath = path.resolve(ROOT_DIR, 'llms-full.txt');
            const fullContent = fs.readFileSync(llmsFullPath, 'utf8');

            assert.doesNotMatch(llmsContent, /Seattle|San Francisco/i, 'llms.txt must not contain personal geographic location');
            assert.doesNotMatch(fullContent, /Seattle|San Francisco/i, 'llms-full.txt must not contain personal geographic location');
            assert.doesNotMatch(html, /Seattle|San Francisco/i, 'index.html must not contain personal geographic location');
        });
    });

    describe('1-Click BibTeX Citation Modal', () => {
        const expectedPaperKeys = ['microtalk', 'tactile_graphics', 'multiple_guesses', 'kimbee', 'commute'];

        it('defines native HTML5 <dialog> modal with accessible attributes and controls', () => {
            assert.match(
                html,
                /<dialog\s+[^>]*?id=["']bibtex-dialog["'][^>]*?class=["'][^"']*bibtex-dialog[^"']*["'][^>]*?aria-labelledby=["']bibtex-dialog-title["']/i,
                'Modal dialog must be a native <dialog> with id="bibtex-dialog" and aria-labelledby="bibtex-dialog-title"'
            );
            assert.match(html, /id=["']bibtex-dialog-title["']/i, 'Dialog must contain #bibtex-dialog-title heading');
            assert.match(html, /id=["']bibtex-close-btn["'][^>]*?aria-label=["']Close dialog["']/i, 'Dialog must contain #bibtex-close-btn with aria-label');
            assert.match(html, /id=["']bibtex-paper-title["']/i, 'Dialog must contain #bibtex-paper-title display element');
            assert.match(html, /id=["']bibtex-code-text["']/i, 'Dialog must contain #bibtex-code-text code container');
            assert.match(html, /id=["']bibtex-scholar-link["']/i, 'Dialog must contain #bibtex-scholar-link Google Scholar link');
            assert.match(html, /id=["']bibtex-copy-btn["']/i, 'Dialog must contain #bibtex-copy-btn button');
            assert.match(html, /id=["']bibtex-copy-text["']/i, 'Dialog must contain #bibtex-copy-text button text');
        });

        it('every research publication card contains a title link and a BibTeX button in research-footer', () => {
            for (const key of expectedPaperKeys) {
                const cardRegex = new RegExp(`<div\\s+class=["'][^"']*research-card[^"']*["']\\s+data-paper=["']${key}["'][\\s\\S]*?class=["'][^"']*research-footer[^"']*["']`, 'i');
                assert.ok(cardRegex.test(html), `Research card for paper "${key}" must contain .research-footer`);

                const titleLinkRegex = new RegExp(`data-paper=["']${key}["'][\\s\\S]*?<a\\s+[^>]*?class=["'][^"']*paper-title-link[^"']*["']`, 'i');
                assert.ok(titleLinkRegex.test(html), `Research card "${key}" must contain .paper-title-link anchor`);

                const bibtexBtnRegex = new RegExp(`class=["'][^"']*research-footer[^"']*["'][\\s\\S]*?<button\\s+type=["']button["']\\s+class=["'][^"']*bibtex-btn[^"']*["']\\s+data-paper=["']${key}["']\\s+aria-haspopup=["']dialog["']`, 'i');
                assert.ok(bibtexBtnRegex.test(html), `Research card "${key}" must contain .bibtex-btn within .research-footer`);
            }
        });

        it('defines BIBTEX_DATA object in client script with all 5 paper entries', () => {
            assert.match(html, /const\s+BIBTEX_DATA\s*=\s*\{/, 'Script must declare BIBTEX_DATA dictionary');

            for (const key of expectedPaperKeys) {
                const keyEntryRegex = new RegExp(`${key}:\\s*\\{[\\s\\S]*?title:\\s*["'][^"']+["'],[\\s\\S]*?scholarUrl:\\s*["']https:\\/\\/scholar\\.google\\.com\\/[^"']+["'],[\\s\\S]*?bibtex:\\s*\`[\\s\\S]*?\`\\s*\\}`, 'i');
                assert.ok(keyEntryRegex.test(html), `BIBTEX_DATA must define title, scholarUrl, and bibtex for "${key}"`);
            }
        });

        it('defines and invokes initBibtexModal() in site bootstrap sequence', () => {
            assert.match(html, /function\s+initBibtexModal\(\)\s*\{/, 'Script must define initBibtexModal() function');
            assert.match(html, /initBibtexModal\(\);/, 'Script must call initBibtexModal() in bootstrap sequence');
        });

        it('includes responsive dialog CSS, footer alignment, and dark mode color overrides', () => {
            assert.match(html, /\.bibtex-dialog\s*\{/i, 'CSS must style .bibtex-dialog');
            assert.match(html, /\.bibtex-dialog::backdrop\s*\{/i, 'CSS must style .bibtex-dialog::backdrop');
            assert.match(html, /\.research-footer\s*\{/i, 'CSS must style .research-footer');
            assert.match(html, /\.bibtex-btn\s*\{/i, 'CSS must style .bibtex-btn');
            assert.match(html, /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[\s\S]*?\.bibtex-dialog-content\s*\{/i, 'CSS must provide dark mode styles for dialog');
            assert.match(html, /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[\s\S]*?\.bibtex-btn\s*\{/i, 'CSS must provide dark mode styles for .bibtex-btn');
        });
    });
});

