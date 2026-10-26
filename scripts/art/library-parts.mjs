// Building blocks of the library background (used by scripts/art/library.mjs): gradients,
// one book spine, the Victorian crown and the rolling ladder. Each returns SVG markup strings.
import { r1 } from './svg-kit.mjs';

/** Leather colours of the book spines. */
export const LEATHERS = [
  '#5c1d14',
  '#6e2a19',
  '#43281a',
  '#2c3b2b',
  '#1d3240',
  '#7b4a1e',
  '#4b1c2b',
  '#55331c',
  '#26382a',
  '#6a3922',
  '#331f15',
  '#1b2a36',
  '#7d2e1f',
  '#3a2a4a',
  '#5f4b1f',
  '#2e1a12',
];

/** Shared <defs>: spine shading, gilt, wood, walls, lamp light and vignette. */
export const DEFS = [
  `<linearGradient id="hl" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset=".38" stop-color="#ffe9c0" stop-opacity=".2"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient>`,
  `<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1d18a"/><stop offset=".5" stop-color="#b8883a"/><stop offset="1" stop-color="#6e4c1c"/></linearGradient>`,
  `<linearGradient id="board" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a33"/><stop offset=".25" stop-color="#5e3b20"/><stop offset="1" stop-color="#2e1c0f"/></linearGradient>`,
  `<linearGradient id="back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a07"/><stop offset=".7" stop-color="#0d1a12"/><stop offset="1" stop-color="#16241a"/></linearGradient>`,
  `<linearGradient id="pil" x1="0" x2="1"><stop offset="0" stop-color="#1e120a"/><stop offset=".3" stop-color="#6b4325"/><stop offset=".45" stop-color="#8d5c33"/><stop offset=".7" stop-color="#4a2d17"/><stop offset="1" stop-color="#150c06"/></linearGradient>`,
  `<linearGradient id="crown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2414"/><stop offset=".4" stop-color="#7a4f2b"/><stop offset=".6" stop-color="#4a2e18"/><stop offset="1" stop-color="#1a0f08"/></linearGradient>`,
  `<linearGradient id="shadowUnder" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>`,
  `<radialGradient id="lamp" cx=".5" cy=".18" r=".75"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".28"/><stop offset=".45" stop-color="#ff9a3c" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`,
  `<radialGradient id="vig" cx=".5" cy=".45" r=".8"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient>`,
  `<linearGradient id="rail" x1="0" x2="1"><stop offset="0" stop-color="#3b2312"/><stop offset=".5" stop-color="#9a6a3c"/><stop offset="1" stop-color="#3b2312"/></linearGradient>`,
];

/** Returns a function drawing one standing spine (raised gilt bands, title label) with the given random source. */
export function bookDrawer(rnd) {
  return (x, base, w, h, ci) => {
    const y = base - h;
    const out = [`<rect x="${x}" y="${r1(y)}" width="${w}" height="${r1(h)}" rx="1.2" fill="${LEATHERS[ci]}"/>`];
    out.push(`<rect x="${x}" y="${r1(y)}" width="${w}" height="${r1(h)}" fill="url(#hl)"/>`);
    if (rnd() > 0.2) {
      const bands = 2 + Math.floor(rnd() * 3);
      const top = y + 10;
      const bot = base - 12;
      for (let b = 0; b < bands; b++) {
        if (b === 1 && bands > 2) continue;
        const by = top + ((bot - top) * (b + 0.5)) / bands;
        out.push(`<rect x="${x + 0.5}" y="${r1(by)}" width="${w - 1}" height="2.2" fill="url(#gold)" opacity=".85"/>`);
        out.push(`<rect x="${x + 0.5}" y="${r1(by + 2.2)}" width="${w - 1}" height="1" fill="#000" opacity=".35"/>`);
      }
      if (w >= 16 && rnd() > 0.25) {
        const ly = y + 22 + rnd() * 10;
        const lh = 18 + rnd() * 26;
        const labels = ['#1a0d08', '#3a1210', '#0f1c14', '#121a24'];
        const lc = labels[Math.floor(rnd() * labels.length)];
        const label = `x="${x + 2.5}" y="${r1(ly)}" width="${w - 5}" height="${r1(lh)}"`;
        out.push(`<rect ${label} fill="${lc}" opacity=".85"/>`);
        out.push(`<rect ${label} fill="none" stroke="#c99a4a" stroke-width=".7" opacity=".8"/>`);
        for (let t = 0; t < 3; t++) {
          const ty = ly + 5 + t * 5;
          if (ty > ly + lh - 3) break;
          const tw = (w - 9) * (0.5 + rnd() * 0.5);
          out.push(
            `<rect x="${r1(x + w / 2 - tw / 2)}" y="${r1(ty)}" width="${r1(tw)}" height="1.4" fill="#e3bd6d" opacity=".8"/>`,
          );
        }
      }
    } else {
      out.push(
        `<rect x="${x + 1}" y="${r1(y + 6)}" width="${w - 2}" height="${r1(h - 12)}" fill="none" stroke="#c99a4a" stroke-width=".6" opacity=".55"/>`,
      );
    }
    out.push(`<rect x="${x}" y="${r1(y)}" width="${w}" height="2" fill="#fff" opacity=".08"/>`);
    return out.join('');
  };
}

