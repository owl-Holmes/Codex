// Generates the default page background src/assets/images/backgrounds/library.svg: a Victorian library
// wall (carved crown with arcades and rosettes, green walls, pilasters, shelves of shaded leather spines
// with raised bands and labels, leaning books, flat stacks, ladder, lamp light and vignette).
// Deterministic (seeded): re-running gives the same file. Usage: npm run art:backgrounds
import { writeFileSync } from 'node:fs';
import { DEFS, LEATHERS, bookDrawer, crown, ladder } from './library-parts.mjs';
import { r1, seeded } from './svg-kit.mjs';

const rnd = seeded(42);
const book = bookDrawer(rnd);
const leather = () => Math.floor(rnd() * LEATHERS.length);
const [W, H] = [1920, 1200];
const [TOP, ROW, BOARD, PIL] = [190, 182, 18, 46];
const PILASTERS = [0, 620, 1260, W - PIL];
const BAYS = [
  [PIL, 620],
  [620 + PIL, 1260],
  [1260 + PIL, W - PIL],
];
const body = [`<rect width="${W}" height="${H}" fill="url(#back)"/>`];

/** A pile of books lying flat; returns its width. */
function stack(x, base) {
  let sy = base;
  const sw = 70 + rnd() * 40;
  const n = 3 + Math.floor(rnd() * 4);
  for (let k = 0; k < n; k++) {
    const th = 9 + rnd() * 8;
    const ww = sw - rnd() * 18;
    const ci = leather();
    const bx = x + rnd() * 8;
    const box = `x="${r1(bx)}" y="${r1(sy - th)}"`;
    body.push(`<rect ${box} width="${r1(ww)}" height="${r1(th)}" rx="1.5" fill="${LEATHERS[ci]}"/>`);
    body.push(`<rect ${box} width="${r1(ww)}" height="${r1(th / 2.5)}" fill="#fff" opacity=".08"/>`);
    for (const gx of [bx + ww - 10, bx + 8])
      body.push(`<rect x="${r1(gx)}" y="${r1(sy - th)}" width="2" height="${r1(th)}" fill="url(#gold)" opacity=".7"/>`);
    sy -= th;
  }
  return sw + 14;
}

for (let r = 0; r < Math.floor((H - TOP) / ROW) + 1; r++) {
  const base = TOP + (r + 1) * ROW - BOARD;
  const maxH = ROW - BOARD - 14;
  for (const [x0, x1] of BAYS) {
    let x = x0 + 4;
    while (x < x1 - 10) {
      const roll = rnd();
      if (roll < 0.035 && x1 - x > 120) {
        x += stack(x, base);
        continue;
      }
      if (roll < 0.06 && x1 - x > 60) {
        // A gap with one book leaning against its neighbour.
        const w = 16 + rnd() * 8;
        const h = maxH * (0.7 + rnd() * 0.25);
        const ci = leather();
        const ang = 14 + rnd() * 10;
        body.push(`<g transform="rotate(${r1(ang)} ${r1(x + w)} ${base})">${book(r1(x + 2), base, r1(w), h, ci)}</g>`);
        x += w + h * Math.sin((ang * Math.PI) / 180) + 4;
        continue;
      }
      let w = Math.round(11 + rnd() * 16);
      if (x + w > x1 - 4) w = Math.floor(x1 - 4 - x);
      if (w < 7) break;
      const h = maxH * (0.62 + rnd() * 0.38);
      body.push(book(Math.round(x), base, w, h, leather()));
      x += w + (rnd() > 0.9 ? 2 : 0.6);
    }
  }
  body.push(`<rect x="0" y="${base}" width="${W}" height="${BOARD}" fill="url(#board)"/>`);
  body.push(`<rect x="0" y="${base}" width="${W}" height="1.5" fill="#c08a55" opacity=".6"/>`);
  body.push(`<rect x="0" y="${base + BOARD}" width="${W}" height="16" fill="url(#shadowUnder)"/>`);
}
for (const px of PILASTERS) {
  body.push(`<rect x="${px}" y="0" width="${PIL}" height="${H}" fill="url(#pil)"/>`);
  for (let y = TOP + 30; y < H; y += 120)
    body.push(
      `<rect x="${px + 10}" y="${y}" width="${PIL - 20}" height="80" rx="3" fill="none" stroke="#000" stroke-opacity=".35"/><rect x="${px + 11}" y="${y + 1}" width="${PIL - 22}" height="78" rx="3" fill="none" stroke="#d29a5c" stroke-opacity=".18"/>`,
    );
}
body.push(crown(W, TOP, PILASTERS, PIL));
body.push(ladder(1380, TOP - 30, H));
body.push(`<rect width="${W}" height="${H}" fill="url(#lamp)"/>`);
body.push(`<rect width="${W}" height="${H}" fill="url(#vig)"/>`);

writeFileSync(
  'src/assets/images/backgrounds/library.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${DEFS.join('')}</defs>${body.join('')}</svg>\n`,
);
