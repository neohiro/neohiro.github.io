#!/usr/bin/env node
/* Assert the shipped dashboard is genuinely self-contained.
 *
 * Privacy is the whole product here: the page must render with the network
 * switched off, so it may not reference a third party. This runs in CI so a
 * stray CDN link or analytics tag fails the build instead of quietly shipping.
 *
 * Allowed: 127.0.0.1 / localhost / ::1 (the user's own service), the canonical
 *          neohiro.github.io origin, and XML/SVG namespace URIs, which are
 *          identifiers rather than fetches.
 * Rejected: everything else in a shipped file, plus @import and known CDN and
 *          analytics host fragments.
 *
 * Comments and string literals that merely *mention* a URL must not trip it, so
 * comments are stripped before scanning.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = process.argv[2] || process.cwd();
const SHIPPED = new Set(['.html', '.css', '.js', '.svg', '.json', '.webmanifest']);
const SKIP_DIRS = new Set(['.git', 'node_modules', '.github', 'schema', 'samples']);

const ALLOWED_HOSTS = [
  '127.0.0.1', 'localhost', '::1', '[::1]',
  'neohiro.github.io', 'www.w3.org', 'json-schema.org'
];
const BANNED = [
  '@import', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net',
  'unpkg.com', 'cdnjs.cloudflare.com', 'ajax.googleapis.com', 'use.typekit.net',
  'google-analytics.com', 'googletagmanager.com', 'gtag(', 'dataLayer.push',
  'plausible.io', 'hotjar', 'segment.com', 'sentry.io'
];

const problems = [];

function stripComments(src, ext) {
  let s = src.replace(/<!--[\s\S]*?-->/g, ' ');           // HTML comments
  if (ext === '.html') return s;
  // block + line comments, guarding against "://" inside them
  s = s.replace(/\/\*[\s\S]*?\*\//g, ' ');
  s = s.replace(/(^|[^:\\])\/\/[^\n]*/g, '$1 ');
  return s;
}

function checkUrl(raw, file, line) {
  let host;
  try {
    host = new URL(raw).hostname.toLowerCase();
  } catch {
    problems.push(`${file}:${line}  malformed URL  ${raw}`);
    return;
  }
  if (!ALLOWED_HOSTS.includes(host)) {
    problems.push(`${file}:${line}  external host "${host}"  ${raw}`);
  }
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (!SHIPPED.has(extname(name))) continue;

    const rel = relative(ROOT, full).replace(/\\/g, '/');
    const src = stripComments(readFileSync(full, 'utf8'), extname(name));
    const lines = src.split('\n');

    lines.forEach((line, i) => {
      const low = line.toLowerCase();

      for (const frag of BANNED) {
        if (low.includes(frag.toLowerCase())) {
          problems.push(`${rel}:${i + 1}  banned reference "${frag}"  ${line.trim()}`);
        }
      }

      for (const m of line.matchAll(/\b(?:https?:)?\/\/([^\s'"()<>\\]+)/g)) {
        const url = m[0];
        /* namespace URIs are identifiers, never fetched */
        if (/w3\.org/.test(url)) continue;
        checkUrl(url.startsWith('//') ? 'https:' + url : url, rel, i + 1);
      }

      /* protocol-relative and bare //host references */
      for (const m of line.matchAll(/(?:src|href)\s*=\s*["']\/\/([^"']+)["']/gi)) {
        checkUrl('https://' + m[1], rel, i + 1);
      }
    });
  }
}

walk(ROOT);

if (problems.length) {
  console.error('self-containment check FAILED\n');
  for (const p of problems) console.error('  ' + p);
  console.error(`\n${problems.length} problem(s). The dashboard must not talk to anyone but 127.0.0.1.`);
  process.exit(1);
}
console.log('self-containment check passed — no third-party references in shipped files');
