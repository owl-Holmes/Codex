/**
 * Unit tests for the output-hardening helpers of sanitize.ts.
 */
import { describe, expect, it } from 'vitest';
import { jsonForScript, sanitizeSvg } from './sanitize';

describe('jsonForScript', () => {
  it('cannot close the script element and stays valid JSON', () => {
    const value = { name: '</script><script>alert(1)</script> & <!--' };
    const out = jsonForScript(value);
    expect(out).not.toMatch(/[<>&]/);
    expect(JSON.parse(out)).toEqual(value);
  });
  it('escapes line and paragraph separators', () => {
    expect(jsonForScript('a\u2028b\u2029c')).toBe('"a\\u2028b\\u2029c"');
  });
});

describe('sanitizeSvg', () => {
  it('removes scripts, foreignObject, event handlers and javascript: links', () => {
    const svg =
      '<svg onload="alert(1)"><script>alert(2)</script><script src="x.js"/>' +
      '<foreignObject><div>x</div></foreignObject>' +
      '<a href="javascript:alert(3)"><circle onclick=\'alert(4)\' r="2"/></a></svg>';
    const out = sanitizeSvg(svg);
    expect(out).not.toMatch(/alert|script|foreignObject|onload|onclick/i);
    expect(out).toContain('<circle r="2"/>');
    expect(out).toContain('href="#"');
  });
  it('keeps harmless markup intact', () => {
    const svg = '<svg viewBox="0 0 10 10"><path d="M0 0h10" stroke="currentColor"/></svg>';
    expect(sanitizeSvg(svg)).toBe(svg);
  });
});
