// initially forked from unicodetiles.js::ut.DOMRenderer
// https://github.com/tapio/unicodetiles.js/blob/master/unicodetiles/ut.DOMRenderer.js

import Renderer from './renderer'

class DOMRenderer extends Renderer {
  constructor(view) {
    super(view)
    //this.view = view

    // Create a matrix of <span> elements, cache references
    this.spans = new Array(view.h)
    this.colors = new Array(view.h)
    for (var j = 0; j < view.h; ++j) {
      this.spans[j] = new Array(view.w)
      this.colors[j] = new Array(view.w)
      for (var i = 0; i < view.w; ++i) {
        this.spans[j][i] = document.createElement("div")
        view.elem.appendChild(this.spans[j][i])
      }
      // Line break
      this.spans[j].push(document.createElement("br"))
      view.elem.appendChild(this.spans[j][view.w])
    }
  }

  clear = () => {
    for (var j = 0; j < this.view.h; ++j) {
      for (var i = 0; i < this.view.w; ++i) {
        this.colors[j][i] = ''
      }
    }
  }

  render = () => {
    var w = this.view.w, h = this.view.h
    var buffer = this.view.buffer
    var defaultColor = this.view.defaultColor
    var defaultBackground = this.view.defaultBackground
    for (var j = 0; j < h; ++j) {
      for (var i = 0; i < w; ++i) {
        var tile = buffer[j][i]
        var span = this.spans[j][i]
        // Check and update colors
        var fg = tile.r === undefined ? defaultColor : tile.getColorRGB()
        var bg = tile.br === undefined ? defaultBackground : tile.getBackgroundRGB()
        var colorHash = fg + bg
        if (colorHash !== this.colors[j][i]) {
          this.colors[j][i] = colorHash
          span.style.color = fg
          span.style.backgroundColor = bg
        }
        // Check and update character
        var ch = tile.getChar()
        if (ch !== span.innerHTML)
          span.innerHTML = ch
      }
    }
  }

  updateStyle = (s) => {
    s = window.getComputedStyle(this.spans[0][0], null);
    this.tw = parseInt(s.width, 10);
    if (this.tw === 0 || isNaN(this.tw)) return; // Nothing to do, exit
    this.th = parseInt(s.height, 10);
    if (this.view.squarify) this.tw = this.th;
    var w = this.view.w, h = this.view.h;
    for (var j = 0; j < h; ++j) {
      for (var i = 0; i < w; ++i) {
        this.spans[j][i].style.width = this.tw + "px";
      }
    }
  }


}

export default DOMRenderer

