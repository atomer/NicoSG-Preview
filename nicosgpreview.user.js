// ==UserScript==
// @name		NicoSG Preview
// @namespace   http://www.atomer.sakura.ne.jp
// @description ニコニコ静画ランキング出張所のサムネイルをプレビューする
// @include	 http://www.nicovideo.jp/ranking/*
// @include	 http://www.nicovideo.jp/my/watchlist*
// @version	 0.2
// ==/UserScript==
(function() {
	var config = {
			watchlist: {
				base: "BODY",
				list: "BODY"
			},
			ranking: {
				base: "TABLE",
				list: ".seiga_item"
			}
		},
		page = location.pathname.indexOf("watchlist") !== -1 ? "watchlist" : "ranking",
		view, base;
	
	config = config[page];
	
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
		var p = document.querySelector(config.list);
		
		while(p && p.tagName !== config.base) {
			p = p.parentNode;
		}
		return p ? p.parentNode : p;
	}
	function preview(el) {
		var id = el.src.replace(/^http\:\/\/lohas\.nicoseiga\.jp\/thumb\/(\d+)(q|i).*$/, "$1");
		var loader;
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
		var offset = getOffset(el);
		view.style.top = offset.top + "px";
		view.style.left = offset.left + "px";
		view.style.display = "block";
		
		loader = view.querySelector(".nicosg_loader");
		loader.style.display = "block";
		
		var img = view.querySelector("img");
		var f = function(self) {
			var base = self.parentNode;
			var loader = base.querySelector(".nicosg_loader");
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
	}
	function getImage(e) {
		var el;
		if (e.target.tagName === "IMG" && e.target.className === "seiga_item") {
			el = e.target;
		}
		return el;
	}
	
	base = getBase();
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