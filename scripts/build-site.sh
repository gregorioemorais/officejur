#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_DIR="$ROOT_DIR/_site"

rm -rf "$SITE_DIR"

mkdir -p "$SITE_DIR/assets"
mkdir -p "$SITE_DIR/documentos/procuracao"
mkdir -p "$SITE_DIR/documentos/hipossuficiencia"
mkdir -p "$SITE_DIR/documentos/honorarios"
mkdir -p "$SITE_DIR/documentos/ciencia-audiencia"
mkdir -p "$SITE_DIR/financeiro"
mkdir -p "$SITE_DIR/controle-pagamentos"

cp -R "$ROOT_DIR/apps/portal/." "$SITE_DIR/"
cp -R "$ROOT_DIR/apps/documentos/procuracao/." "$SITE_DIR/documentos/procuracao/"
cp -R "$ROOT_DIR/apps/documentos/hipossuficiencia/." "$SITE_DIR/documentos/hipossuficiencia/"
cp -R "$ROOT_DIR/apps/documentos/honorarios/." "$SITE_DIR/documentos/honorarios/"
cp -R "$ROOT_DIR/apps/documentos/ciencia-audiencia/." "$SITE_DIR/documentos/ciencia-audiencia/"
cp -R "$ROOT_DIR/apps/financeiro/." "$SITE_DIR/financeiro/"
cp -R "$ROOT_DIR/apps/controle-pagamentos/." "$SITE_DIR/controle-pagamentos/"

for assets in \
  "$SITE_DIR/assets" \
  "$SITE_DIR/documentos/procuracao/assets" \
  "$SITE_DIR/documentos/hipossuficiencia/assets" \
  "$SITE_DIR/documentos/honorarios/assets" \
  "$SITE_DIR/documentos/ciencia-audiencia/assets" \
  "$SITE_DIR/financeiro/assets" \
  "$SITE_DIR/controle-pagamentos/assets"
do
  cp "$ROOT_DIR/packages/ui/app-switcher.js" "$assets/app-switcher.js"
  cp "$ROOT_DIR/packages/ui/site-footer.js" "$assets/site-footer.js"
done

touch "$SITE_DIR/.nojekyll"
