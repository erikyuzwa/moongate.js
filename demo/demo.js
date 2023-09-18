// initially forked from unicodetiles.js::/examples/simple-dungeon.js
// https://github.com/tapio/unicodetiles.js/blob/master/examples/simple-dungeon.js

import * as moongate from '../dist/moongate.es.js'
import {initFOV, updateFOV} from './fov.js'

const model = new moongate.Model({
  foo: 'foo'
})

let term
let eng // Can't be initialized yet because DOM is not ready
let pl = { x: 3, y: 2 } // Player position
const map = [
	" #####             #####      ",
	" #...########      #...####   ",
	" #..........#      #......#   ",
	" #...######.#      #..###.#   ",
	" #####    #.#      ######.####",
	"          #.#          #.....#",
	"          #.#          #.....#",
	"          #.############.....#",
	"          #..................#",
	"          ####.###############",
	"##########   #.#     #....#   ",
	"#........##  #.#     #.#..#   ",
	"#..####...#  #.#     #.#..#   ",
	"#.........#  #.#     #.###### ",
	"#.........#  #.#     #......# ",
	"##.########  #.#     #......# ",
	" #.#         #.#     #####.## ",
	" #.#         #.#         #.#  ",
	" #.#   #######.#         #.#  ",
	" #.#   #.......#         #.#  ",
	" #.#   #.....#.#         #.#  ",
	" #.#   #.....#.#         #.#  ",
	" #.#   #.....#.#         #.#  ",
	" #.#   #.....#.#         #.#  ",
	" #.#   #######.#         #.#  ",
	" #.#         #.###########.#  ",
	" #.#         #.............#  ",
	" #.#############.###########  ",
	" #...............#            ",
	" #################            "
]

// The tile palette is precomputed in order to not have to create
// thousands of Tiles on the fly.
const AT = new moongate.Tile("@", 255, 255, 0)
const WALL = new moongate.Tile('#', 255, 255, 255)
const FLOOR = new moongate.Tile('.', 0, 150, 150)

// Returns a Tile based on the char array map
const getDungeonTile = (x, y) => {
	let t = ""
	try { t = map[y][x] }
	catch(err) { return moongate.NULL_TILE }
	if (t === '#') return WALL
	if (t === '.') return FLOOR
	return moongate.NULL_TILE
}

// "Main loop"
const tick = () => {
	if (updateFOV) updateFOV(pl.x, pl.y) // Update field of view (used in some examples)
	eng.update(pl.x, pl.y) // Update tiles
	term.put(AT, term.cx, term.cy) // Player character
	term.render() // Render
}

// Key press handler - movement & collision handling
const onKeyDown = (k) => {
	let movedir = { x: 0, y: 0 } // Movement vector
	switch(k) {
	case moongate.KEYS.KEY_DOWN:
		movedir.y = 1
	break
	case moongate.KEYS.KEY_UP:
		movedir.y = -1
	break
	case moongate.KEYS.KEY_LEFT:
		movedir.x = -1
	break
	case moongate.KEYS.KEY_RIGHT:
		movedir.x = 1
	break
	}

	if (movedir.x === 0 && movedir.y === 0) return
	
	const oldx = pl.x
	const oldy = pl.y
	pl.x += movedir.x
	pl.y += movedir.y
	if (eng.tileFunc(pl.x, pl.y).getChar() !== '.') {
		pl.x = oldx
		pl.y = oldy
	}

	tick()
}

// Initialize stuff
const start = () => {
	window.setInterval(tick, 50) // Animation
	// Initialize Viewport, i.e. the place where the characters are displayed
	term = new moongate.Viewport(document.getElementById('root'), 41, 25, 'canvas')

	console.log('renderer: ', term.getRendererString())
	// Initialize Engine, i.e. the Tile manager
	eng = new moongate.Engine(term, getDungeonTile, map[0].length, map.length)
	// Initialize input
	moongate.initInput(onKeyDown)
} 

window.onload = () => {

  console.log('version: ', moongate.VERSION)
  console.log('model', model)

  start()

  initFOV(term, eng)
}