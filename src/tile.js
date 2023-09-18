// initially forked from unicodetiles.js::ut.Tile
// https://github.com/tapio/unicodetiles.js/blob/master/unicodetiles/unicodetiles.js

class Tile {
  constructor(ch, r, g, b, br, bg, bb) {
    this.ch = ch || ' '
    this.r = r
    this.g = g
    this.b = b
    this.br = br
    this.bg = bg
    this.bb = bb
  }

  getChar = () => {
    return this.ch
  }

  setChar = (newCh) => {
    this.ch = newCh
  }

  	/// Function: setColor
	/// Sets the foreground color of this tile.
	setColor = (r, g, b) => { this.r = r; this.g = g; this.b = b; }
	/// Function: setGrey
	/// Sets the foreground color to the given shade (0-255) of grey.
	setGrey = (grey) => { this.r = grey; this.g = grey; this.b = grey; }
	/// Function: setBackground
	/// Sets the background color of this tile.
	setBackground = (r, g, b) => { this.br = r; this.bg = g; this.bb = b; }
	/// Function: resetColor
	/// Clears the color of this tile / assigns default color.
	resetColor = () => { this.r = this.g = this.b = undefined; }
	/// Function: resetBackground
	/// Clears the background color of this tile.
	resetBackground = () => { this.br = this.bg = this.bb = undefined; }
	/// Function: getColorHex
	/// Returns the hexadecimal representation of the color
	getColorHex = () => {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return "#" + this.r.toString(16) + this.g.toString(16) + this.b.toString(16)
		else return ""
	}
	/// Function: getBackgroundHex
	/// Returns the hexadecimal representation of the background color
	getBackgroundHex = () => {
		if (this.br !== undefined && this.bg !== undefined && this.bb !== undefined)
			return "#" + this.br.toString(16) + this.bg.toString(16) + this.bb.toString(16)
		else return "";
	}
	/// Function: getColorRGB
	/// Returns the CSS rgb(r,g,b) representation of the color
	getColorRGB = () => {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return 'rgb('+this.r+','+this.g+','+this.b+')';
		else return "";
	}
	/// Function: getBackgroundRGB
	/// Returns the CSS rgb(r,g,b) representation of the background color
	getBackgroundRGB = () => {
		if (this.br !== undefined && this.bg !== undefined && this.bb !== undefined)
			return 'rgb('+this.br+','+this.bg+','+this.bb+')';
		else return "";
	}
	/// Function: getColorJSON
	/// Returns the JSON representation of the color, i.e. object { r, g, b }
	getColorJSON = () => {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return { "r": this.r, "g": this.g, "b": this.b };
		else return {};
	}
	/// Function: getBackgroundJSON
	/// Returns the JSON representation of the background color, i.e. object { r, g, b }
	getBackgroundJSON = () => {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return { "r": this.br, "g": this.bg, "b": this.bb };
		else return {};
	}

  copy = (other) => {
    this.ch = other.ch
    this.r = other.r
    this.g = other.g
    this.b = other.b
    this.br = other.br
    this.bg = other.bg
    this.bb = other.bb
  }

  clone = () => {
    return new Tile(this.ch, this.r, this.g, this.b, this.br, this.bg, this.bb)
  }
}

export const NULL_TILE = new Tile()

export default Tile
