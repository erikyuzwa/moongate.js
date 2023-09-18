// initially forked from unicodetiles.js::ut.Viewport
// https://github.com/tapio/unicodetiles.js/blob/master/unicodetiles/unicodetiles.js

import CanvasRenderer from './canvas_renderer'
import DOMRenderer from './dom_renderer'
import WebGLRenderer from './webgl_renderer'
import Tile, {NULL_TILE} from './tile'

const CSS_CLASS = "moongate";

class Viewport {
  constructor(elem, w, h, renderer, squarify) {
    this.elem = elem
    this.elem.innerHTML = ''
    this.w = w
    this.h = h
    this.renderer = null
    this.squarify = squarify
    this.cx = Math.floor(w / 2)
    this.cy = Math.floor(h / 2)

    // Add CSS class if not added already
    if (this.elem.className.indexOf(CSS_CLASS) === -1) {
      if (this.elem.className.length === 0) this.elem.className = CSS_CLASS
      else this.elem.className += " " + CSS_CLASS
    }

    console.log('elem.className', this.elem.className)

    // create a 2d array to hold the viewport tiles
    this.buffer = new Array(h)
    for (var j = 0; j < h; ++j) {
      this.buffer[j] = new Array(w)
      for (var i = 0; i < w; ++i) {
        this.buffer[j][i] = new Tile()
      }
    }

    this.setRenderer(renderer || 'auto')

  }

  /// Function: setRenderer
	/// Switch renderer at runtime. All methods fallback to "dom" if unsuccesful.
	/// Possible values:
	///   * "webgl" - Use WebGL with an HTML5 <canvas> element
	///   * "canvas" - Use HTML5 <canvas> element
	///   * "dom" - Use regular HTML element manipulation through DOM
	///   * "auto" - Use best available, i.e. try the above in order, picking the first that works
  setRenderer = (newRenderer) => {
    this.elem.innerHTML = ""
    
		if (newRenderer === "auto" || newRenderer === "webgl") {
			try {
				this.renderer = new WebGLRenderer(this)
			} catch (e) {
				console.error(e)
				newRenderer = "canvas"
				this.elem.innerHTML = ""
			}
		}
		if (newRenderer === 'canvas') {
			try {
				this.renderer = new CanvasRenderer(this)
			} catch (e) {
				console.error(e)
				newRenderer = 'dom'
				this.elem.innerHTML = ''
			}
		}
		if (newRenderer === 'dom') {
			this.renderer = new DOMRenderer(this)
		}

    this.updateStyle(false)
  }

  getRendererString = () => {
		if (this.renderer instanceof WebGLRenderer) return 'webgl'
		if (this.renderer instanceof CanvasRenderer) return 'canvas'
		if (this.renderer instanceof DOMRenderer) return 'dom'
		return ''
	}

  put = (tile, x, y) => {
		if (x < 0 || y < 0 || x >= this.w || y >= this.h) return
		this.buffer[y][x] = tile
	}

  unsafePut = (tile, x, y) => {
		this.buffer[y][x] = tile
	}

  putString = (str, x, y, r, g, b, br, bg, bb) => {
		var len = str.length
		var tile
		if (x < 0 || y < 0) return
		for (var i = 0; i < len; ++i) {
			if (x >= this.w) { x = 0; ++y;}
			if (y >= this.h) return
			tile = new Tile(str[i], r, g, b, br, bg, bb)
			this.unsafePut(tile, x, y)
			++x
		}
	}

  get = (x, y) => {
		if (x < 0 || y < 0 || x >= this.w || y >= this.h) return NULL_TILE
		return this.buffer[y][x]
	}

	/// Function: clear
	/// Clears the viewport buffer by assigning empty tiles.
	clear = () => {
		for (var j = 0; j < this.h; ++j) {
			for (var i = 0; i < this.w; ++i) {
				this.buffer[j][i] = NULL_TILE
			}
		}
		this.renderer.clear()
	}

	/// Function: render
	/// Renders the buffer as html to the element specified at construction.
	render = () => {
		this.renderer.render()
	}

  /// Function: updateStyle
	/// If the style of the parent element is modified, this needs to be called.
	updateStyle = (updateRenderer) => {
		const s = window.getComputedStyle(this.elem, null)
		this.defaultColor = s.color
		this.defaultBackground = s.backgroundColor
		if (!!updateRenderer) {
      this.renderer.updateStyle(s)
    }
			
	}

}

export default Viewport