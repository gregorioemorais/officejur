import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
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
const redirectPages = [];
const attributePattern = /\b(?:href|src)=["']([^"']+)["']/g;

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  if (/http-equiv=["']refresh["']|window\.location\.replace\s*\(/i.test(html)) {
    redirectPages.push(htmlFile.replace(`${root}/`, ''));
  }
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

if (redirectPages.length) {
  console.error('Páginas de redirecionamento obsoletas foram publicadas:');
  for (const path of redirectPages) console.error(`- ${path}`);
  process.exit(1);
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

const obsoleteSourceFiles = [
  'apps/portal/scripts/index.html',
  'apps/financeiro/assets/apple-touch-icon.svg'
];

for (const path of obsoleteSourceFiles) {
  if (existsSync(path)) {
    console.error(`Arquivo obsoleto ainda presente: ${path}`);
    process.exit(1);
  }
}

const currentSourceChecks = [
  ['apps/validador-projudi/src/validation.js', /pdfjs-dist\/legacy\//, 'build legado do PDF.js'],
  ['apps/controle-pagamentos/assets/app.js', /payload\.data\s*\|\|\s*payload/, 'formato antigo de backup'],
  ['apps/portal/scripts/central-guias.html', /function\s+getPayloadDb\b/, 'formato antigo da Central de Guias'],
  ['apps/financeiro/assets/app.js', /schema\s*:\s*SCHEMA\s*}\s*;/, 'migração silenciosa de esquema']
];

for (const [path, pattern, label] of currentSourceChecks) {
  if (pattern.test(readFileSync(path, 'utf8'))) {
    console.error(`Compatibilidade obsoleta encontrada em ${path}: ${label}.`);
    process.exit(1);
  }
}

const financeScript = readFileSync(join(root, 'financeiro/assets/app.js'), 'utf8');
const financeHtml = readFileSync(join(root, 'financeiro/index.html'), 'utf8');
const requiredDocumentRoutes = [
  "procuracao:'../documentos/procuracao/'",
  "honorarios:'../documentos/honorarios/'"
];

if (requiredDocumentRoutes.some(route => !financeScript.includes(route)) || /['"]\.\.\/(?:procuracao|honorarios)\//.test(financeScript)) {
  console.error('As rotas de geração de documentos do Financeiro estão incorretas.');
  process.exit(1);
}

if (!financeHtml.includes('./assets/libphonenumber-max.js') || !financeScript.includes('phoneCountry')) {
  console.error('O cadastro internacional de telefones não está completo no Financeiro.');
  process.exit(1);
}

const require = createRequire(import.meta.url);
const phoneApi = require(join(root, 'financeiro/assets/libphonenumber-max.js'));
const phoneCases = [
  ['BR', '62999999999', '+5562999999999', '+55 62 99999 9999'],
  ['CH', '791234567', '+41791234567', '+41 79 123 45 67']
];

for (const [country, input, e164, international] of phoneCases) {
  const phone = phoneApi.parsePhoneNumberFromString(input, country);
  if (!phone?.isValid() || phone.number !== e164 || phone.formatInternational() !== international) {
    console.error(`Falha na validação de telefone internacional: ${country}.`);
    process.exit(1);
  }
}

console.log(`${htmlFiles.length} páginas HTML e ${publishedFiles.length} arquivos publicados verificados.`);
