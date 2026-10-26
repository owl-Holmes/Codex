/**
 * Section icons: inner markup of 24×24 stroke SVGs (no fill), drawn by SectionIcon.astro.
 * Pick one with `icon: <name>` in a section.yml (validated by src/content.config.ts).
 * To add an icon, add an entry here; keep the same 24×24 grid and stroke style.
 */

/** Icon name → SVG elements (inside a viewBox="0 0 24 24", stroke = currentColor). */
export const ICONS = {
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zM4 20a2 2 0 0 0 2 1h13v-3M8 7h7M8 10.5h5"/>',
  flask: '<path d="M9 3h6M10 3v6l-5.5 9.4A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.6L14 9V3M7.2 15h9.6"/>',
  magnifier: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8M8 8.5a3 3 0 0 1 3-1.5"/>',
  scroll:
    '<path d="M7 3h11a2 2 0 0 1 2 2v1h-4M7 3a2 2 0 0 0-2 2v12M16 6v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2h11v2a2 2 0 0 0 2 2M8.5 8h4M8.5 11.5h4"/>',
  atom: '<circle cx="12" cy="12" r="1.3"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)"/>',
  quill: '<path d="M20 3C11 4 6 10 5 20M20 3c0 7.5-5 12.5-12.5 12.5M4.5 21l1-2.5M11 8.5l3.5 1"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  leaf: '<path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15zM5 19l7.5-7.5"/>',
  palette:
    '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.9 0-1.2-1-1.6-1-2.6 0-1 .9-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  scales: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
} as const;

/** Name of a built-in section icon. */
export type IconName = keyof typeof ICONS;

/** All icon names, for schema validation. */
export const ICON_NAMES = Object.keys(ICONS) as [IconName, ...IconName[]];
