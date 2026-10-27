// node scripts/obsidian-tones.mjs <obsidian-logo-gradient.svg> 108 design/obsidian-logo-tones.json
// Samples the official Obsidian logo (obsidian.md/brand) into tones per cell: 0 = empty, 1..8 = its facets, dark to light.
// Needs sharp (npm i sharp). Then run scripts/obsidian-art.mjs to write the site.
import fs from "node:fs"; import sharp from "sharp";
const [svg, colsArg, out] = process.argv.slice(2); const COLS = +colsArg, CELL = 1.85;
const W = COLS * 10, H = W; // square logo
const { data } = await sharp(fs.readFileSync(svg), { density: 600 }).resize(W, H).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const cw = W / COLS, ch = cw * CELL, ROWS = Math.floor(H / ch);
const cells = [];
let lo = 1, hi = 0;
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  let a = 0, l = 0, n = 0;
  for (let y = Math.floor(r * ch); y < Math.floor((r + 1) * ch); y++) for (let x = Math.floor(c * cw); x < Math.floor((c + 1) * cw); x++) {
    const i = (y * W + x) * 4, al = data[i + 3] / 255; a += al; l += al * (0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]) / 255; n++;
  }
  a /= n; const lum = a > 0 ? l / n / a : 0;
  cells.push([a, lum]); if (a > 0.5) { lo = Math.min(lo, lum); hi = Math.max(hi, lum); }
}
const tones = [];
for (let r = 0; r < ROWS; r++) { let s = ""; for (let c = 0; c < COLS; c++) { const [a, lum] = cells[r * COLS + c]; s += a < 0.45 ? "0" : String(Math.max(1, Math.min(8, 1 + Math.round(((lum - lo) / (hi - lo)) * 7)))); } tones.push(s); }
// trim empty rows top and bottom
while (tones.length && /^0+$/.test(tones[0])) tones.shift(); while (tones.length && /^0+$/.test(tones.at(-1))) tones.pop();
fs.writeFileSync(out, JSON.stringify({ cols: COLS, cell: CELL, tones }));
console.log(COLS, tones.length, lo.toFixed(2), hi.toFixed(2));
console.log(tones.map((r) => r.replace(/0/g, " ").replace(/[12]/g, ".").replace(/[34]/g, ":").replace(/[56]/g, "o").replace(/7/g, "O").replace(/8/g, "@")).join("\n"));
