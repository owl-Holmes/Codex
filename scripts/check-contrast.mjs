// Checks WCAG AA contrast (≥ 4.5:1) of key token pairs for the base design and every theme,
// in light and dark mode. Themes inherit base tokens and only override some of them.
// Usage: npm run contrast   (exit code 1 on failure)
import { readFileSync, readdirSync } from 'node:fs';

const MIN = 4.5;
const PAIRS = [
  ['--color-text', '--color-bg'],
  ['--color-text', '--color-surface'],
  ['--color-muted', '--color-bg'],
  ['--color-muted', '--color-surface'],
  ['--color-accent', '--color-bg'],
  ['--color-accent', '--color-surface'],
  ['--color-accent-contrast', '--color-accent'],
  ...['definition', 'remember', 'warning', 'example', 'tip'].map((c) => [`--callout-${c}`, '--color-surface']),
];

/** Innermost CSS blocks as { selector, vars } (hex colors only). */
function blocks(css) {
  return [...css.matchAll(/([^{};]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
    selector: selector.trim(),
    vars: Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{3,6})\b/gi)].map((m) => [m[1], m[2]])),
  }));
}

function luminance(hex) {
  const h = hex.length === 4 ? hex.replace(/[0-9a-f]/gi, '$&$&').slice(1) : hex.slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const base = blocks(readFileSync('src/styles/tokens.css', 'utf8'));
const light = base.find((b) => b.selector === ':root').vars;
const dark = { ...light, ...base.find((b) => b.selector.includes("data-mode='dark'")).vars };
const sets = [
  ['base', 'light', light],
  ['base', 'dark', dark],
];
for (const file of readdirSync('src/themes').filter((f) => f.endsWith('.css') && f !== 'themes.css')) {
  const name = file.replace('.css', '');
  for (const b of blocks(readFileSync(`src/themes/${file}`, 'utf8'))) {
    const isDark = b.selector.includes("data-mode='dark'");
    sets.push([name, isDark ? 'dark' : 'light', { ...(isDark ? dark : light), ...b.vars }]);
  }
}

const failures = [];
for (const [theme, mode, vars] of sets) {
  for (const [fg, bg] of PAIRS) {
    const r = ratio(vars[fg], vars[bg]);
    if (r < MIN) failures.push(`${theme} (${mode}): ${fg} on ${bg} = ${r.toFixed(2)}:1`);
  }
}
if (failures.length) {
  console.error(`✗ ${failures.length} contrast pair(s) below ${MIN}:1\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${sets.length} theme/mode combinations pass WCAG AA (${PAIRS.length} pairs each).`);
