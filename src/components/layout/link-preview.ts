/**
 * Link hover previews: shows title, section and description of internal pages when a link
 * in the main content is hovered or focused. Data comes from /<lang>/previews.json (built once).
 * Disabled on touch devices. Escape or leaving the link hides it.
 */
interface Preview {
  title: string;
  description: string;
  section: string;
}

/** Attaches previews to links inside `root`. `indexUrl` is the locale's previews.json URL. */
export function setupLinkPreviews(root: HTMLElement, indexUrl: string): void {
  if (matchMedia('(pointer: coarse)').matches) return;
  let index: Promise<Record<string, Preview>> | undefined;
  const load = () => (index ??= fetch(indexUrl).then((r) => r.json()).catch(() => ({})));

  const card = document.createElement('div');
  card.className = 'link-preview';
  card.setAttribute('role', 'tooltip');
  card.id = 'link-preview';
  card.hidden = true;
  document.body.append(card);

  const hide = () => {
    card.hidden = true;
    document.querySelector('[aria-describedby="link-preview"]')?.removeAttribute('aria-describedby');
  };

  const show = async (link: HTMLAnchorElement) => {
    const path = new URL(link.href, location.href).pathname.replace(/\/?$/, '/');
    const data = (await load())[path];
    if (!data || path === location.pathname) return;
    const section = document.createElement('small');
    section.textContent = data.section;
    const title = document.createElement('strong');
    title.textContent = data.title;
    const text = document.createElement('p');
    text.textContent = data.description;
    card.replaceChildren(section, title, text);
    const rect = link.getBoundingClientRect();
    card.style.left = `${Math.min(rect.left + scrollX, scrollX + innerWidth - 340)}px`;
    card.style.top = `${rect.bottom + scrollY + 6}px`;
    card.hidden = false;
    link.setAttribute('aria-describedby', card.id);
  };

  const target = (e: Event) => (e.target as Element).closest?.<HTMLAnchorElement>('a[href]');
  root.addEventListener('mouseover', (e) => {
    const link = target(e);
    if (link) show(link);
  });
  root.addEventListener('focusin', (e) => {
    const link = target(e);
    if (link) show(link);
  });
  root.addEventListener('mouseout', (e) => target(e) && hide());
  root.addEventListener('focusout', hide);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && hide());
}
