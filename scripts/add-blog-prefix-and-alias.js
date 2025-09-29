#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

function walk(dir, filterFn) {
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(fullPath, filterFn));
    } else if (entry.isFile()) {
      if (!filterFn || filterFn(fullPath)) results.push(fullPath);
    }
  }
  return results;
}

function isMarkdown(p) {
  return p.endsWith('.md');
}

function splitFrontMatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  const fmRaw = content.substring(3, end + 1); // exclude starting '---' but include the trailing newline
  const body = content.substring(end + 4); // skip "\n---"
  return { fmRaw, body };
}

function ensureArray(val) {
  if (val == null) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

function normalizeUrl(u) {
  if (!u) return u;
  // remove any duplicate slashes except the first
  return u.replace(/\/+/g, '/');
}

function addBlogPrefix(u) {
  if (!u) return u;
  let url = u.trim();
  const hasTrailingSlash = url.endsWith('/');
  // ensure starts with '/'
  if (!url.startsWith('/')) url = '/' + url;
  if (!url.startsWith('/blog')) {
    url = '/blog' + url;
  }
  if (hasTrailingSlash && !url.endsWith('/')) url += '/';
  return normalizeUrl(url);
}

function removeBlogPrefix(u) {
  if (!u) return u;
  let url = u.trim();
  const hasTrailingSlash = url.endsWith('/');
  if (url.startsWith('/blog')) {
    url = url.substring('/blog'.length);
    if (!url.startsWith('/')) url = '/' + url;
  }
  if (hasTrailingSlash && !url.endsWith('/')) url += '/';
  return normalizeUrl(url);
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const parts = splitFrontMatter(original);
  if (!parts) return { changed: false, reason: 'no-front-matter' };

  let data;
  try {
    data = yaml.load(parts.fmRaw) || {};
  } catch (e) {
    return { changed: false, reason: 'yaml-parse-error', error: e.message };
  }

  const currentUrl = data.url;
  if (!currentUrl || typeof currentUrl !== 'string') {
    return { changed: false, reason: 'no-url' };
  }

  if (currentUrl.startsWith('/blog')) {
    // Already has the desired prefix — do not modify
    return { changed: false, reason: 'already-prefixed' };
  }

  const oldUrl = normalizeUrl(currentUrl.trim());
  const newUrl = addBlogPrefix(oldUrl);

  // Update aliases: include oldUrl if not already present (consider variants with/without trailing slash)
  let aliases = ensureArray(data.aliases);
  const variants = new Set([
    oldUrl,
    oldUrl.endsWith('/') ? oldUrl.slice(0, -1) : oldUrl + '/',
  ]);
  const existing = new Set(aliases.map(String));
  for (const v of variants) {
    if (!existing.has(v)) {
      aliases.push(v);
      // Only need to add one variant; break after adding the canonical one (oldUrl)
      break;
    }
  }

  data.url = newUrl;
  data.aliases = aliases;

  // Rebuild front matter
  const newFm = '---\n' + yaml.dump(data, { lineWidth: 1000 }).trimEnd() + '\n---';
  const updated = newFm + parts.body;

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return { changed: true, oldUrl, newUrl };
  }
  return { changed: false, reason: 'no-change-after-build' };
}

function main() {
  const mdFiles = walk(CONTENT_DIR, isMarkdown);
  let changed = 0;
  const report = [];
  for (const file of mdFiles) {
    const res = processFile(file);
    if (res.changed) {
      changed++;
      report.push({ file, oldUrl: res.oldUrl, newUrl: res.newUrl });
    }
  }
  console.log(`[SUMMARY] Updated ${changed} files.`);
  for (const r of report) {
    console.log(`- ${path.relative(ROOT, r.file)} : ${r.oldUrl} -> ${r.newUrl}`);
  }
}

if (require.main === module) {
  main();
}
