#!/usr/bin/env node
// Claude Code PostToolUse hook: after an Edit or Write on a page file, runs the
// code floor of sloplint (static only, fast) and hands any FAIL back to the
// agent. Only in projects made with the flow (a design/direction.md above the
// file, or the stamp on line 1 of the CSS). It advises, never blocks, and stays
// silent on any error of its own.

import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";

const done = (obj) => { if (obj) process.stdout.write(JSON.stringify(obj)); process.exit(0); };

function main() {
  let payload;
  try { payload = JSON.parse(readFileSync(0, "utf8")); } catch { return done(); }
  const file = payload?.tool_input?.file_path;
  if (typeof file !== "string" || !/\.(html?|css|jsx|tsx|vue|svelte|astro)$/i.test(file) || !existsSync(file)) return done();

  const src = readFileSync(file, "utf8");
  const stamped = /^\s*\/\*\s*super-webdesigner/i.test(src);
  const inProject = () => { let d = dirname(file); for (let i = 0; i < 8; i++) { if (existsSync(join(d, "design", "direction.md"))) return true; const up = dirname(d); if (up === d) break; d = up; } return false; };
  if (!stamped && !inProject()) return done();

  const lint = join(dirname(fileURLToPath(import.meta.url)), "sloplint.mjs");
  let out = "";
  try {
    out = execFileSync(process.execPath, [lint, file, "--json", "--floor"], { encoding: "utf8", timeout: 8000, stdio: ["ignore", "pipe", "ignore"] });
  } catch (e) { out = e?.stdout?.toString?.() ?? ""; }
  let report;
  try { report = JSON.parse(out); } catch { return done(); }
  const fails = report.findings ?? [];
  if (!fails.length) return done();

  const lines = fails.slice(0, 8).map((f) => `- ${f.id} (${f.where}): ${f.evidence} -> ${f.fix}`);
  const more = fails.length > 8 ? `\n(+${fails.length - 8} more: run sloplint on the file)` : "";
  done({
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: `super-webdesigner code floor on ${basename(file)}: ${fails.length} FAIL.\n${lines.join("\n")}${more}\nFix these now; the render checks and the tells run in the review.`,
    },
  });
}

try { main(); } catch { done(); }
