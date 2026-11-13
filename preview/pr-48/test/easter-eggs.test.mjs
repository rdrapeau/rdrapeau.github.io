import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getIndexHtml } from './helpers.mjs';

describe('Easter Eggs & Interactive Hooks', () => {
    const html = getIndexHtml();

    describe('Le Drapeau French Flag Hover Easter Egg', () => {
        it('header contains interactive drapeau-name element', () => {
            assert.match(
                html,
                /<span[^>]*?class=["'][^"']*?\bdrapeau-interactive\b[^"']*?["'][^>]*?id=["']drapeau-name["']/i,
                'Expected #drapeau-name with class .drapeau-interactive in header'
            );
        });

        it('has accessible button role, tabindex, title, and aria-label', () => {
            const match = /<span[^>]*?id=["']drapeau-name["'][^>]*>/i.exec(html);
            assert.ok(match, 'Expected #drapeau-name element');
            const attrs = match[0];

            assert.match(attrs, /role=["']button["']/i, 'Must have role="button"');
            assert.match(attrs, /tabindex=["']0["']/i, 'Must have tabindex="0"');
            assert.match(attrs, /title=["'][^"']*flag[^"']*🇫🇷/i, 'Must have title explaining flag meaning');
            assert.match(attrs, /aria-label=["'][^"']*flag/i, 'Must have accessible aria-label');
        });

        it('contains both text ("Drapeau") and flag emoji ("🇫🇷") child spans', () => {
            assert.match(
                html,
                /<span[^>]*?class=["'][^"']*?\bdrapeau-text\b[^"']*?["'][^>]*>\s*Drapeau\s*<\/span>/i,
                'Must contain .drapeau-text with "Drapeau"'
            );
            assert.match(
                html,
                /<span[^>]*?class=["'][^"']*?\bdrapeau-flag\b[^"']*?["'][^>]*>\s*🇫🇷\s*<\/span>/i,
                'Must contain .drapeau-flag with "🇫🇷"'
            );
        });

        it('has CSS transitions and zero-layout-shift grid layout for drapeau', () => {
            assert.match(html, /\.drapeau-interactive\s*\{[^}]*display:\s*inline-grid/i);
            assert.match(html, /\.drapeau-interactive:hover\s+\.drapeau-flag/i);
            assert.match(html, /\.drapeau-interactive\.active\s+\.drapeau-flag/i);
        });

        it('defines and executes initDrapeauFlagHover JavaScript initializer', () => {
            assert.match(html, /function\s+initDrapeauFlagHover\s*\(\)/i, 'Function initDrapeauFlagHover must be defined');
            assert.match(html, /initDrapeauFlagHover\s*\(\);/i, 'initDrapeauFlagHover must be invoked');
        });
    });
});
