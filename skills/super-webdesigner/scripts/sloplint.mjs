#!/usr/bin/env node
// sloplint: the mechanical half of the super-webdesigner review.
// Static checks read the HTML, CSS and components; --render opens the page in
// the Chrome already on the machine (no npm install) and measures it at five
// widths. It never replaces Impeccable's detector or the screenshots: it only
// catches what a rule can catch. The rules are in references/lint.md.
//
//   node sloplint.mjs <file | folder | http://url> [--render] [--shots <dir>] [--json] [--floor]
//
// Exit 1 when there is a FAIL. --floor reports FAILs only (the edit hook uses it).

import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, extname, resolve, basename } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const opt = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const target = argv.find((a, i) => !a.startsWith("--") && argv[i - 1] !== "--shots");
if (!target) {
  console.error("usage: node sloplint.mjs <file | folder | http://url> [--render] [--shots <dir>] [--json] [--floor]");
  process.exit(2);
}

const findings = [];
// tier FAIL = the floor, never ships. WARN = one of the 13 tells or a default:
// fix it, or write the reason under Waivers in design/direction.md.
const add = (tier, id, where, evidence, fix, tell) => findings.push({ tier, id, where, evidence, fix, ...(tell ? { tell } : {}) });

// ---------- sources ----------

const SKIP = new Set(["node_modules", ".git", ".next", "dist", "build", ".vercel", ".astro"]);
const MARKUP = new Set([".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro"]);
const isUrl = /^https?:\/\//i.test(target);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (MARKUP.has(extname(p).toLowerCase()) || extname(p).toLowerCase() === ".css") out.push(p);
  }
  return out;
}

