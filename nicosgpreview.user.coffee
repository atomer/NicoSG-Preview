(->
	config =
		watchlist:
			base: "BODY"
			list: "BODY"
		ranking:
			base: "TABLE"
			list: ".seiga_item"
	
	page = if location.pathname.indexOf("/my/top/user") isnt -1 then "watchlist" else "ranking"
	
	config = config[page]
	
	getOffset = (el) ->
		top = 0
		left = 0
		
		loop
			top += el.offsetTop or 0
			left += el.offsetLeft or 0
			el = el.offsetParent
			break if el
		
		return {
			top: top,
			left: left
		}
	
	getBase = () ->
		p = document.querySelector(config.list)
		p = p.parentNode while p and p.tagName isnt config.list
		
		return if p then p.parentNode else p
	
	preview = (el) ->
		id = el.src.replace(/^http\:\/\/lohas\.nicoseiga\.jp\/thumb\/(\d+)(q|i|z).*$/, "$1")
		view = document.getElementById("nicosg_viewer")
		if not view
			view = document.createElement("div")
			view.id = "nicosg_viewer"
			view.style.position = "absolute"
			document.body.appendChild(view)
			view.innerHTML = '<img src="" width="200" style="box-shadow:2px 2px 1px 0px #777;" />'
			
			loader = document.createElement("div")
			loader.className = "nicosg_loader"
			loader.setAttribute("style", "position:absolute;top:0;left:0;width:16px;height:16px;background: url(http://www.atomer.sakura.ne.jp/js/greasemonkey/nicosgpreview/loader.gif) no-repeat center center #FFF;")
			
			view.appendChild(loader)
		
		offset = getOffset(el)
		view.style.top = offset.top + "px"
		view.style.left = offset.left + "px";
		view.style.display = "block"
		
		loader = view.querySelector(".nicosg_loader")
		loader.style.display = "block"
		
		img = view.querySelector("img")
		f = (self) ->
			base = self.parentNode
			loader = base.querySelector(".nicosg_loader")
			setTimeout(() ->
				base.style.width = ""
				base.style.height = ""
				base.style.overflow = ""
				base.style.left = self.getAttribute("data-left") + "px"
				loader.style.display = "none"
				return
			, 100)
			return
		img.setAttribute("data-left", offset.left - 200)
		img.setAttribute("onload", '(' + f.toString() + ')(this);')
		view.style.width = "16px"
		view.style.height = "16px"
		view.style.overflow = "hidden"
		
		img.src = "http://lohas.nicoseiga.jp/thumb/" + id + "i"
		return
	
	getImage = (e) ->
		if e.target.tagName is "IMG" and (e.target.className is "seiga_item" or /^http:\/\/lohas\.nicoseiga\.jp/.test(e.target.src))
			el = e.target
		return el
	
	base = getBase()
	if not base
		return
	
	base.addEventListener("mouseover", (e) ->
		el = getImage(e)
		el and preview(el)
		return
	, false)
	
	base.addEventListener("mouseout", (e) ->
		el = getImage(e)
		el and view and (view.style.display = "none")
		return
	, false)
)()