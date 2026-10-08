import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getIndexHtml, getElementsByClass, getElementTextById, getTabBadgeCount, getSectionHtml } from './helpers.mjs';

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

        it('has Open Graph social sharing meta tags', () => {
            assert.match(html, /<meta\s+property=["']og:title["']/i, 'Missing og:title');
            assert.match(html, /<meta\s+property=["']og:description["']/i, 'Missing og:description');
            assert.match(html, /<meta\s+property=["']og:type["']/i, 'Missing og:type');
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
    });
});
