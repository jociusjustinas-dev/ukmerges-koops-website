#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$SCRIPT_DIR/dist"

node "$SCRIPT_DIR/tests/verify.mjs"
mkdir -p "$DIST_DIR"
rm -f "$DIST_DIR/koops-theme.zip" "$DIST_DIR/koops-core.zip"
(
  cd "$SCRIPT_DIR/wp-content/themes"
  zip -qr "$DIST_DIR/koops-theme.zip" koops -x '*.DS_Store'
)
(
  cd "$SCRIPT_DIR/wp-content/plugins"
  zip -qr "$DIST_DIR/koops-core.zip" koops-core -x '*.DS_Store'
)
echo "Paruošta: $DIST_DIR/koops-theme.zip ir $DIST_DIR/koops-core.zip"

