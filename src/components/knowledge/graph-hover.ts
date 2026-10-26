/**
 * Client-side interaction for the knowledge graph drawn at build time by GraphCanvas.astro:
 * shows the hovered/focused node's name in a tooltip and highlights its connections.
 * The SVG works without JavaScript (nodes are plain links with a <title>).
 */

/** Wires hover/focus on every `.node` link of `svg`; `tip` is the tooltip element inside `figure`. */
export function wireHover(figure: HTMLElement, svg: SVGSVGElement, tip: HTMLElement): void {
  const show = (node: SVGAElement) => {
    const id = node.dataset.id ?? '';
    svg.classList.add('is-hovering');
    svg.querySelectorAll<SVGLineElement>('.edge').forEach((line) => {
      line.classList.toggle('is-active', (line.dataset.ends ?? '').split(' ').includes(id));
    });
    node.classList.add('is-active');
    const box = node.querySelector('circle')!.getBoundingClientRect();
    const frame = figure.getBoundingClientRect();
    const small = document.createElement('small');
    small.textContent = node.dataset.section ?? '';
    tip.replaceChildren(node.dataset.label ?? '', small);
    tip.style.left = `${box.left + box.width / 2 - frame.left}px`;
    tip.style.top = `${box.top - frame.top}px`;
    tip.hidden = false;
  };
  const hide = () => {
    svg.classList.remove('is-hovering');
    svg.querySelectorAll('.is-active').forEach((x) => x.classList.remove('is-active'));
    tip.hidden = true;
  };
  svg.querySelectorAll<SVGAElement>('.node').forEach((node) => {
    node.addEventListener('pointerenter', () => show(node));
    node.addEventListener('focus', () => show(node));
    node.addEventListener('pointerleave', hide);
    node.addEventListener('blur', hide);
  });
}
