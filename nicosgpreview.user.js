// ==UserScript==
// @name        NicoSG Preview
// @namespace   http://www.atomer.sakura.ne.jp
// @description ニコニコ静画ランキング出張所のサムネイルをプレビューする
// @include     http://www.nicovideo.jp/ranking/*
// @version     0.1
// ==/UserScript==
(function() {
    function getOffset(el) {
        var top = 0, left = 0;
        do {
            top += el.offsetTop || 0;
            left += el.offsetLeft || 0;
            el = el.offsetParent;
        } while (el);
        return {
            top: top,
            left: left
        };
    }
    function getBase() {
        var el = document.querySelector(".seiga_item");
        var p = el;
        while(p && p.tagName !== "TABLE") {
            p = p.parentNode;
        }
        return p.parentNode;
    }
    function preview(el) {
        var id = el.src.replace(/^http\:\/\/lohas\.nicoseiga\.jp\/thumb\/(\d+)q.*$/, "$1");
        view = document.getElementById("nicosg_viewer");
        if (!view) {
            view = document.createElement("div");
            view.id = "nicosg_viewer";
            view.style.position = "absolute";
            document.body.appendChild(view);
            //base.parentNode.insertBefore(view, base);
            view.innerHTML = '<img src="" width="200" style="box-shadow:2px 2px 1px 0px #777;" />';
        }
        var offset = getOffset(el);
        view.style.top = offset.top + "px";
        view.style.left = (offset.left - 200) + "px";
        view.style.display = "block";
        var img = view.querySelector("img");
        img.src = "http://lohas.nicoseiga.jp/thumb/" + id + "i";
    }
    function getImage(e) {
        var el;
        if (e.target.tagName === "IMG" && e.target.className === "seiga_item") {
            el = e.target;
        }
        return el;
    }
    
    var view;
    var base = getBase();
    if (!base) {
        return;
    }
    
    base.addEventListener("mouseover", function(e) {
        var el = getImage(e);
        el && preview(el);
    }, false);
    
    base.addEventListener("mouseout", function(e) {
        var el = getImage(e);
        el && view && (view.style.display = "none");
    }, false);
})();