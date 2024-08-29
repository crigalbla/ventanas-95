export const COLORS = {
	BLACK: "rgb(0, 0, 0)",
	RED: "rgb(255, 00, 00)",
	MAGENTA: "rgb(200, 0, 255)",
	YELLOW: "rgb(200, 200, 0)",
	CYAN: "rgb(0, 200, 200)",
	BLUE: "rgb(0, 0, 200)",
	GRAY: "rgb(128, 128, 128)",
	LIME: "rgb(0, 200, 0)"
}

export const NUMBER_COLOR = {
	0: COLORS.BLACK,
	1: COLORS.RED,
	2: COLORS.MAGENTA,
	3: COLORS.YELLOW,
	4: COLORS.CYAN,
	5: COLORS.BLUE,
	6: COLORS.GRAY,
	7: COLORS.LIME
}

export const EVENT_MOVEMENTS = {
	LEFT: "ArrowLeft",
	RIGHT: "ArrowRight",
	DOWN: "ArrowDown",
	UP: "ArrowUp"
}

// COLORS.CYAN
const BOX_PIECE = [
	[4, 4],
	[4, 4]
]

// COLORS.RED
const STICK_PIECE = [
	[1, 1, 1, 1]
]

// COLORS.GRAY
const PYRAMID_PIECE = [
	[0, 6, 0],
	[6, 6, 6]
]

// COLORS.LIME
const Z_PIECE = [
	[7, 7, 0],
	[0, 7, 7]
]

// COLORS.BLUE
const REVERSE_Z_PIECE = [
	[0, 5, 5],
	[5, 5, 0]
]

// COLORS.YELLOW
const L_PIECE = [
	[3, 0],
	[3, 0],
	[3, 3]
]

// COLORS.MAGENTA
const REVERSE_L_PIECE = [
	[0, 2],
	[0, 2],
	[2, 2]
]

export const PIECES = [
	BOX_PIECE,
	STICK_PIECE,
	PYRAMID_PIECE,
	Z_PIECE,
	REVERSE_Z_PIECE,
	L_PIECE,
	REVERSE_L_PIECE
]

export const MOVING_PIECE = {
	position: { x: 4, y: 0 },
	shape: BOX_PIECE
}

export const BOARD = Array.from({ length: 20 }, () => Array(10).fill(0))

export const BOARD_WIDTH = BOARD[0].length
export const BOARD_HEIGHT = BOARD.length
