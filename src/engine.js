import {NULL_TILE} from './tile'

class Engine {
  constructor(vp, func, w, h) {
    this.viewport = vp;
    this.tileFunc = func;
    this.w = w;
    this.h = h;
    this.refreshCache = true;
    this.cacheEnabled = false;
    this.transitionTimer = null;
    this.transitionDuration = 0;
    this.transition = null;
    this.cachex = 0;
    this.cachey = 0;
    this.tileCache = new Array(vp.h);
    this.tileCache2 = new Array(vp.h);
    for (var j = 0; j < vp.h; ++j) {
      this.tileCache[j] = new Array(vp.w);
      this.tileCache2[j] = new Array(vp.w);
    }
  }

  /// Parameters:
	///   func - function taking parameters (x, y) and returning a Tile
	///   effect - (string) (optional) name of effect to use (see above for legal values)
	///   duration - (integer) (optional) how many milliseconds the transition effect should last
	setTileFunc = (func, effect, duration) => {
		if (effect) {
			this.transition = undefined
			if (typeof effect === "string") {
				if (effect === "boxin") this.transition = function(x, y, w, h, new_t, old_t, factor) {
					var halfw = w * 0.5, halfh = h * 0.5;
					x -= halfw; y -= halfh;
					if (Math.abs(x) < halfw * factor && Math.abs(y) < halfh * factor) return new_t;
					else return old_t;
				};
				else if (effect === "boxout") this.transition = function(x, y, w, h, new_t, old_t, factor) {
					var halfw = w * 0.5, halfh = h * 0.5;
					x -= halfw; y -= halfh;
					factor = 1.0 - factor;
					if (Math.abs(x) < halfw * factor && Math.abs(y) < halfh * factor) return old_t;
					else return new_t;
				};
				else if (effect === "circlein") this.transition = function(x, y, w, h, new_t, old_t, factor) {
					var halfw = w * 0.5, halfh = h * 0.5;
					x -= halfw; y -= halfh;
					if (x*x + y*y < (halfw*halfw + halfh*halfh) * factor) return new_t;
					else return old_t;
				};
				else if (effect === "circleout") this.transition = function(x, y, w, h, new_t, old_t, factor) {
					var halfw = w * 0.5, halfh = h * 0.5;
					x -= halfw; y -= halfh;
					factor = 1.0 - factor;
					if (x*x + y*y > (halfw*halfw + halfh*halfh) * factor) return new_t;
					else return old_t;
				};
				else if (effect === "random") this.transition = function(x, y, w, h, new_t, old_t, factor) {
					if (Math.random() > factor) return old_t;
					else return new_t;
				};
			}
			if (this.transition) {
				this.transitionTimer = (new Date()).getTime();
				this.transitionDuration = duration || 500;
			}
		}
		this.tileFunc = func;
	}

	/// Function: setMaskFunc
	/// Sets the function to be called to fetch mask information according to coordinates.
	/// If mask function returns false to some coordinates, then that tile is not rendered.
	///
	/// Parameters:
	///   func - function taking parameters (x, y) and returning a true if the tile is visible
	setMaskFunc = (func) => { 
    this.maskFunc = func
  }

	/// Function: setShaderFunc
	/// Sets the function to be called to post-process / shade each visible tile.
	/// Shader function is called even if caching is enabled, see <Engine.setCacheEnabled>.
	///
	/// Parameters:
	///   func - function taking parameters (tile, x, y) and returning an ut.Tile
	setShaderFunc = (func) => { 
    this.shaderFunc = func
  }

	/// Function: setWorldSize
	/// Tiles outside of the range x = [0,width[; y = [0,height[ are not fetched.
	/// Set to undefined in order to make the world infinite.
	///
	/// Parameters:
	///   width - (integer) new world width
	///   height - (integer) new world height
	setWorldSize = (width, height) => { 
    this.w = width
    this.h = height 
  }

	/// Function: setCacheEnabled
	/// Enables or disables the usage of tile cache. This means that
	/// extra measures are taken to not call the tile function unnecessarily.
	/// This means that all animating must be done in a shader function,
	/// see <Engine.setShaderFunc>.
	/// Cache is off by default, but should be enabled if the tile function
	/// does more computation than a simple array look-up.
	///
	/// Parameters:
	///   mode - true to enable, false to disable
	setCacheEnabled = (mode) => { 
    this.cacheEnabled = mode;
    this.refreshCache = true;
  }

	/// Function: update
	/// Updates the viewport according to the given player coordinates.
	/// The algorithm goes as follows:
	///   * Record the current time
	///   * For each viewport tile:
	///   * Check if the tile is visible by testing the mask
	///   * If not visible, continue to the next tile in the viewport
	///   * Otherwise, if cache is enabled try to fetch the tile from there
	///   * Otherwise, call the tile function and check for shader function presence
	///   * If there is shader function, apply it to the tile, passing the recorded time
	///   * Put the tile to viewport
	///
	/// Parameters:
	///   x - (integer) viewport center x coordinate in the tile world
	///   y - (integer) viewport center y coordinate in the tile world
	update = (center_x, center_y) => {
		const x = center_x || 0
		const y = center_y || 0
		// World coords of upper left corner of the viewport
		var xx = x - this.viewport.cx
		var yy = y - this.viewport.cy
		var timeNow = (new Date()).getTime(); // For passing to shaderFunc
		var transTime;
		if (this.transition) transTime = (timeNow - this.transitionTimer) / this.transitionDuration
		if (transTime >= 1.0) this.transition = undefined
		var tile
		// For each tile in viewport...
		for (var j = 0; j < this.viewport.h; ++j) {
			for (var i = 0; i < this.viewport.w; ++i) {
				var ixx = i+xx, jyy = j+yy;
				// Check horizontal bounds if requested
				if (this.w && (ixx < 0 || ixx >= this.w)) {
					tile = NULL_TILE;
				// Check vertical bounds if requested
				} else if (this.h && (jyy < 0 || jyy >= this.h)) {
					tile = NULL_TILE
				// Check mask
				} else if (this.maskFunc && !this.maskFunc(ixx, jyy)) {
					tile = NULL_TILE
				// Check transition effect
				} else if (this.transition && !this.refreshCache) {
					tile = this.transition(i, j, this.viewport.w, this.viewport.h,
						this.tileFunc(ixx, jyy), this.tileCache[j][i], transTime);
				// Check cache
				} else if (this.cacheEnabled && !this.refreshCache) {
					var lookupx = ixx - this.cachex;
					var lookupy = jyy - this.cachey;
					if (lookupx >= 0 && lookupx < this.viewport.w && lookupy >= 0 && lookupy < this.viewport.h) {
						tile = this.tileCache[lookupy][lookupx];
						if (tile === NULL_TILE) tile = this.tileFunc(ixx, jyy);
					} else // Cache miss
						tile = this.tileFunc(ixx, jyy);
				// If all else fails, call tileFunc
				} else tile = this.tileFunc(ixx, jyy);
				// Save the tile to cache (always due to transition effects)
				this.tileCache2[j][i] = tile;
				// Apply shader function
				if (this.shaderFunc && !(tile instanceof NULL_TILE))
					tile = this.shaderFunc(tile, ixx, jyy, timeNow)
				// Put shaded tile to viewport
				this.viewport.unsafePut(tile, i, j)
			}
		}
		// Cache stuff is enabled always, because it is also required by transitions
		// Save the new cache origin
		this.cachex = xx
		this.cachey = yy
		// Swap cache buffers
		var tempCache = this.tileCache
		this.tileCache = this.tileCache2
		this.tileCache2 = tempCache
		this.refreshCache = false
	}


}

export default Engine
