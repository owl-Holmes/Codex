/**
 * Data loading and geometry for the Chart component (rendered to static SVG at build time).
 * Data files live in src/assets/data/ as CSV (header row, comma-separated) or JSON (array of objects).
 */
const files = import.meta.glob<string>('/src/assets/data/**/*.{csv,json}', { query: '?raw', import: 'default' });

export type Row = Record<string, string | number>;

/** Parses a simple CSV (no quoted commas). Numeric cells become numbers. */
export function parseCsv(text: string): Row[] {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const keys = header.split(',').map((k) => k.trim());
  return lines.map((line) => {
    const cells = line.split(',').map((c) => c.trim());
    return Object.fromEntries(keys.map((k, i) => [k, cells[i] !== '' && !isNaN(Number(cells[i])) ? Number(cells[i]) : cells[i]]));
  });
}

/** Loads rows from src/assets/data/<path>; throws a clear build error if missing. */
export async function loadData(path: string): Promise<Row[]> {
  const load = files[`/src/assets/data/${path}`];
  if (!load) throw new Error(`Chart: data file not found in src/assets/data/: "${path}"`);
  const text = await load();
  return path.endsWith('.json') ? (JSON.parse(text) as Row[]) : parseCsv(text);
}

/** "Nice" axis maximum and tick values starting at 0. */
export function ticks(max: number, count = 5): number[] {
  const raw = max / count || 1;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  return Array.from({ length: Math.ceil(max / step) + 1 }, (_, i) => +(i * step).toFixed(10));
}

export interface Plot {
  width: number;
  height: number;
  pad: { top: number; right: number; bottom: number; left: number };
  yTicks: number[];
  /** Maps a value to a y pixel. */
  y: (v: number) => number;
  /** Center x pixel of category i. */
  x: (i: number) => number;
  band: number;
}

/** Computes plot geometry for `n` categories and values up to `max`. */
export function plot(n: number, max: number, width = 640, height = 320): Plot {
  const pad = { top: 16, right: 16, bottom: 40, left: 48 };
  const yTicks = ticks(max);
  const top = yTicks[yTicks.length - 1] || 1;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const band = innerW / Math.max(n, 1);
  return {
    width,
    height,
    pad,
    yTicks,
    band,
    y: (v) => pad.top + innerH - (v / top) * innerH,
    x: (i) => pad.left + band * (i + 0.5),
  };
}
