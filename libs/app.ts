import Preview from './Preview';

const config = {
  watchlist: {
    base: 'BODY',
    list: 'BODY',
  },
  ranking: {
    base: null,
    list: () => {
      const list: NodeList = document.querySelectorAll(
        '.BaseRankingContentContainer-main'
      );
      return list[6];
    },
  },
};

export default function(page) {
  const base: HTMLElement = getBase(page);
  if (!base) {
    return;
  }
  const preview: Preview = new Preview();
  base.addEventListener(
    'mouseover',
    (e: Event) => {
      const el: HTMLImageElement = getImage(e);
      if (el) {
        preview.show(el);
      }
    },
    false
  );
  base.addEventListener(
    'mouseout',
    (e: Event) => {
      const el: HTMLImageElement = getImage(e);
      if (el && preview.view) {
        preview.hide();
      }
    },
    false
  );
}

function getBase(page: string): HTMLElement {
  let p: HTMLElement;
  const c = config[page];
  if (typeof c.list === 'string') {
    p = document.querySelector(c.list);
  } else {
    p = c.list();
  }
  if (c.base) {
    while (p && p.tagName !== c.base) {
      p = p.parentNode as HTMLElement;
    }
  }
  return p ? (p.parentNode as HTMLElement) : p;
}

function getImage(e: Event): HTMLImageElement {
  const el: HTMLImageElement = e.target as HTMLImageElement;
  if (el.tagName === 'IMG' && /^https?:\/\/lohas\.nicoseiga\.jp/.test(el.src)) {
    return el;
  } else if (el.className === 'Thumbnail-image') {
    el.src = el.getAttribute('data-background-image');
    return el;
  }
}
