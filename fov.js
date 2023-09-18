// This file contains an implementation of simple FOV.
// It naïvely shoots a beam at every direction.
// Makes use of the ut.Engine's mask function callback.

/*global term, eng */

var maskBuffer;
var maskOrigin = { x: 0, y: 0 };
let terminal
let engine

// Shoots a line-of-sight beam that marks tiles as visible as it goes
const shootRay = (x, y, a) => {
	var step = 0.3333;
	var maxdist = terminal.cy / step;
	var dx = Math.cos(a) * step;
	var dy = -Math.sin(a) * step;
	var xx = x, yy = y;
	for (var i = 0; i < maxdist; ++i) {
		// Check for walls at the current spot
		var testx = Math.round(xx);
		var testy = Math.round(yy);
		// Mark the tile visible
		maskBuffer[testy - maskOrigin.y][testx - maskOrigin.x] = true;
		// If wall is encountered, terminate ray
		if (engine.tileFunc(testx, testy).getChar() !== ".")
			return;
		// Advance the beam according to the step variables
		xx += dx; yy += dy;
	}
}

// Initializes the FOV
export const initFOV = (term, eng) => {
  terminal = term
  engine = eng
  
	// Create an array for the FOV
	maskBuffer = new Array(terminal.h);
	for (var j = 0; j < terminal.h; ++j)
		maskBuffer[j] = new Array(terminal.w);
	// Attach the look-up callback
	engine.setMaskFunc(function(x, y) {
		x -= maskOrigin.x;
		y -= maskOrigin.y;
		if (x < 0 || y < 0 || x >= terminal.w || y >= terminal.h) return false;
		return maskBuffer[y][x];
	});
}

// Calculates a fresh field of view
export const updateFOV = (x, y) => {
	// Clear the mask buffer
	for (var j = 0; j < terminal.h; ++j)
		for (var i = 0; i < terminal.w; ++i)
			maskBuffer[j][i] = false;
	// Update buffer info
	maskOrigin.x = x - terminal.cx;
	maskOrigin.y = y - terminal.cy;
	// Populate the mask buffer with fresh data
	var step = Math.PI * 2.0 / 1080;
	for (var a = 0; a < Math.PI * 2; a += step)
		shootRay(x, y, a);
}