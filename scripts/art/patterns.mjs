// Generates the themed page backgrounds in src/assets/images/backgrounds/: celestial chart (alchemy theme,
// sciences), damask wallpaper (noir theme, investigation) and encaustic tiles (archive theme, history).
// Deterministic (seeded): re-running gives the same files. Usage: npm run art:backgrounds
import { writeFileSync } from 'node:fs';
import { r1, seeded } from './svg-kit.mjs';

const out = 'src/assets/images/backgrounds';
/** Multiplies every opacity of an SVG string (capped at 1), to tune how visible a drawing is. */
const boost = (svg, k) =>
  svg.replace(
    /(stroke-opacity|opacity)="([0-9.]+)"/g,
    (_, a, v) => `${a}="${Math.min(1, Math.round(v * k * 100) / 100)}"`,
  );
const rnd = seeded(11);

// ---------- Celestial chart (single image, cover) ----------
{
  const W = 1920,
    H = 1200,
    b = [];
  b.push(
    `<defs><radialGradient id="sky" cx=".6" cy=".4" r=".9"><stop offset="0" stop-color="#12302e"/><stop offset=".6" stop-color="#0a1a1c"/><stop offset="1" stop-color="#040a0b"/></radialGradient></defs>`,
  );
  b.push(`<rect width="${W}" height="${H}" fill="url(#sky)"/>`);
  const stars = [];
  for (let i = 0; i < 520; i++) {
    const x = rnd() * W,
      y = rnd() * H,
      r = rnd() < 0.92 ? 0.6 + rnd() * 0.9 : 1.6 + rnd() * 1.4;
    stars.push([x, y]);
    b.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="#f6e3b4" opacity="${r1(0.35 + rnd() * 0.6)}"/>`);
  }
  // constellations: chain nearby bright stars
  for (let c = 0; c < 9; c++) {
    let [x, y] = [rnd() * W, rnd() * H];
    const pts = [[x, y]];
    for (let k = 0; k < 4 + Math.floor(rnd() * 3); k++) {
      x += (rnd() - 0.5) * 160;
      y += (rnd() - 0.5) * 120;
      pts.push([x, y]);
    }
    b.push(
      `<polyline points="${pts.map(([a, c2]) => `${r1(a)},${r1(c2)}`).join(' ')}" fill="none" stroke="#d9b56a" stroke-opacity=".35" stroke-width="1"/>`,
    );
    pts.forEach(([a, c2]) => b.push(`<circle cx="${r1(a)}" cy="${r1(c2)}" r="2.6" fill="#f6e3b4"/>`));
  }
  // astrolabe
  const cx = 1340,
    cy = 560,
    g = '#d9b56a';
  const ring = (r, w = 1, o = 0.5) =>
    b.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${g}" stroke-width="${w}" stroke-opacity="${o}"/>`,
    );
  [430, 420, 360, 352, 300, 210, 120, 40].forEach((r, i) => ring(r, i < 2 ? 2 : 1, i < 2 ? 0.55 : 0.4));
  for (let a = 0; a < 360; a += 2) {
    const len = a % 30 === 0 ? 22 : a % 10 === 0 ? 14 : 7;
    const t = (a * Math.PI) / 180;
    b.push(
      `<line x1="${r1(cx + Math.cos(t) * 420)}" y1="${r1(cy + Math.sin(t) * 420)}" x2="${r1(cx + Math.cos(t) * (420 - len))}" y2="${r1(cy + Math.sin(t) * (420 - len))}" stroke="${g}" stroke-opacity=".5"/>`,
    );
  }
  for (let k = 0; k < 12; k++) {
    const t = (k * Math.PI) / 6;
    b.push(
      `<line x1="${r1(cx + Math.cos(t) * 300)}" y1="${r1(cy + Math.sin(t) * 300)}" x2="${r1(cx + Math.cos(t) * 360)}" y2="${r1(cy + Math.sin(t) * 360)}" stroke="${g}" stroke-opacity=".5"/>`,
    );
    const m = t + Math.PI / 12;
    b.push(
      `<circle cx="${r1(cx + Math.cos(m) * 330)}" cy="${r1(cy + Math.sin(m) * 330)}" r="7" fill="none" stroke="${g}" stroke-opacity=".45"/>`,
    );
  }
  b.push(
    `<ellipse cx="${cx}" cy="${cy - 40}" rx="300" ry="190" fill="none" stroke="${g}" stroke-opacity=".4" stroke-dasharray="6 6"/>`,
  );
  for (let k = 0; k < 8; k++) {
    const t = (k * Math.PI) / 4;
    b.push(
      `<line x1="${cx}" y1="${cy}" x2="${r1(cx + Math.cos(t) * 300)}" y2="${r1(cy + Math.sin(t) * 300)}" stroke="${g}" stroke-opacity=".22"/>`,
    );
  }
  b.push(
    `<path d="M${cx} ${cy - 330} L${cx + 14} ${cy} L${cx} ${cy + 40} L${cx - 14} ${cy} Z" fill="${g}" opacity=".35"/>`,
  );
  // second small orrery bottom-left
  [
    [300, 900, 160],
    [300, 900, 110],
    [300, 900, 60],
  ].forEach(([x, y, r]) =>
    b.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${g}" stroke-opacity=".35"/>`),
  );
  b.push(
    `<circle cx="300" cy="900" r="14" fill="${g}" opacity=".5"/><circle cx="410" cy="900" r="7" fill="${g}" opacity=".5"/><circle cx="300" cy="740" r="9" fill="${g}" opacity=".5"/><circle cx="257" cy="943" r="5" fill="${g}" opacity=".5"/>`,
  );
  b.push(
    `<rect width="${W}" height="${H}" fill="none" stroke="${g}" stroke-opacity=".3" stroke-width="2" transform="translate(30 30) scale(${(W - 60) / W} ${(H - 60) / H})"/>`,
  );
  writeFileSync(
    `${out}/celestial.svg`,
    boost(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${b.join('')}</svg>\n`,
      1.6,
    ),
  );
}

// ---------- Damask wallpaper (tile, half-drop) ----------
{
  const W = 160,
    H = 220;
  const half = `
    <path d="M0 -92 C22 -72 50 -48 50 -4 C50 40 24 66 0 92" fill="none" stroke-width="2.2"/>
    <path d="M0 -70 C14 -55 30 -38 30 -6 C30 24 14 42 0 58" fill="none" stroke-width="1.2"/>
    <path d="M0 -52 C12 -40 18 -24 2 -6 C14 -12 20 -2 12 8 C6 14 0 12 0 12 Z"/>
    <path d="M0 14 C10 24 14 38 0 54 C7 42 5 28 0 14 Z"/>
    <path d="M14 30 c16 -6 28 4 20 18 c-6 9 -17 6 -15 -2 c2 -5 8 -4 8 0" fill="none" stroke-width="1.6"/>
    <path d="M22 -40 c14 2 22 14 14 24 c-5 6 -13 2 -10 -4" fill="none" stroke-width="1.4"/>
    <circle cx="0" cy="-80" r="4"/><circle cx="0" cy="70" r="3.5"/>
    <path d="M50 -4 c10 -2 16 6 10 12 c-4 4 -9 0 -6 -3"  fill="none" stroke-width="1.4"/>`;
  const motif = (x, y) =>
    `<g transform="translate(${x} ${y})"><g>${half}</g><g transform="scale(-1 1)">${half}</g></g>`;
  const body = [motif(W / 2, H / 2), motif(0, 0), motif(W, 0), motif(0, H), motif(W, H)].join('');
  writeFileSync(
    `${out}/damask.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#17191b"/><g fill="#4a3d26" stroke="#6b5631" opacity=".9">${body}</g></svg>\n`,
  );
}

// ---------- Encaustic tiles (tile) ----------
{
  const S = 120,
    c = S / 2,
    gold = '#c9a35a';
  const b = [`<rect width="${S}" height="${S}" fill="#2a0f10"/>`];
  b.push(`<rect x="2" y="2" width="${S - 4}" height="${S - 4}" fill="none" stroke="#4a1c1d" stroke-width="2"/>`);
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ])
    b.push(
      `<circle cx="${c + dx * 20}" cy="${c + dy * 20}" r="22" fill="#3d1517" stroke="${gold}" stroke-opacity=".55" stroke-width="1.5"/>`,
    );
  b.push(
    `<rect x="${c - 18}" y="${c - 18}" width="36" height="36" fill="#541d1f" stroke="${gold}" stroke-opacity=".6" transform="rotate(45 ${c} ${c})"/>`,
  );
  b.push(
    `<circle cx="${c}" cy="${c}" r="9" fill="${gold}" opacity=".55"/><circle cx="${c}" cy="${c}" r="4" fill="#2a0f10"/>`,
  );
  for (const [x, y] of [
    [0, 0],
    [S, 0],
    [0, S],
    [S, S],
  ]) {
    b.push(
      `<circle cx="${x}" cy="${y}" r="18" fill="#1d4140" stroke="${gold}" stroke-opacity=".5"/><circle cx="${x}" cy="${y}" r="7" fill="${gold}" opacity=".45"/>`,
    );
  }
  for (const [x, y] of [
    [c, 0],
    [c, S],
    [0, c],
    [S, c],
  ])
    b.push(`<path d="M${x - 6} ${y} L${x} ${y - 6} L${x + 6} ${y} L${x} ${y + 6} Z" fill="${gold}" opacity=".4"/>`);
  writeFileSync(
    `${out}/tiles.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${b.join('')}</svg>\n`,
  );
}
