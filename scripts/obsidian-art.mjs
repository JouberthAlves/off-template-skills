// Writes the vault section's Obsidian logo into the site: the tones from
// design/obsidian-logo-tones.json (made by scripts/obsidian-tones.mjs) go into
// site/app.js, and a still <pre> for no JS goes into site/index.html, both
// spelled with the starter vault's note names.
// Run after changing the tones or the notes: node scripts/obsidian-art.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
const { cols, cell, tones } = JSON.parse(fs.readFileSync(path.join(root, "design/obsidian-logo-tones.json"), "utf8"));

// The characters: the starter vault's note names, one stream across the rows.
const names = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (f.name.startsWith(".")) continue;
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (p.endsWith(".md") && !/^(README|CLAUDE|AGENTS|_template)\.md$/.test(f.name)) names.push(path.basename(p, ".md"));
  }
})(path.join(root, "vault"));
const text = names.join(" · ") + " · ";

const pre = tones.map((row, r) => [...row].map((t, c) => (t === "0" ? " " : text[(r * cols + c) % text.length])).join("").replace(/\s+$/, "")).join("\n")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;");

const appPath = path.join(root, "site/app.js");
let app = fs.readFileSync(appPath, "utf8");
app = app.replace(/\/\* obsidian-art:data \*\/.*\n/, `/* obsidian-art:data */ var OBSIDIAN_ART = ${JSON.stringify({ cols, cell, text, tones })};\n`);
fs.writeFileSync(appPath, app);
const htmlPath = path.join(root, "site/index.html");
let html = fs.readFileSync(htmlPath, "utf8");
html = html.replace(/(<pre class="vault-still" aria-hidden="true">)[\s\S]*?(<\/pre>)/, `$1${pre}$2`);
fs.writeFileSync(htmlPath, html);
console.log(`${cols} x ${tones.length} cells, ${names.length} note names`);
