<script lang="ts">
  import { onDestroy, onMount } from "svelte"

  import { destroyAudio, playAudio } from "@/utils"

  import { BOARD, MOVING_PIECE, PIECES, BOARD_WIDTH, BOARD_HEIGHT, EVENT_MOVEMENTS, COLORS, NUMBER_COLOR } from "./constants"
	import { lightenColorRgb, darkenColorRgb, getBlockSize } from "./utils"
  import { windows, type IndividualWindowType } from "@/stores"

	type NUMBER_COLOR_TYPE = 1 | 2 | 3 |4 | 5 | 6 | 7

	export let windowId: string

  $: score = 0
  let dropCounter = 0
  let lastTime = 0
	let isPlaying = true
	let tetrisAudio: HTMLAudioElement | null
  let canvasHTML: HTMLCanvasElement
	let context: CanvasRenderingContext2D

  const update = (time = 0) => {
  	const deltaTime = time - lastTime

  	lastTime = time
  	dropCounter += deltaTime

  	if (dropCounter > 500) {
  		MOVING_PIECE.position.y++
  		dropCounter = 0

  		if (hasCollision()) {
  			MOVING_PIECE.position.y--
  			solidifyPiece()
  			removeRows()
  		}
  		draw()
  	}

  	tetrisAudio?.ended && void tetrisAudio.play()
  	isPlaying && window.requestAnimationFrame(update)
  }

	const drawBlockBorders = (x: number, y: number, color: string, isMovingPiece?: boolean) => {
		const lighterColor = lightenColorRgb(color, 30)
		const darkerColor = darkenColorRgb(color, 50)
		const borderOffset = 0.05

		context.lineWidth = 0.1
		// Top border
		context.strokeStyle = lighterColor
		context.beginPath()
		context.moveTo(x, y + borderOffset)
		context.lineTo(x + 1, y + borderOffset)
		context.stroke()

		// Left border
		context.moveTo(x + borderOffset, y + borderOffset)
		context.lineTo(x + borderOffset, y + 1 - borderOffset)
		context.stroke()

		// Right border
		context.strokeStyle = darkerColor
		context.beginPath()
		context.moveTo(x + 1 - borderOffset, y + borderOffset)
		context.lineTo(x + 1 - borderOffset, y + 1 - borderOffset)
		context.stroke()

		// Bottom border
		context.beginPath()
		context.moveTo(x + borderOffset, y + 1 - borderOffset)
		context.lineTo(x + 1, y + 1 - borderOffset)
		context.stroke()
	}

  const draw = () => {
  	context.fillStyle = COLORS.BLACK
  	context.fillRect(0, 0, canvasHTML.width, canvasHTML.height)

  	BOARD.forEach((row, y) => {
  		row.forEach((value, x) => {
  			if (value) {
  				const color = NUMBER_COLOR[value as NUMBER_COLOR_TYPE]
  				context.fillStyle = color
  				context.fillRect(x, y, 1, 1)
  				drawBlockBorders(x, y, color)
  			}
  		})
  	})

  	MOVING_PIECE.shape.forEach((row, y) => {
  		row.forEach((value, x) => {
  			if (value) {
  				const newX = x + MOVING_PIECE.position.x
  				const newY = y + MOVING_PIECE.position.y
  				const color = NUMBER_COLOR[value as NUMBER_COLOR_TYPE]
  				context.fillStyle = color
  				context.fillRect(newX, newY, 1, 1)
  				drawBlockBorders(newX, newY, color, true)
  			}
  		})
  	})
  }

  const hasCollision = () => {
  	return MOVING_PIECE.shape.find((row, y) => {
  		return row.find((value, x) => {
  			return (
  				value > 0 &&
          BOARD[y + MOVING_PIECE.position.y]?.[x + MOVING_PIECE.position.x] !== 0
  			)
  		})
  	})
  }

	const hasCollisionOutOfBoard = () => {
		return MOVING_PIECE.shape.find((row, y) => {
  		return row.find((_, x) => {
  			return (
					BOARD[y + MOVING_PIECE.position.y]?.[x + MOVING_PIECE.position.x] === undefined
  			)
  		})
  	})
	}

  const solidifyPiece = () => {
  	MOVING_PIECE.shape.forEach((row, y) => {
  		row.forEach((value, x) => {
  			if (value > 0) {
  				BOARD[y + MOVING_PIECE.position.y][x + MOVING_PIECE.position.x] = MOVING_PIECE.shape[0].find(c => c > 0) || 0
  			}
  		})
  	})

  	createNewMovingPiece()
  }

	const resetBoard = () => {
		BOARD.forEach((row) => row.fill(0))
		score = 0
	}

	const resetMovingPiece = () => {
  	const randomPiece = PIECES[Math.floor(Math.random() * PIECES.length)]
  	MOVING_PIECE.position.x = Math.floor((BOARD_WIDTH / 2) - 1)
  	MOVING_PIECE.position.y = 0
  	MOVING_PIECE.shape = randomPiece
	}

  const createNewMovingPiece = () => {
  	resetMovingPiece()

  	if (hasCollision()) {
  		window.alert("Game over!")
  		resetBoard()
  	}
  }

  const removeRows = () => {
  	const rowsToRemove: number[] = []

  	BOARD.forEach((row, y) => {
  		if (row.every(value => value > 0)) {
  			rowsToRemove.push(y)
  		}
  	})

  	rowsToRemove.forEach(y => {
  		const newRow = Array(BOARD_WIDTH).fill(0)

  		BOARD.splice(y, 1)
  		BOARD.unshift(newRow)
  		score += 10
  		playAudio("/sounds/clickNotAllowed.mp3")
  	})
  }

	document.addEventListener("keydown", event => {
  	if (event.key === EVENT_MOVEMENTS.LEFT) {
  		MOVING_PIECE.position.x--
  		if (hasCollision()) {
  			MOVING_PIECE.position.x++
  		}
  	} else if (event.key === EVENT_MOVEMENTS.RIGHT) {
  		MOVING_PIECE.position.x++
  		if (hasCollision()) {
  			MOVING_PIECE.position.x--
  		}
  	} else if (event.key === EVENT_MOVEMENTS.DOWN) {
  		MOVING_PIECE.position.y++
  		if (hasCollision()) {
  			MOVING_PIECE.position.y--
  			solidifyPiece()
  			removeRows()
  		}
  	} else if (event.key === EVENT_MOVEMENTS.UP) {
  		const shapeRotated: number[][] = []

  		for (let i = 0; i < MOVING_PIECE.shape[0].length; i++) {
  			const row: number[] = []

  			for (let j = MOVING_PIECE.shape.length - 1; j >= 0; j--) {
  				row.push(MOVING_PIECE.shape[j][i])
  			}

  			shapeRotated.push(row)
  		}

			const previousShape = MOVING_PIECE.shape
			let testingCollisions = 0
  		MOVING_PIECE.shape = shapeRotated
			while (hasCollisionOutOfBoard() && testingCollisions < 3) {
				MOVING_PIECE.position.x--
				testingCollisions++
			}

			if (hasCollision()) {
				MOVING_PIECE.shape = previousShape
				MOVING_PIECE.position.x += testingCollisions
			}
  	}

		draw()
	})

	onMount(() => {
		const blockSize = getBlockSize()
		context = canvasHTML.getContext("2d") as CanvasRenderingContext2D

		canvasHTML.width = blockSize * BOARD_WIDTH
		canvasHTML.height = blockSize * BOARD_HEIGHT

		context.scale(blockSize, blockSize)

		tetrisAudio = playAudio("/sounds/tetris.mp3", 0.5)
		update()
	})

	onDestroy(() => {
		const isARealDestroy = !$windows.find((w: IndividualWindowType) => w.windowId === windowId)

		isPlaying = false
		destroyAudio(tetrisAudio) // TODO the audio is reseted
		if (isARealDestroy) {
			resetBoard()
			resetMovingPiece()
		}
	})
</script>

<strong>Score: {score}</strong>
<canvas bind:this={canvasHTML}></canvas>

<style>
	strong {
		background: white;
	}

	canvas {
		height: fit-content;
	}
</style>
