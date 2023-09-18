// initially forked from unicodetiles.js::ut.Input
// https://github.com/tapio/unicodetiles.js/blob/master/unicodetiles/input.js


/// Constants: Keycodes
/// KEY_BACKSPACE - 8
/// KEY_TAB - 9
/// KEY_ENTER - 13
/// KEY_SHIFT - 16
/// KEY_CTRL - 17
/// KEY_ALT - 18
/// KEY_ESCAPE - 27
/// KEY_SPACE - 32
/// KEY_LEFT - 37
/// KEY_UP - 38
/// KEY_RIGHT - 39
/// KEY_DOWN - 40
/// KEY_0 - 48
/// KEY_1 - 49
/// KEY_2 - 50
/// KEY_3 - 51
/// KEY_4 - 52
/// KEY_5 - 53
/// KEY_6 - 54
/// KEY_7 - 55
/// KEY_8 - 56
/// KEY_9 - 57
/// KEY_A - 65
/// KEY_B - 66
/// KEY_C - 67
/// KEY_D - 68
/// KEY_E - 69
/// KEY_F - 70
/// KEY_G - 71
/// KEY_H - 72
/// KEY_I - 73
/// KEY_J - 74
/// KEY_K - 75
/// KEY_L - 76
/// KEY_M - 77
/// KEY_N - 78
/// KEY_O - 79
/// KEY_P - 80
/// KEY_Q - 81
/// KEY_R - 82
/// KEY_S - 83
/// KEY_T - 84
/// KEY_U - 85
/// KEY_V - 86
/// KEY_W - 87
/// KEY_X - 88
/// KEY_Y - 89
/// KEY_Z - 90
/// KEY_NUMPAD0 - 96
/// KEY_NUMPAD1 - 97
/// KEY_NUMPAD2 - 98
/// KEY_NUMPAD3 - 99
/// KEY_NUMPAD4 - 100
/// KEY_NUMPAD5 - 101
/// KEY_NUMPAD6 - 102
/// KEY_NUMPAD7 - 103
/// KEY_NUMPAD8 - 104
/// KEY_NUMPAD9 - 105
/// KEY_F1 - 112
/// KEY_F2 - 113
/// KEY_F3 - 114
/// KEY_F4 - 115
/// KEY_F5 - 116
/// KEY_F6 - 117
/// KEY_F7 - 118
/// KEY_F8 - 119
/// KEY_F9 - 120
/// KEY_F10 - 121
/// KEY_F11 - 122
/// KEY_F12 - 123
/// KEY_COMMA - 188
/// KEY_DASH - 189
/// KEY_PERIOD - 190

export const KEYS = {
  KEY_BACKSPACE: 8,
  KEY_TAB : 9,
  KEY_ENTER : 13,
  KEY_SHIFT : 16,
  KEY_CTRL : 17,
  KEY_ALT : 18,
  KEY_ESCAPE : 27,
  KEY_SPACE : 32,
  KEY_LEFT : 37,
  KEY_UP : 38,
  KEY_RIGHT : 39,
  KEY_DOWN : 40,
  
  KEY_0 : 48,
  KEY_1 : 49,
  KEY_2 : 50,
  KEY_3 : 51,
  KEY_4 : 52,
  KEY_5 : 53,
  KEY_6 : 54,
  KEY_7 : 55,
  KEY_8 : 56,
  KEY_9 : 57,
  KEY_A : 65,
  KEY_B : 66,
  KEY_C : 67,
  KEY_D : 68,
  KEY_E : 69,
  KEY_F : 70,
  KEY_G : 71,
  KEY_H : 72,
  KEY_I : 73,
  KEY_J : 74,
  KEY_K : 75,
  KEY_L : 76,
  KEY_M : 77,
  KEY_N : 78,
  KEY_O : 79,
  KEY_P : 80,
  KEY_Q : 81,
  KEY_R : 82,
  KEY_S : 83,
  KEY_T : 84,
  KEY_U : 85,
  KEY_V : 86,
  KEY_W : 87,
  KEY_X : 88,
  KEY_Y : 89,
  KEY_Z : 90,
  KEY_NUMPAD0 : 96,
  KEY_NUMPAD1 : 97,
  KEY_NUMPAD2 : 98,
  KEY_NUMPAD3 : 99,
  KEY_NUMPAD4 : 100,
  KEY_NUMPAD5 : 101,
  KEY_NUMPAD6 : 102,
  KEY_NUMPAD7 : 103,
  KEY_NUMPAD8 : 104,
  KEY_NUMPAD9 : 105,
  KEY_F1 : 112,
  KEY_F2 : 113,
  KEY_F3 : 114,
  KEY_F4 : 115,
  KEY_F5 : 116,
  KEY_F6 : 117,
  KEY_F7 : 118,
  KEY_F8 : 119,
  KEY_F9 : 120,
  KEY_F10 : 121,
  KEY_F11 : 122,
  KEY_F12 : 123,
  
  KEY_COMMA : 188,
  KEY_DASH : 189,
  KEY_PERIOD : 190,
}




let pressedKeys = {}
let keyRepeatDelay = 150

let onkeydown = null
let onkeyup = null

/// Function: isKeyPressed
/// Checks if given key is pressed down. You must call <initInput> first.
///
/// Parameters:
///   key - key code to check
///
/// Returns:
///    True if the key is pressed down, false otherwise.
export const isKeyPressed = (key) => {

	if (pressedKeys[key]) return true
	else return false
}

/// Function: setKeyRepeatInterval
/// Sets the interval when user's onKeyDown handler is called when a key is held down.
/// <initInput> must be called with a handler for this to work.
///
/// Parameters:
///   milliseconds - the interval delay in milliseconds (1 second = 1000 milliseconds)
export const setKeyRepeatInterval = (milliseconds) => {
	keyRepeatDelay = milliseconds
}

/// Function: initInput
/// Initilizes input by assigning default key handlers and optional user's handlers.
/// This must be called in order to <isKeyPressed> to work.
///
/// Parameters:
///   onkeydown - (optional) function(keyCode) for key down event handler
///   onkeyup - (optional) function(keyCode) for key up event handler
export const initInput = (onKeyDown, onKeyUp) => {
	onkeydown = onKeyDown
	onkeyup = onKeyUp
	// Attach default onkeydown handler that updates pressedKeys
	document.onkeydown = (event) => {
    // console.log('keydown event', event)
		var k = event.keyCode;
		if (pressedKeys[k] !== null && pressedKeys[k] !== undefined) return false;
		pressedKeys[k] = true;
		if (onkeydown) {
			onkeydown(k) // User event handler
			// Setup keyrepeat
			pressedKeys[k] = setInterval("onkeydown("+k+")", keyRepeatDelay)
		}
		if (pressedKeys[KEYS.KEY_CTRL] || pressedKeys[KEYS.KEY_ALT])
			return true // CTRL/ALT for browser hotkeys
		else return false
	}
	// Attach default onkeyup handler that updates pressedKeys
	document.onkeyup = (event) => {
		var k = event.keyCode;
		if (onkeydown && pressedKeys[k] !== null && pressedKeys[k] !== undefined) {
      clearInterval(pressedKeys[k])
    }
			
		pressedKeys[k] = null
		if (onkeyup) onkeyup(k) // User event handler
		return false;
	}
	// Avoid keys getting stuck at down
	window.onblur = () => {
		for (var k in pressedKeys) {
      if (onkeydown && pressedKeys[k] !== null) {
        clearInterval(pressedKeys[k])
      }
    }
		
    pressedKeys = {}
	}
}
