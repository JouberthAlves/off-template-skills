#!/usr/bin/env bash
# Copies the starter vault into the skill, then the skills into the plugin.
# Run after changing anything in skills/ or vault/.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf skills/off-template/assets/vault
mkdir -p skills/off-template/assets
cp -r vault skills/off-template/assets/vault
rm -rf plugin/skills
mkdir -p plugin/skills
cp -r skills/off-template skills/ai-slop-check plugin/skills/
echo "skills/off-template/assets/vault synced from vault/, plugin/skills from skills/"
