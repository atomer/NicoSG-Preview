// ==UserScript==
// @name        NicoSG Preview
// @namespace   https://github.com/atomer/NicoSG-Preview
// @description ニコニコ静画ランキング出張所のサムネイルをプレビューする
// @include     http://www.nicovideo.jp/ranking/*
// @include     http://www.nicovideo.jp/my/*
// @version     0.4.1
// ==/UserScript==
let config = {
    watchlist: {
        base: "BODY",
        list: "BODY"
    },
    ranking: {
        base: null,
        list: () => {
            let list = document.querySelectorAll(".seiga");
            return list[1];
        }
    }
};

let view = null;
let page = location.pathname.indexOf("/my/top") !== -1 || location.pathname.indexOf("/my/watchlist") !== -1 ? "watchlist" : "ranking";
config = config[page];

let getOffset = el => {
    let top = 0;
    let left = 0;

    while (true) {
        top += el.offsetTop || 0;
        left += el.offsetLeft || 0;
        el = el.offsetParent;
        if (!el) {
            break;
        }
    }

    return {top, left};
};

let getBase = () => {
    let p;
    if (typeof config.list === "string") {
        p = document.querySelector(config.list);
    } else {
        p = config.list();
    }
    if (config.base) {
        while (p && p.tagName !== config.base) {
            p = p.parentNode;
        }
    }
    return p ? p.parentNode : p;
};

let preview = el => {
    let loader;
    const isSSL = /^https/.test(el.src);
    let id = el.src.replace(/^https?\:\/\/lohas\.nicoseiga\.jp\/thumb\/(\d+)(q|i|z).*$/, "$1");
    view = document.getElementById("nicosg_viewer");
    if (!view) {
        view = document.createElement("div");
        view.id = "nicosg_viewer";
        view.style.position = "absolute";
        document.body.appendChild(view);
        view.innerHTML = '<img src="" width="200" style="box-shadow:2px 2px 1px 0px #777;" />';

        loader = document.createElement("div");
        loader.className = "nicosg_loader";
        loader.setAttribute("style", `
            position: absolute;
            top: 0;
            left: 0;
            width: 16px;
            height: 16px;
            background: url(data:image/gif;base64,R0lGODlhEAAQAPQAAP///wAAAPj4+Dg4OISEhAYGBiYmJtbW1qioqBYWFnZ2dmZmZuTk5JiYmMbGxkhISFZWVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAkKAAAALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkECQoAAAAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkECQoAAAAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAkKAAAALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAkKAAAALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==) no-repeat center center #FFF;
        `);

        view.appendChild(loader);
    }

    let offset = getOffset(el);
    view.style.top = offset.top + "px";
    view.style.left = offset.left + "px";
    view.style.display = "block";

    loader = view.querySelector(".nicosg_loader");
    loader.style.display = "block";

    let img = view.querySelector("img");
    let f = self => {
        let base = self.parentNode;
        loader = base.querySelector(".nicosg_loader");
        setTimeout(() => {
            base.style.width = "";
            base.style.height = "";
            base.style.overflow = "";
            base.style.left = self.getAttribute("data-left") + "px";
            loader.style.display = "none";
        }, 100);
    };
    img.setAttribute("data-left", offset.left - 200);
    img.setAttribute("onload", `(${f.toString()})(this);`);
    view.style.width = "16px";
    view.style.height = "16px";
    view.style.overflow = "hidden";

    img.src = `http${(isSSL ? 's' : '')}://lohas.nicoseiga.jp/thumb/${id}i`;
};

let getImage = e => {
    let el;
    if (e.target.tagName === "IMG" && /^https?:\/\/lohas\.nicoseiga\.jp/.test(e.target.src)) {
        el = e.target;
    }
    return el;
};

let base = getBase();
if (base) {
    base.addEventListener("mouseover", e => {
        let el = getImage(e);
        if (el) {
            preview(el);
        }
    }, false);
    base.addEventListener("mouseout", e => {
        let el = getImage(e);
        if (el && view) {
            view.style.display = "none";
            let img = view.querySelector("img");
            if (img) {
                img.src = "";
            }
        }
    }, false);
}
