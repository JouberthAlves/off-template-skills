#!/usr/bin/env bash
# Copies the skills into the plugin. Run after changing anything in skills/.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf plugin/skills
mkdir -p plugin/skills
cp -r skills/super-webdesigner skills/ai-slop-check plugin/skills/
echo "plugin/skills synced from skills/"
