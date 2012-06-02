// Generated by CoffeeScript 1.3.3
/*
// ==UserScript==
// @name		NicoSG Preview
// @namespace   http://www.atomer.sakura.ne.jp
// @description ニコニコ静画ランキング出張所のサムネイルをプレビューする
// @include	 http://www.nicovideo.jp/ranking/*
// @include	 http://www.nicovideo.jp/my/*
// @version	 0.3.1
// ==/UserScript==
*/

(function() {
  var base, config, getBase, getImage, getOffset, page, preview, view;
  config = {
    watchlist: {
      base: "BODY",
      list: "BODY"
    },
    ranking: {
      base: "TABLE",
      list: ".seiga_item"
    }
  };
  view = null;
  page = location.pathname.indexOf("/my/top/user") !== -1 ? "watchlist" : "ranking";
  config = config[page];
  getOffset = function(el) {
    var left, top;
    top = 0;
    left = 0;
    while (true) {
      top += el.offsetTop || 0;
      left += el.offsetLeft || 0;
      el = el.offsetParent;
      if (!el) {
        break;
      }
    }
    return {
      top: top,
      left: left
    };
  };
  getBase = function() {
    var p;
    p = document.querySelector(config.list);
    while (p && p.tagName !== config.base) {
      p = p.parentNode;
    }
    if (p) {
      return p.parentNode;
    } else {
      return p;
    }
  };
  preview = function(el) {
    var f, id, img, loader, offset;
    id = el.src.replace(/^http\:\/\/lohas\.nicoseiga\.jp\/thumb\/(\d+)(q|i|z).*$/, "$1");
    view = document.getElementById("nicosg_viewer");
    if (!view) {
      view = document.createElement("div");
      view.id = "nicosg_viewer";
      view.style.position = "absolute";
      document.body.appendChild(view);
      view.innerHTML = '<img src="" width="200" style="box-shadow:2px 2px 1px 0px #777;" />';
      loader = document.createElement("div");
      loader.className = "nicosg_loader";
      loader.setAttribute("style", "position:absolute;top:0;left:0;width:16px;height:16px;background: url(http://www.atomer.sakura.ne.jp/js/greasemonkey/nicosgpreview/loader.gif) no-repeat center center #FFF;");
      view.appendChild(loader);
    }
    offset = getOffset(el);
    view.style.top = offset.top + "px";
    view.style.left = offset.left + "px";
    view.style.display = "block";
    loader = view.querySelector(".nicosg_loader");
    loader.style.display = "block";
    img = view.querySelector("img");
    f = function(self) {
      var base;
      base = self.parentNode;
      loader = base.querySelector(".nicosg_loader");
      setTimeout(function() {
        base.style.width = "";
        base.style.height = "";
        base.style.overflow = "";
        base.style.left = self.getAttribute("data-left") + "px";
        loader.style.display = "none";
      }, 100);
    };
    img.setAttribute("data-left", offset.left - 200);
    img.setAttribute("onload", '(' + f.toString() + ')(this);');
    view.style.width = "16px";
    view.style.height = "16px";
    view.style.overflow = "hidden";
    img.src = "http://lohas.nicoseiga.jp/thumb/" + id + "i";
  };
  getImage = function(e) {
    var el;
    if (e.target.tagName === "IMG" && (e.target.className === "seiga_item" || /^http:\/\/lohas\.nicoseiga\.jp/.test(e.target.src))) {
      el = e.target;
    }
    return el;
  };
  base = getBase();
  if (!base) {
    return;
  }
  base.addEventListener("mouseover", function(e) {
    var el;
    el = getImage(e);
    el && preview(el);
  }, false);
  return base.addEventListener("mouseout", function(e) {
    var el;
    el = getImage(e);
    el && view && (view.style.display = "none");
  }, false);
})();