let files = [];
if (!isUrl) {
  const abs = resolve(target);
  if (!existsSync(abs)) { console.error(`not found: ${target}`); process.exit(2); }
  files = statSync(abs).isDirectory() ? walk(abs) : [abs];
  // A page pulls in its local stylesheets.
  for (const f of [...files]) {
    if (!/\.html?$/i.test(f)) continue;
    const html = readFileSync(f, "utf8");
    for (const m of html.matchAll(/<link[^>]+rel=["']?stylesheet[^>]*>/gi)) {
      const href = m[0].match(/href=["']([^"']+)["']/i)?.[1];
      if (!href || /^(https?:)?\/\//i.test(href)) continue;
      const p = resolve(dirname(f), href.split("?")[0]);
      if (existsSync(p) && !files.includes(p)) files.push(p);
    }
  }
}

const rel = (p) => p.replace(process.cwd() + "\\", "").replace(process.cwd() + "/", "").replace(/\\/g, "/");
const lineAt = (src, idx) => src.slice(0, idx).split("\n").length;

const cssSources = []; // { file, src, offset }
const markupSources = []; // { file, src }
for (const f of files) {
  const src = readFileSync(f, "utf8");
  if (extname(f).toLowerCase() === ".css") { cssSources.push({ file: f, src, offset: 0 }); continue; }
  markupSources.push({ file: f, src });
  for (const m of src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    cssSources.push({ file: f, src: m[1], offset: lineAt(src, m.index) - 1 });
  }
}

// ---------- a small CSS walker ----------
// Yields every declaration with the chain of selectors and at-rules around it.

function parseCss(src) {
  const clean = src.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
  const decls = [];
  const stack = [];
  let buf = "", start = 0, paren = 0, quote = null;
  const flush = () => {
    const text = buf.trim();
    if (text && stack.length) {
      const c = text.indexOf(":");
      if (c > 0) {
        const prop = text.slice(0, c).trim().toLowerCase();
        const value = text.slice(c + 1).replace(/!important/i, "").trim();
        decls.push({ prop, value, chain: [...stack], line: lineAt(clean, start + (buf.length - buf.trimStart().length)) });
      }
    }
    buf = "";
  };
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (!buf.trim()) start = i;
    if (quote) { buf += ch; if (ch === quote && clean[i - 1] !== "\\") quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === "(") paren++;
    if (ch === ")") paren = Math.max(0, paren - 1);
    if (paren === 0 && ch === "{") { stack.push(buf.trim()); buf = ""; continue; }
    if (paren === 0 && ch === "}") { flush(); stack.pop(); continue; }
    if (paren === 0 && ch === ";") { flush(); continue; }
    buf += ch;
  }
  return decls;
}

const allDecls = [];
for (const s of cssSources) for (const d of parseCss(s.src)) allDecls.push({ ...d, file: s.file, line: d.line + s.offset });
const allCss = cssSources.map((s) => s.src).join("\n");
const allMarkup = markupSources.map((s) => s.src).join("\n");
const at = (d) => `${rel(d.file)}:${d.line}`;

// ---------- static checks ----------

const tokenBlock = (chain) => chain.some((s) => /^(:root|\[data-theme|:root\[|html\[data-theme|@font-face)/i.test(s) || /prefers-color-scheme/i.test(s) && chain.some((x) => /:root/.test(x)));
const inKeyframes = (chain) => chain.some((s) => /^@(-webkit-)?keyframes/i.test(s));
const stripVars = (v) => v.replace(/var\([^()]*(\([^()]*\))*[^()]*\)/g, "");
const COLOR = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb|color-mix)\(|\b(white|black|red|blue|green|gr[ae]y|purple|orange|yellow|pink|navy|teal|violet|indigo)\b/i;
const NO_COLOR_PROPS = /^(font|font-family|grid-template-areas|content|transition|animation|will-change|counter-reset|list-style|src)$/;

// A. Colour and font only through tokens.
for (const d of allDecls) {
  if (d.prop.startsWith("--") || tokenBlock(d.chain) || inKeyframes(d.chain) && !COLOR.test(stripVars(d.value))) continue;
  const v = stripVars(d.value);
  if (!NO_COLOR_PROPS.test(d.prop) && COLOR.test(v) && !/url\(/i.test(v)) {
    add("FAIL", "token-color", at(d), `${d.prop}: ${d.value}`, "Declare the colour once as a token in :root (--name) and use var(--name) here.");
  }
  if (d.prop === "font-family" && !/^(inherit|initial|unset)$/i.test(v.trim()) && v.trim()) {
    add("FAIL", "token-font", at(d), `font-family: ${d.value}`, "Declare the face as a token in :root (--font-...) and use var() here.");
  }
  if (d.prop === "font" && /["']|\b(serif|sans-serif|monospace|system-ui|cursive)\b/i.test(v)) {
    add("FAIL", "token-font", at(d), `font: ${d.value}`, "Use var(--font-...) for the family inside the font shorthand.");
  }
}
for (const m of markupSources) {
  for (const s of m.src.matchAll(/style=["']([^"']*)["']/gi)) {
    if (COLOR.test(stripVars(s[1])) && /(color|background|border|fill|stroke|shadow)/i.test(s[1])) {
      add("FAIL", "token-color", `${rel(m.file)}:${lineAt(m.src, s.index)}`, `style="${s[1].slice(0, 70)}"`, "Move the colour to a token; inline styles use var() only.");
    }
  }
}

// B. Never transition: all, never animate the layout. Motion itself stays.
const LAYOUT = /\b(width|height|top|left|right|bottom|max-height|max-width|margin(-\w+)?|padding(-\w+)?)\b/i;
for (const d of allDecls) {
  if (d.prop === "transition" || d.prop === "transition-property") {
    for (const item of d.value.split(",")) {
      const first = item.trim().split(/\s+/)[0] || "";
      const animatesAll = first === "all" || (d.prop === "transition" && /^[\d.]+m?s$|^(ease|linear|cubic-bezier|steps)/i.test(first));
      if (animatesAll) add("FAIL", "transition-all", at(d), `${d.prop}: ${d.value}`, "Name what moves: transition: transform .2s, opacity .2s. The motion stays, only the 'all' goes.");
      else if (LAYOUT.test(first)) add("FAIL", "animate-layout", at(d), `${d.prop}: ${d.value}`, "Animate transform, opacity or clip-path instead of the layout (scale, translate, clip-path inset).");
    }
  }
  if (inKeyframes(d.chain) && /^(width|height|top|left|right|bottom|max-height|margin|padding)/.test(d.prop)) {
    add("FAIL", "animate-layout", at(d), `@keyframes sets ${d.prop}`, "Move it with transform (translate/scale) or reveal it with clip-path.");
  }
}

// C. overflow-x: clip on html and body; never hidden, never 100vw.
const rootSel = (chain) => /(^|[\s,])(html|body)(?=$|[\s,:.[])/i.test(chain[chain.length - 1] || "");
let clipped = false;
for (const d of allDecls) {
  if (!rootSel(d.chain)) continue;
  if ((d.prop === "overflow-x" || d.prop === "overflow") && /\bhidden\b/.test(d.value)) {
    add("FAIL", "overflow-hidden", at(d), `${d.chain.at(-1)} { ${d.prop}: ${d.value} }`, "Use overflow-x: clip. hidden breaks position: sticky.");
  }
  if ((d.prop === "overflow-x" || d.prop === "overflow") && /\bclip\b/.test(d.value)) clipped = true;
}
for (const d of allDecls) {
  if (/^(min-|max-)?width$/.test(d.prop) && /\b100vw\b/.test(d.value)) {
    add("FAIL", "width-100vw", at(d), `${d.prop}: ${d.value}`, "Use 100% (100vw counts the scrollbar and pushes the page sideways).");
  }
}
if (cssSources.length && !clipped && !isUrl) add("WARN", "no-clip", "css", "html and body have no overflow-x: clip", "Add html, body { overflow-x: clip; }.");

// D. Grid tracks that can grow past their column.
for (const d of allDecls) {
  if (!/^grid-template-columns$|^grid$/.test(d.prop)) continue;
  const bare = d.value.replace(/minmax\([^)]*\)/g, "");
  if (/\d*\.?\d+fr\b/.test(bare)) add("WARN", "grid-minmax", at(d), `${d.prop}: ${d.value}`, "Use minmax(0, 1fr) so an image or a long word cannot widen the column.");
}

// E. The container is capped.
const capped = allDecls.some((d) => d.prop === "max-width" && /(\d{3,4}px|\d{2,3}(\.\d+)?rem|\d{2,3}ch|min\(|clamp\()/.test(d.value));
if (cssSources.length && !capped && !isUrl) add("WARN", "no-cap", "css", "no max-width found for the content", "Cap the container (max-width around 75 to 90rem) so at 1920 only the gutters grow.");

// Access: focus and reduced motion.
const moves = /@(-webkit-)?keyframes|\banimation\s*:|\btransition\s*:/i.test(allCss) || /\bgsap\b|animate\(|IntersectionObserver/.test(allMarkup);
const reducedInJs = markupSources.some((m) => /prefers-reduced-motion/.test(m.src)) || files.some((f) => /\.js$/.test(f));
const scriptsReduce = (() => { // look into local scripts the pages load
  for (const m of markupSources) for (const s of m.src.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
    if (/^(https?:)?\/\//.test(s[1])) continue;
    const p = resolve(dirname(m.file), s[1]);
    if (existsSync(p) && /prefers-reduced-motion/.test(readFileSync(p, "utf8"))) return true;
  }
  return false;
})();
if (!isUrl && moves && !/prefers-reduced-motion/i.test(allCss) && !reducedInJs && !scriptsReduce) {
  add("FAIL", "reduced-motion", "css", "the page moves and nothing answers prefers-reduced-motion", "Add @media (prefers-reduced-motion: reduce) and keep every text visible without the motion.");
}
if (!isUrl && /<(a|button|input|select|textarea)\b/i.test(allMarkup) && cssSources.length && !/:focus-visible/.test(allCss)) {
  add("FAIL", "focus-visible", "css", "interactive elements and no :focus-visible rule", "Give every link, button and field a visible :focus-visible style, from the palette.");
}

// The tells the code shows (anti-patterns.md). WARN: fix, or a reason under Waivers.
const hardShadows = allDecls.filter((d) => d.prop === "box-shadow" && d.value.split(/,(?![^(]*\))/).some((s) => {
  const n = stripVars(s).replace(/\b(inset)\b/, "").match(/-?[\d.]+(px|rem|em)?/g) || [];
  return n.length >= 2 && (n.length === 2 || parseFloat(n[2]) === 0) && (parseFloat(n[0]) !== 0 || parseFloat(n[1]) !== 0);
}));
if (hardShadows.length >= 3) add("WARN", "hard-shadows", at(hardShadows[0]), `${hardShadows.length} box-shadows with no blur`, "Depth from the reference's light, on the one element that must stand apart.", "Hard shadows and boxes everywhere");

const hue = (hex) => {
  let h = hex.replace("#", ""); if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (!d || max < 0.15) return null;
  let x = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (x * 60 + 360) % 360;
};
const tokens = Object.fromEntries(allDecls.filter((d) => d.prop.startsWith("--")).map((d) => [d.prop, d.value]));
const resolveVars = (v) => v.replace(/var\((--[\w-]+)[^)]*\)/g, (_, n) => tokens[n] || "");
for (const d of allDecls) {
  if (!/gradient\(/i.test(d.value)) continue;
  const hues = (resolveVars(d.value).match(/#[0-9a-f]{3,6}\b/gi) || []).map(hue).filter((h) => h !== null);
  if (hues.some((h) => h >= 195 && h < 255) && hues.some((h) => h >= 255 && h < 320)) {
    add("WARN", "purple-blue", at(d), `${d.prop}: ${d.value.slice(0, 80)}`, "Colour from the brief's real reference; never purple to blue.", "Purple or blue gradient");
  }
  if (/repeating-(linear|radial)-gradient/i.test(d.value) || /radial-gradient\([^)]*\b1px\b/i.test(d.value)) {
    add("WARN", "grid-background", at(d), `${d.prop}: ${d.value.slice(0, 80)}`, "Texture, photo, flat colour or empty space instead of a pattern.", "Grid background");
  }
}
const glows = allDecls.filter((d) => (d.prop === "text-shadow" && /(\d{2,})px/.test(d.value) && parseInt(d.value.match(/(\d+)px/g)?.[2] || 0) >= 10) || (d.prop === "box-shadow" && /^0\s+0\s+(1[2-9]|[2-9]\d)px/.test(d.value.trim())));
if (glows.length >= 3) add("WARN", "glow", at(glows[0]), `${glows.length} glows`, "Contrast of colour and size; an effect on one element only.", "Glow on everything");

const DEFAULT_FACES = /\b(Inter|Space Grotesk|Plus Jakarta Sans|DM Sans|Roboto)\b/;
const faceDecl = allDecls.find((d) => (d.prop === "font-family" || d.prop.startsWith("--font")) && DEFAULT_FACES.test(d.value));
if (faceDecl) add("WARN", "default-face", at(faceDecl), `${faceDecl.prop}: ${faceDecl.value}`, "A face with a reason from the reference, written in direction.md.", "Default type");

const monoLabels = allDecls.filter((d) => /^(font-family|font)$/.test(d.prop) && /mono/i.test(resolveVars(d.value) + d.value) && /\b(nav|button|btn|label|tag|chip|badge|kicker|eyebrow|cta|menu|caption)\b/i.test(d.chain.at(-1) || ""));
if (monoLabels.length) add("WARN", "mono-labels", at(monoLabels[0]), `${monoLabels.length} label/button/nav rules in monospace`, "The page's text face for labels; mono only for real code or tables.", "Spec-sheet dressing");

for (const m of markupSources) {
  const text = m.src.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ");
  const emoji = text.match(/\p{Extended_Pictographic}/gu)?.filter((e) => !/[©®™]/.test(e));
  if (emoji?.length) add("WARN", "emoji", rel(m.file), `emoji in the copy: ${[...new Set(emoji)].slice(0, 6).join(" ")}`, "Remove them; an icon from the page's own system if a marker is needed.", "Emoji in the copy");
  const nums = m.src.match(/>\s*0[1-9]\s*[.)]?\s*</g);
  if (nums && nums.length >= 3) add("WARN", "numbered", rel(m.file), `${nums.length} labels 01, 02, 03...`, "Number only a real sequence (steps, stages).", "01 / 02 / 03 on an unordered list");
  for (const h of m.src.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const it = h[2].match(/<(em|i)\b[^>]*>([^<]{1,40})<\/\1>/i);
    if (it && it[2].trim().split(/\s+/).length <= 3 && h[2].replace(/<[^>]+>/g, "").trim().split(/\s+/).length > 2) {
      add("WARN", "italic-word", `${rel(m.file)}:${lineAt(m.src, h.index)}`, `"${it[2].trim()}" in italic inside a roman heading`, "One voice per heading: the whole line in one style.", "Default type");
    }
  }
}

// The stamp: a page built by the flow records its decisions on line 1 of its CSS.
const projectRoot = (() => { let d = isUrl ? process.cwd() : resolve(target); if (existsSync(d) && statSync(d).isFile()) d = dirname(d); for (let i = 0; i < 6; i++) { if (existsSync(join(d, "design", "direction.md"))) return d; const up = dirname(d); if (up === d) break; d = up; } return null; })();
if (projectRoot && cssSources.length) {
  const main = cssSources.find((s) => s.offset === 0) || cssSources[0];
  const first = main.src.split("\n").find((l) => l.trim());
  if (!/^\/\*\s*super-webdesigner/i.test(first || "")) add("WARN", "stamp", rel(main.file) + ":1", "the CSS has no stamp on its first line", "Line 1: /* super-webdesigner · direction <X> \"<vibe>\" · job · faces · palette · motion · waivers */ (lint.md).");
}

// ---------- render tier ----------

const CHROMES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/snap/bin/chromium",
];

async function cdpBrowser() {
  const chrome = CHROMES.find((p) => p && existsSync(p));
  if (!chrome) throw new Error("no Chrome, Chromium or Edge found; set CHROME_PATH");
  if (typeof WebSocket === "undefined") throw new Error("needs Node 22 or newer (built-in WebSocket)");
  const profile = mkdtempSync(join(tmpdir(), "sloplint-"));
  const proc = spawn(chrome, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
  const wsUrl = await new Promise((ok, no) => {
    let err = "";
    const t = setTimeout(() => no(new Error("Chrome did not start")), 15000);
    proc.stderr.on("data", (b) => { err += b; const m = err.match(/ws:\/\/\S+/); if (m) { clearTimeout(t); ok(m[0]); } });
    proc.on("exit", () => no(new Error("Chrome exited: " + err.slice(0, 200))));
  });
  const ws = new WebSocket(wsUrl);
  await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
  let id = 0; const wait = new Map(); const listeners = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && wait.has(msg.id)) { const { ok, no } = wait.get(msg.id); wait.delete(msg.id); msg.error ? no(new Error(msg.error.message)) : ok(msg.result); }
    else listeners.forEach((l) => l(msg));
  };
  const send = (method, params = {}, sessionId) => new Promise((ok, no) => { const i = ++id; wait.set(i, { ok, no }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
  const close = () => { try { ws.close(); } catch {} proc.kill(); setTimeout(() => { try { rmSync(profile, { recursive: true, force: true }); } catch {} }, 500); };
  return { send, on: (l) => listeners.push(l), close };
}

// Runs inside the page at each width.
const MEASURE = `(() => {
  const vw = innerWidth, vh = innerHeight, de = document.documentElement;
  const out = { vw, scrollW: de.scrollWidth, culprits: [], cardInCard: [], widest: 0, words: 0, firstScreenWords: 0, sections: 0, h1Bottom: null };
  const name = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : '');
  const visible = (e) => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0; };
  if (out.scrollW > vw + 1) for (const e of document.body.querySelectorAll('*')) {
    const r = e.getBoundingClientRect();
    if (r.right > vw + 1 && r.width > 0 && visible(e)) { out.culprits.push(name(e) + ' ends at ' + Math.round(r.right) + 'px'); if (out.culprits.length >= 4) break; }
  }
  if (out.scrollW > vw + 1 && !out.culprits.length) out.culprits.push('no element: look at ::before/::after and transformed layers');
  const boxy = (e) => { if (/^(INPUT|BUTTON|SELECT|TEXTAREA|IMG|svg|A|LABEL)$/.test(e.tagName)) return false; const s = getComputedStyle(e); const bg = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent'; const edge = s.boxShadow !== 'none' || parseFloat(s.borderTopWidth) > 0 && parseFloat(s.borderLeftWidth) > 0; return bg && edge && parseFloat(s.borderTopLeftRadius) > 0 && parseFloat(s.paddingTop) >= 12; };
  const cards = [...document.querySelectorAll('div,article,section,li,aside,figure')].filter((e) => visible(e) && boxy(e));
  for (const c of cards) { const p = c.parentElement?.closest('div,article,section,li,aside,figure'); let a = c.parentElement; while (a && !cards.includes(a)) a = a.parentElement; if (a && out.cardInCard.length < 4) out.cardInCard.push(name(c) + ' inside ' + name(a)); }
  // Full-bleed backgrounds are fine; what must stay capped is the text and its grid.
  const range = document.createRange();
  for (const e of document.querySelectorAll('p, h1, h2, h3, li, blockquote')) {
    if (!visible(e) || !e.textContent.trim()) continue;
    range.selectNodeContents(e); const r = range.getBoundingClientRect();
    out.widest = Math.max(out.widest, Math.round(r.width));
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode, p = t.parentElement; if (!p || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.tagName) || !visible(p) || p.closest('[aria-hidden="true"]')) continue;
    const n = (t.textContent.match(/[\\p{L}\\p{N}]+/gu) || []).length; if (!n) continue; out.words += n;
    const r = p.getBoundingClientRect(); if (r.top + scrollY < vh && r.bottom > 0) out.firstScreenWords += n;
  }
  const main = document.querySelector('main') || document.body;
  // A wrapper that holds several sections counts as its sections, not as one.
  const tall = (e) => /^(SECTION|HEADER|FOOTER|ARTICLE|DIV)$/.test(e.tagName) && e.getBoundingClientRect().height > 120;
  const blocks = [...main.children].flatMap((e) => { const inner = [...e.children].filter((c) => c.tagName === 'SECTION' && tall(c)); return inner.length >= 2 ? inner : (tall(e) ? [e] : []); });
  out.sections = blocks.length + (document.querySelector('main') ? document.querySelectorAll('body > header, body > footer').length : 0);
  const h1 = document.querySelector('h1'); if (h1) out.h1Bottom = Math.round(h1.getBoundingClientRect().bottom + scrollY);
  return out;
})()`;

async function render(url) {
  const shots = opt("--shots");
  if (shots) mkdirSync(shots, { recursive: true });
  const b = await cdpBrowser();
  try {
    const { targetId } = await b.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await b.send("Target.attachToTarget", { targetId, flatten: true });
    const s = (m, p) => b.send(m, p, sessionId);
    const errors = [];
    b.on((msg) => { if (msg.sessionId === sessionId && msg.method === "Runtime.exceptionThrown") errors.push(msg.params.exceptionDetails?.exception?.description?.split("\n")[0] || "script error"); });
    await s("Page.enable"); await s("Runtime.enable");
    const results = {};
    for (const [w, h] of [[375, 812], [768, 1024], [1280, 800], [1440, 900], [1920, 1080]]) {
      await s("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
      await s("Emulation.setTouchEmulationEnabled", { enabled: w < 768 });
      const loaded = new Promise((ok) => { const t = setTimeout(ok, 15000); b.on((m) => { if (m.sessionId === sessionId && m.method === "Page.loadEventFired") { clearTimeout(t); ok(); } }); });
      await s("Page.navigate", { url });
      await loaded;
      // Scroll once so lazy content and scroll entrances run, then back to the top.
      await s("Runtime.evaluate", { expression: "new Promise(r=>{let y=0;const st=()=>{y+=innerHeight*0.8;scrollTo(0,y);if(y<document.documentElement.scrollHeight)setTimeout(st,60);else{setTimeout(()=>{scrollTo(0,0);setTimeout(r,400)},300)}};st()})", awaitPromise: true });
      const { result } = await s("Runtime.evaluate", { expression: MEASURE, returnByValue: true });
      results[w] = result.value;
      if (shots) {
        const { data } = await s("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
        writeFileSync(join(shots, `page-${w}.png`), Buffer.from(data, "base64"));
      }
    }
    for (const [w, r] of Object.entries(results)) {
      if (r.scrollW > r.vw + 1) add("FAIL", "horizontal-scroll", `render ${w}px`, `page is ${r.scrollW}px wide in a ${r.vw}px window${r.culprits.length ? ": " + r.culprits.join(", ") : ""}`, "Find the element that spills (often a 100vw, a grid track without minmax(0,1fr) or a long word) and contain it.");
    }
    const desk = results[1440];
    if (desk?.cardInCard.length) add("FAIL", "card-in-card", "render 1440px", desk.cardInCard.join("; "), "One surface per level: drop the inner box's background, border or shadow.");
    if (results[1920]?.widest > 1600) add("FAIL", "container-uncapped", "render 1920px", `content spans ${results[1920].widest}px at 1920`, "Cap the container (max-width around 75 to 90rem) and let the gutters grow.");
    if (desk) {
      if (desk.firstScreenWords > 80) add("WARN", "words-first-screen", "render 1440px", `${desk.firstScreenWords} words on the first screen`, "About 80 at most: the headline, one sentence and the actions carry the hero.");
      if (desk.words > 450) add("WARN", "words-page", "render 1440px", `${desk.words} visible words on the page`, "450 at most; fullness comes from scale and pictures, not more words.");
      if (desk.sections && (desk.sections < 5 || desk.sections > 9)) add("WARN", "sections", "render 1440px", `${desk.sections} sections, hero and footer included`, "Six to nine sections (five on a thin brief).");
    }
    if (errors.length) add("WARN", "script-error", "render", [...new Set(errors)].slice(0, 3).join(" | "), "A blocked CDN is the environment: serve the library locally and render again before reporting it.");
    return results;
  } finally { b.close(); }
}

let renderNote = null;
if (flag("--render")) {
  const url = isUrl ? target : (() => { const f = files.find((p) => /\.html?$/i.test(p)); return f ? pathToFileURL(f).href : null; })();
  if (!url) renderNote = "render skipped: no HTML page to open";
  else {
    try { await render(url); } catch (e) { renderNote = "render not run: " + e.message; }
  }
}

// ---------- report ----------

const shown = flag("--floor") ? findings.filter((f) => f.tier === "FAIL") : findings;
const fails = shown.filter((f) => f.tier === "FAIL").length;
const warns = shown.filter((f) => f.tier === "WARN").length;
const tells = [...new Set(findings.filter((f) => f.tell).map((f) => f.tell))];

if (flag("--json")) {
  process.stdout.write(JSON.stringify({ target, fails, warns, tells, renderNote, findings: shown }, null, 2));
} else {
  const label = isUrl ? target : files.map(rel).join(", ");
  console.log(`sloplint: ${label || target}`);
  if (renderNote) console.log(`  (${renderNote})`);
  for (const tier of ["FAIL", "WARN"]) for (const f of shown.filter((x) => x.tier === tier)) {
    console.log(`\n${tier} ${f.id}${f.tell ? ` [tell: ${f.tell}]` : ""}  ${f.where}\n  ${f.evidence}\n  -> ${f.fix}`);
  }
  console.log(`\n${fails} FAIL · ${warns} WARN · tells the code shows: ${tells.length ? tells.join(", ") : "none"}`);
  console.log(fails ? "Floor broken: fix every FAIL before the review goes on." : "Floor clean. WARNs: fix, or a reason under Waivers in design/direction.md.");
}
process.exit(fails ? 1 : 0);
