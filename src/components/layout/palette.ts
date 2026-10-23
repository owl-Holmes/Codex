/**
 * Client logic for CommandPalette.astro: keyboard shortcut, lazy Pagefind loading,
 * debounced search and listbox keyboard navigation.
 */

interface PagefindResult {
  data: () => Promise<{ url: string; meta: { title?: string }; excerpt: string }>;
}
interface Pagefind {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
}

/** Wires the palette dialog: Ctrl/Cmd+K and [data-open-palette] buttons open it. */
export function setupPalette(dialog: HTMLDialogElement): void {
  const input = dialog.querySelector<HTMLInputElement>('.palette-input')!;
  const list = dialog.querySelector<HTMLUListElement>('.palette-results')!;
  let pagefind: Promise<Pagefind> | undefined;
  let active = -1;
  let timer: number | undefined;

  const load = () =>
    (pagefind ??= import(/* @vite-ignore */ `${dialog.dataset.bundle}pagefind.js`) as Promise<Pagefind>);

  const open = () => {
    dialog.showModal();
    input.select();
    load().catch(() => undefined);
  };

  const select = (index: number) => {
    const items = [...list.children] as HTMLElement[];
    active = Math.max(0, Math.min(index, items.length - 1));
    items.forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
    const current = items[active];
    input.setAttribute('aria-activedescendant', current?.id ?? '');
    current?.scrollIntoView({ block: 'nearest' });
  };

  const render = async (query: string) => {
    if (!query.trim()) return list.replaceChildren();
    try {
      const { results } = await (await load()).search(query);
      const data = await Promise.all(results.slice(0, 8).map((r) => r.data()));
      const items = data.map((d, i) => {
        const li = document.createElement('li');
        li.id = `palette-option-${i}`;
        li.setAttribute('role', 'option');
        li.dataset.url = d.url;
        const title = document.createElement('span');
        title.textContent = d.meta.title ?? d.url;
        const excerpt = document.createElement('small');
        excerpt.textContent = d.excerpt.replace(/<[^>]+>/g, '');
        li.append(title, excerpt);
        li.addEventListener('click', () => location.assign(d.url));
        return li;
      });
      if (!items.length) {
        const empty = document.createElement('li');
        empty.textContent = dialog.dataset.empty ?? '';
        items.push(empty);
      }
      list.replaceChildren(...items);
      select(0);
    } catch {
      list.replaceChildren(); // index not built (dev mode)
    }
  };

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog.open) dialog.close();
      else open();
    }
  });
  document.querySelectorAll('[data-open-palette]').forEach((b) => b.addEventListener('click', open));
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => render(input.value), 150);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') select(active + 1);
    else if (e.key === 'ArrowUp') select(active - 1);
    else if (e.key === 'Enter') {
      const url = (list.children[active] as HTMLElement | undefined)?.dataset.url;
      if (url) location.assign(url);
    } else return;
    e.preventDefault();
  });
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
}
