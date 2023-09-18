
import './style.css'
import * as moongate from './src/index'
import {initFOV, updateFOV} from './fov'

const model = new moongate.Model({
  foo: 'foo'
})

var term, eng; // Can't be initialized yet because DOM is not ready
var pl = { x: 3, y: 2 }; // Player position
//var updateFOV; // For some of the examples
var map = [
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
];

// The tile palette is precomputed in order to not have to create
// thousands of Tiles on the fly.
var AT = new moongate.Tile("@", 255, 255, 0)
var WALL = new moongate.Tile('#', 255, 255, 255);
var FLOOR = new moongate.Tile('.', 0, 150, 150);

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
	if (updateFOV) updateFOV(pl.x, pl.y); // Update field of view (used in some examples)
	eng.update(pl.x, pl.y); // Update tiles
	term.put(AT, term.cx, term.cy); // Player character
	term.render(); // Render
}

// Key press handler - movement & collision handling
const onKeyDown = (k) => {
	var movedir = { x: 0, y: 0 } // Movement vector
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
	
  var oldx = pl.x, oldy = pl.y
	pl.x += movedir.x
	pl.y += movedir.y
	if (eng.tileFunc(pl.x, pl.y).getChar() !== '.') { pl.x = oldx; pl.y = oldy; }

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
	// Initialize inpu
	moongate.initInput(onKeyDown)
} 

window.onload = () => {

  console.log('version: ', moongate.VERSION)
  console.log('model', model)

  start()

  initFOV(term, eng)
}