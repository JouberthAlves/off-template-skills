// Optional SessionStart hook: prints "90 System/Agent rules.md" so Claude Code
// adds it to the context on startup, resume, /clear and after compaction.
// Enable it by copying .claude/settings.example.json to .claude/settings.json.
const fs = require('node:fs');
const path = require('node:path');

const LIMIT = 9500; // keep the injected text small; move area rules to area notes
const root = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
const file = path.join(root, '90 System', 'Agent rules.md');

try {
  let text = fs.readFileSync(file, 'utf8').replace(/^---[\s\S]*?---\s*/, '');
  if (text.length > LIMIT) {
    text = text.slice(0, LIMIT) + '\n\n[Truncated: Agent rules.md is over the limit. Read the full file, and move area rules to their area notes.]';
  }
  process.stdout.write('Rules in force for this vault (from 90 System/Agent rules.md):\n\n' + text);
} catch {
  process.stdout.write('This vault has no "90 System/Agent rules.md". Read AGENTS.md before acting.');
}
