export default class {
  view: HTMLElement;
  loader: HTMLElement;

  constructor() {
    this.view = document.createElement('div');
    this.view.id = 'nicosg_viewer';
    this.view.style.position = 'absolute';
    document.body.appendChild(this.view);
    this.view.innerHTML =
      '<img src="" width="200" style="box-shadow:2px 2px 1px 0px #777;" />';

    this.loader = document.createElement('div');
    this.loader.className = 'nicosg_loader';
    this.loader.setAttribute(
      'style',
      `
            position: absolute;
            top: 0;
            left: 0;
            width: 16px;
            height: 16px;
            background: url(data:image/gif;base64,R0lGODlhEAAQAPQAAP///wAAAPj4+Dg4OISEhAYGBiYmJtbW1qioqBYWFnZ2dmZmZuTk5JiYmMbGxkhISFZWVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAkKAAAALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkECQoAAAAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkECQoAAAAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAkKAAAALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAkKAAAALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==) no-repeat center center #FFF;
        `
    );

    this.view.appendChild(this.loader);
  }

  show(el: HTMLImageElement) {
    const isSSL = /^https/.test(el.src);
    const id: string = el.src.replace(
      /^https?\:\/\/lohas\.nicoseiga\.jp\/thumb\/(\d+)(q|i|z).*$/,
      '$1'
    );

    const offset: { top: number; left: number } = getOffset(el);
    this.view.style.top = offset.top + 'px';
    this.view.style.left = offset.left + 'px';
    this.view.style.display = 'block';

    this.loader = this.view.querySelector('.nicosg_loader');
    this.loader.style.display = 'block';

    const img: HTMLImageElement = this.view.querySelector('img');
    // 注:Imageのonloadに食わせるFunction
    const f: Function = (self: HTMLElement) => {
      const base: HTMLElement = self.parentNode as HTMLElement;
      const loader: HTMLElement = base.querySelector('.nicosg_loader');
      setTimeout(() => {
        base.style.width = '';
        base.style.height = '';
        base.style.overflow = '';
        base.style.left = self.getAttribute('data-left') + 'px';
        loader.style.display = 'none';
      }, 100);
    };
    img.setAttribute('data-left', offset.left - 200 + '');
    img.setAttribute('onload', `(${f.toString()})(this);`);
    this.view.style.width = '16px';
    this.view.style.height = '16px';
    this.view.style.overflow = 'hidden';

    img.src = `http${isSSL ? 's' : ''}://lohas.nicoseiga.jp/thumb/${id}i`;
  }

  hide() {
    this.view.style.display = 'none';
    const img: HTMLImageElement = this.view.querySelector('img');
    if (img) {
      img.src = '';
    }
  }
}

function getOffset(el: HTMLElement): { top: number; left: number } {
  let top: number = 0;
  let left: number = 0;
  let tmpEl: HTMLElement = el;

  while (true) {
    top += tmpEl.offsetTop || 0;
    left += tmpEl.offsetLeft || 0;
    tmpEl = tmpEl.offsetParent as HTMLElement;
    if (!tmpEl) {
      break;
    }
  }

  return { top, left };
}