/** Victorian crown: frieze, dentils, blind arcade with keystones and rosettes, cornice, pilaster capitals. */
export function crown(W, TOP, pilasters, PIL) {
  const b = [`<rect x="0" y="0" width="${W}" height="${TOP - 10}" fill="url(#crown)"/>`];
  b.push(`<rect x="0" y="0" width="${W}" height="34" fill="#140b06"/>`);
  for (let i = 0; i < 3; i++)
    b.push(`<rect x="0" y="${22 + i * 6}" width="${W}" height="2" fill="#d6a565" opacity="${0.15 + i * 0.08}"/>`);
  for (let x = 0; x < W; x += 14)
    b.push(
      `<rect x="${x}" y="40" width="8" height="10" fill="#2a180c"/><rect x="${x}" y="40" width="8" height="2" fill="#c08a55" opacity=".35"/>`,
    );
  const AW = 80;
  const top = 70;
  const base = TOP - 22;
  for (let x = 10; x < W; x += AW) {
    const cx = x + AW / 2;
    const arch = (inset) =>
      `M${x + inset} ${base} V${top + 30} A${AW / 2 - inset} ${AW / 2 - inset} 0 0 1 ${x + AW - inset} ${top + 30} V${base}`;
    b.push(`<path d="${arch(8)} Z" fill="#0b0604" stroke="#7a4f2b" stroke-width="2"/>`);
    b.push(`<path d="${arch(13)}" fill="none" stroke="#d6a565" stroke-opacity=".25"/>`);
    b.push(`<path d="M${cx - 5} ${top - 2} h10 l-3 12 h-4 z" fill="#b8883a" opacity=".8"/>`);
    b.push(
      `<circle cx="${x}" cy="${top + 20}" r="6" fill="#4a2e18" stroke="#d6a565" stroke-opacity=".5"/><circle cx="${x}" cy="${top + 20}" r="2.5" fill="#d6a565" opacity=".6"/>`,
    );
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3;
      const [px, py] = [r1(x + Math.cos(a) * 4), r1(top + 20 + Math.sin(a) * 4)];
      b.push(
        `<ellipse cx="${px}" cy="${py}" rx="2" ry="1" fill="#d6a565" opacity=".35" transform="rotate(${r1((a * 180) / Math.PI)} ${px} ${py})"/>`,
      );
    }
  }
  b.push(`<rect x="0" y="${TOP - 24}" width="${W}" height="14" fill="url(#board)"/>`);
  b.push(`<rect x="0" y="${TOP - 10}" width="${W}" height="10" fill="url(#board)"/>`);
  for (const px of pilasters) {
    b.push(
      `<rect x="${px - 6}" y="${TOP - 34}" width="${PIL + 12}" height="14" rx="2" fill="#6b4325"/><rect x="${px - 6}" y="${TOP - 34}" width="${PIL + 12}" height="3" fill="#d6a565" opacity=".35"/>`,
    );
    b.push(
      `<circle cx="${px + PIL / 2}" cy="${TOP + 40}" r="11" fill="#3a2414" stroke="#d6a565" stroke-opacity=".45" stroke-width="1.5"/><circle cx="${px + PIL / 2}" cy="${TOP + 40}" r="4" fill="#b8883a" opacity=".7"/>`,
    );
  }
  return b.join('');
}

/** Rolling library ladder leaning from (lx, ltop) down to the floor at `lbot`. */
export function ladder(lx, ltop, lbot, lw = 90, lean = 120) {
  const rail = (x) =>
    `<line x1="${x}" y1="${ltop}" x2="${x + lean}" y2="${lbot}" stroke="url(#rail)" stroke-width="12"/>`;
  const b = [`<g>${rail(lx)}${rail(lx + lw)}`];
  for (let y = ltop + 60; y < lbot; y += 64) {
    const rx = r1(lx + lean * ((y - ltop) / (lbot - ltop)));
    b.push(
      `<rect x="${rx}" y="${y}" width="${lw}" height="7" rx="2" fill="#7a4f2b"/><rect x="${rx}" y="${y}" width="${lw}" height="2" fill="#c08a55" opacity=".6"/>`,
    );
  }
  b.push(`<rect x="${lx - 10}" y="${ltop - 10}" width="${lw + 20}" height="8" rx="3" fill="#b8883a"/></g>`);
  return b.join('');
}
