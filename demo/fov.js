// initially forked from unicodetiles.js::/examples/fov.js
// https://github.com/tapio/unicodetiles.js/blob/master/examples/fov.js

let maskBuffer
const maskOrigin = { x: 0, y: 0 }
let terminal
let engine

// Shoots a line-of-sight beam that marks tiles as visible as it goes
const shootRay = (x, y, a) => {
	const step = 0.3333
	const maxdist = terminal.cy / step
	const dx = Math.cos(a) * step
	const dy = -Math.sin(a) * step
	let xx = x
	let yy = y
	for (let i = 0; i < maxdist; ++i) {
		// Check for walls at the current spot
		const testx = Math.round(xx)
		const testy = Math.round(yy)
		// Mark the tile visible
		maskBuffer[testy - maskOrigin.y][testx - maskOrigin.x] = true
		// If wall is encountered, terminate ray
		if (engine.tileFunc(testx, testy).getChar() !== ".") {
			return
		}

		// Advance the beam according to the step variables
		xx += dx
		yy += dy
	}
}

// Initializes the FOV
export const initFOV = (term, eng) => {

	// save the instances of our Viewport and Engine
	terminal = term
	engine = eng
  
	// Create an array for the FOV
	maskBuffer = new Array(terminal.h)
	for (let j = 0; j < terminal.h; ++j) {
		maskBuffer[j] = new Array(terminal.w)
	}

	// Attach the look-up callback
	engine.setMaskFunc(function(x, y) {
		x -= maskOrigin.x
		y -= maskOrigin.y
		if (x < 0 || y < 0 || x >= terminal.w || y >= terminal.h) {
			return false
		}
		return maskBuffer[y][x]
	})
}

// Calculates a fresh field of view
export const updateFOV = (x, y) => {
	// Clear the mask buffer
	for (let j = 0; j < terminal.h; ++j) {
		for (let i = 0; i < terminal.w; ++i) {
			maskBuffer[j][i] = false
		}
	}
	// Update buffer info
	maskOrigin.x = x - terminal.cx
	maskOrigin.y = y - terminal.cy
	// Populate the mask buffer with fresh data
	const step = Math.PI * 2.0 / 1080
	for (let a = 0; a < Math.PI * 2; a += step) {
		shootRay(x, y, a)
	}

}