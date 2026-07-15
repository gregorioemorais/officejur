import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve('_site');
const htmlFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (entry.endsWith('.html')) htmlFiles.push(path);
  }
}

walk(root);

const missing = [];
const attributePattern = /\b(?:href|src)=["']([^"']+)["']/g;

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  for (const match of html.matchAll(attributePattern)) {
    const reference = match[1].split('#')[0].split('?')[0];
    if (!reference || /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(reference)) continue;

    const target = reference.startsWith('/')
      ? join(root, reference.replace(/^\/officejur\/?/, ''))
      : resolve(dirname(htmlFile), reference);
    const resolvedTarget = target.endsWith('/') ? join(target, 'index.html') : target;

    if (!existsSync(resolvedTarget)) {
      missing.push(`${htmlFile.replace(`${root}/`, '')}: ${match[1]}`);
    }
  }
}

if (missing.length) {
  console.error('Referências locais ausentes:');
  for (const reference of missing) console.error(`- ${reference}`);
  process.exit(1);
}

console.log(`${htmlFiles.length} páginas HTML verificadas sem referências locais ausentes.`);
