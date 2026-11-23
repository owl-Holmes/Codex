/**
 * Output hardening for markup injected with `set:html` (content is owner-authored, but files such
 * as SVG may come from the web): JSON safe inside a <script> element, SVG without active content.
 * Pure functions, unit-tested in sanitize.test.ts. Used by Breadcrumbs (JSON-LD) and Svg.
 */

/**
 * JSON.stringify for an inline `<script type="application/ld+json">`: escapes `<`, `>`, `&` and the
 * U+2028 / U+2029 separators, so a title containing `</script>` or `<!--` cannot close the element.
 * The output is still valid JSON with the same value.
 */
export function jsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Removes active content from an SVG before it is inlined in the page: `<script>` and
 * `<foreignObject>` elements, `on…` event-handler attributes and `javascript:` URLs.
 * Shapes, styles, gradients and `currentColor` / CSS variables are kept.
 */
export function sanitizeSvg(markup: string): string {
  return markup
    .replace(/<script[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<script[^>]*\/>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject\s*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/((?:xlink:)?href)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1=$2#$2');
}
