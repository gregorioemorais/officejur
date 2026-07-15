import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve('_site');
const htmlFiles = [];
const publishedFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) walk(path);
    else {
      publishedFiles.push(path);
      if (entry.endsWith('.html')) htmlFiles.push(path);
    }
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

const forbiddenPublishedFiles = publishedFiles
  .map(path => path.replace(`${root}/`, ''))
  .filter(path => /(?:^|\/)(?:README|ARCHITECTURE)\.md$|(?:^|\/)\.(?:gitignore|gitmessage)$|(?:^|\/)wrangler\.toml$|^controle-pagamentos\/controle-pagamentos\.json$/.test(path));

if (forbiddenPublishedFiles.length) {
  console.error('Arquivos internos ou dados indevidamente publicados:');
  for (const path of forbiddenPublishedFiles) console.error(`- ${path}`);
  process.exit(1);
}

const financeScript = readFileSync(join(root, 'financeiro/assets/app.js'), 'utf8');
const requiredDocumentRoutes = [
  "procuracao:'../documentos/procuracao/'",
  "honorarios:'../documentos/honorarios/'"
];

if (requiredDocumentRoutes.some(route => !financeScript.includes(route)) || /['"]\.\.\/(?:procuracao|honorarios)\//.test(financeScript)) {
  console.error('As rotas de geração de documentos do Financeiro estão incorretas.');
  process.exit(1);
}

console.log(`${htmlFiles.length} páginas HTML e ${publishedFiles.length} arquivos publicados verificados.`);
