#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_DIR="$ROOT_DIR/_site"

rm -rf "$SITE_DIR"

mkdir -p "$SITE_DIR/documentos/procuracao"
mkdir -p "$SITE_DIR/documentos/hipossuficiencia"
mkdir -p "$SITE_DIR/documentos/honorarios"
mkdir -p "$SITE_DIR/documentos/ciencia-audiencia"
mkdir -p "$SITE_DIR/financeiro"
mkdir -p "$SITE_DIR/financeiro/worker/src"
mkdir -p "$SITE_DIR/controle-pagamentos"
mkdir -p "$SITE_DIR/validador-projudi"

copy_static_app() {
  local source="$1"
  local destination="$2"
  cp "$source/index.html" "$destination/index.html"
  cp -R "$source/assets" "$destination/assets"
}

cp "$ROOT_DIR/apps/portal/index.html" "$SITE_DIR/index.html"
cp -R "$ROOT_DIR/apps/portal/assets" "$SITE_DIR/assets"
cp -R "$ROOT_DIR/apps/portal/scripts" "$SITE_DIR/scripts"

copy_static_app "$ROOT_DIR/apps/documentos/procuracao" "$SITE_DIR/documentos/procuracao"
copy_static_app "$ROOT_DIR/apps/documentos/hipossuficiencia" "$SITE_DIR/documentos/hipossuficiencia"
copy_static_app "$ROOT_DIR/apps/documentos/honorarios" "$SITE_DIR/documentos/honorarios"
copy_static_app "$ROOT_DIR/apps/documentos/ciencia-audiencia" "$SITE_DIR/documentos/ciencia-audiencia"
copy_static_app "$ROOT_DIR/apps/controle-pagamentos" "$SITE_DIR/controle-pagamentos"
copy_static_app "$ROOT_DIR/apps/validador-projudi" "$SITE_DIR/validador-projudi"

cp "$ROOT_DIR/apps/financeiro/"*.html "$SITE_DIR/financeiro/"
cp -R "$ROOT_DIR/apps/financeiro/assets" "$SITE_DIR/financeiro/assets"
cp "$ROOT_DIR/apps/financeiro/worker/src/index.js" "$SITE_DIR/financeiro/worker/src/index.js"

for assets in \
  "$SITE_DIR/assets" \
  "$SITE_DIR/documentos/procuracao/assets" \
  "$SITE_DIR/documentos/hipossuficiencia/assets" \
  "$SITE_DIR/documentos/honorarios/assets" \
  "$SITE_DIR/documentos/ciencia-audiencia/assets" \
  "$SITE_DIR/financeiro/assets" \
  "$SITE_DIR/controle-pagamentos/assets" \
  "$SITE_DIR/validador-projudi/assets"
do
  cp "$ROOT_DIR/packages/ui/app-switcher.js" "$assets/app-switcher.js"
  cp "$ROOT_DIR/packages/ui/site-footer.js" "$assets/site-footer.js"
done

touch "$SITE_DIR/.nojekyll"
