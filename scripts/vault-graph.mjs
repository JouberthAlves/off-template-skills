// Builds site/vault-graph.json for the "Explore the starter vault" view: every
// note of vault/ with its folder, its [[links]], a seeded force layout and its
// text as safe HTML for the side panel. The site loads it only when opened.
// Run after changing anything in vault/: node scripts/vault-graph.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
const vault = path.join(root, "vault");
const SKIP = /^(README|CLAUDE|AGENTS)\.md$/;

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (f.name.startsWith(".")) continue;
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (p.endsWith(".md") && !SKIP.test(f.name)) files.push(p);
  }
})(vault);
files.sort();

const names = files.map((f) => path.basename(f, ".md"));
const notes = files.map((f, i) => {
  const raw = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "");
  const rel = path.relative(vault, f).split(path.sep).join("/");
  return { name: names[i], path: rel, folder: rel.includes("/") ? rel.split("/")[0] : "", body };
});

// Links: [[Note]] outside code, both ways, once.
const edgeSet = new Set();
notes.forEach((n, i) => {
  for (const m of n.body.replace(/```[\s\S]*?```/g, "").matchAll(/\[\[([^\]|#]+)/g)) {
    const j = names.indexOf(m[1].trim());
    if (j >= 0 && j !== i) edgeSet.add([Math.min(i, j), Math.max(i, j)].join(","));
  }
});
const edges = [...edgeSet].map((e) => e.split(",").map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
const deg = names.map((_, i) => edges.filter((e) => e.includes(i)).length);

// Seeded force layout in a box ASPECT wide and 1 tall, fitted to 0..1 both ways.
// Two of them: a wide one for desktop, a tall one for phones.
function layoutFor(ASPECT, seed0) {
  let seed = seed0;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pos = names.map(() => [0.2 + rand() * (ASPECT - 0.4), 0.2 + rand() * 0.6]);
  const N = 1400, sx = ASPECT >= 1 ? 1 : 1.25, sy = ASPECT >= 1 ? 1.25 : 1;
  for (let it = 0; it < N; it++) {
    const f = pos.map(() => [0, 0]);
    for (let i = 0; i < pos.length; i++)
      for (let j = i + 1; j < pos.length; j++) {
        const dx = (pos[i][0] - pos[j][0]) * sx, dy = (pos[i][1] - pos[j][1]) * sy;
        const d2 = Math.max(dx * dx + dy * dy, 1e-4), k = 0.0032 / d2;
        f[i][0] += dx * k; f[i][1] += dy * k; f[j][0] -= dx * k; f[j][1] -= dy * k;
      }
    for (const [a, b] of edges) {
      const dx = pos[b][0] - pos[a][0], dy = pos[b][1] - pos[a][1], d = Math.hypot(dx, dy) || 1e-3;
      const k = (d - 0.3) * 0.03;
      f[a][0] += (dx / d) * k; f[a][1] += (dy / d) * k; f[b][0] -= (dx / d) * k; f[b][1] -= (dy / d) * k;
    }
    const t = 1 - it / N;
    pos.forEach((p, i) => {
      f[i][0] += (ASPECT / 2 - p[0]) * 0.008; f[i][1] += (0.5 - p[1]) * 0.008;
      p[0] += Math.max(-0.03, Math.min(0.03, f[i][0])) * t;
      p[1] += Math.max(-0.03, Math.min(0.03, f[i][1])) * t;
    });
  }
  const xs = pos.map((p) => p[0]), ys = pos.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return pos.map(([x, y]) => [+((x - x0) / (x1 - x0)).toFixed(4), +((y - y0) / (y1 - y0)).toFixed(4)]);
}
const ASPECT = 1.7;
const layout = layoutFor(ASPECT, 3), tallLayout = layoutFor(0.5, 5);

// Markdown to safe HTML: enough for these notes (headings, lists, tables, code, bold, links).
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = esc(s);
  s = s.replace(/\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g, (_, n, label) => {
    const name = n.trim(), text = (label || name).trim();
    return names.includes(name.replace(/&amp;/g, "&")) ? `<button type="button" class="vlink" data-note="${name}">${text}</button>` : `<span class="vlink-missing">${text}</span>`;
  });
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(])_([^_]+)_(?=[\s).,;:]|$)/g, "$1<em>$2</em>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
}
function md(src) {
  const lines = src.split("\n"), out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      const buf = [];
      for (i++; i < lines.length && !/^```/.test(lines[i]); i++) buf.push(lines[i]);
      i++; out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`); continue;
    }
    const h = /^(#{1,4})\s+(.*)/.exec(l);
    if (h) { const lv = Math.min(4, h[1].length + 1); out.push(`<h${lv}>${inline(h[2])}</h${lv}>`); i++; continue; }
    if (/^\|/.test(l)) {
      const rows = [];
      for (; i < lines.length && /^\|/.test(lines[i]); i++) if (!/^\|[\s|:-]+\|$/.test(lines[i])) rows.push(lines[i].replace(/^\||\|$/g, "").split("|").map((c) => inline(c.trim())));
      out.push(`<table>${rows.map((r, k) => `<tr>${r.map((c) => (k ? `<td>${c}</td>` : `<th>${c}</th>`)).join("")}</tr>`).join("")}</table>`); continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(l)) {
      const ordered = /^\s*\d+\./.test(l), items = [];
      for (; i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i]); i++) {
        let item = lines[i].replace(/^\s*([-*]|\d+\.)\s+/, "");
        while (i + 1 < lines.length && /^\s{2,}\S/.test(lines[i + 1]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i + 1])) item += " " + lines[++i].trim();
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(ordered ? `<ol>${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`); continue;
    }
    if (!l.trim()) { i++; continue; }
    const buf = [l];
    for (i++; i < lines.length && lines[i].trim() && !/^(#|```|\||\s*([-*]|\d+\.)\s)/.test(lines[i]); i++) buf.push(lines[i]);
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}

const data = {
  aspect: ASPECT,
  nodes: notes.map((n, i) => ({ name: n.name, path: n.path, folder: n.folder, deg: deg[i], x: layout[i][0], y: layout[i][1], tx: tallLayout[i][0], ty: tallLayout[i][1], html: md(n.body.replace(/^\s*#\s+.*\n/, "")) })),
  edges,
};
fs.writeFileSync(path.join(root, "site/vault-graph.json"), JSON.stringify(data));
console.log(`${data.nodes.length} notes, ${edges.length} links, ${(JSON.stringify(data).length / 1024).toFixed(1)} KB`);
const W = 100, H = Math.round(W / ASPECT / 2);
const grid = Array.from({ length: H }, () => Array(W).fill(" "));
data.nodes.forEach((n, i) => { const c = Math.round(n.x * (W - 14)), r = Math.round(n.y * (H - 1)); n.name.slice(0, 14).split("").forEach((ch, k) => (grid[r][c + k] = ch)); });
console.log(grid.map((r) => r.join("")).join("\n"));
