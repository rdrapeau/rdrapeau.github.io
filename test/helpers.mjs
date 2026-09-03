import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.resolve(__dirname, '..');
export const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');

/**
 * Returns the raw string content of index.html
 */
export function getIndexHtml() {
    return fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
}

/**
 * Extracts inner HTML of a section with given ID.
 */
export function getSectionHtml(html, sectionId) {
    const regex = new RegExp(`<section[^>]*?id=["']${sectionId}["'][^>]*?>([\\s\\S]*?)<\\/section>`, 'i');
    const match = regex.exec(html);
    return match ? match[1] : '';
}

/**
 * Extracts all attributes of a given name from HTML tags.
 */
export function getAllAttributes(html, attributeName) {
    const results = [];
    const regex = new RegExp(`(?:<[a-zA-Z0-9_-]+)(?:[^>]*?\\s)${attributeName}=["']([^"']+)["'][^>]*>`, 'gi');
    let match;
    while ((match = regex.exec(html)) !== null) {
        results.push({
            tag: match[0],
            value: match[1]
        });
    }
    return results;
}

/**
 * Extracts elements matching an opening tag and exact class name token.
 */
export function getElementsByClass(html, className) {
    const results = [];
    const regex = /<([a-zA-Z0-9]+)\b([^>]*?)>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const fullTag = match[0];
        const tagName = match[1];
        const attributes = match[2];
        const classMatch = /\bclass=["']([^"']+)["']/i.exec(attributes);
        if (classMatch) {
            const classes = classMatch[1].trim().split(/\s+/);
            if (classes.includes(className)) {
                results.push({ fullTag, tagName, attributes });
            }
        }
    }
    return results;
}

/**
 * Extracts text content of an element with given ID.
 */
export function getElementTextById(html, id) {
    const regex = new RegExp(`<([a-zA-Z0-9]+)[^>]*?id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/\\1>`, 'i');
    const match = regex.exec(html);
    return match ? match[2].trim() : null;
}

/**
 * Extracts badge count number for a given tab (e.g. 'projects', 'research', etc.)
 */
export function getTabBadgeCount(html, tabId) {
    const btnRegex = new RegExp(`<button[^>]*?id=["']tab-${tabId}["'][^>]*?>([\\s\\S]*?)<\\/button>`, 'i');
    const btnMatch = btnRegex.exec(html);
    if (!btnMatch) return null;

    const badgeMatch = /<span[^>]*?class=["'][^"']*?\btab-badge\b[^"']*?["'][^>]*?>\s*(\d+)\s*<\/span>/i.exec(btnMatch[1]);
    return badgeMatch ? parseInt(badgeMatch[1], 10) : null;
}

/**
 * Returns all direct subdirectories in root that are projects.
 */
export function getSubprojects() {
    const excluded = new Set([
        '.git',
        '.github',
        '.agents',
        'node_modules',
        'test',
        'assets',
        'scratch',
        'coverage'
    ]);

    const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
    return entries
        .filter(e => e.isDirectory() && !excluded.has(e.name))
        .map(e => e.name);
}
