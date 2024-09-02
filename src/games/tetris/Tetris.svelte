<script lang="ts">
  import { onDestroy, onMount, afterUpdate } from "svelte"

  import { destroyAudio, playAudio } from "@/utils"
  import { t } from "@/i18n"

  import { BOARD, MOVING_PIECE, PIECES, BOARD_WIDTH, BOARD_HEIGHT, EVENT_MOVEMENTS, COLORS, NUMBER_COLOR, NEXT_PIECE } from "./constants"
	import { lightenColorRgb, darkenColorRgb, getBlockSize } from "./utils"

	type NUMBER_COLOR_TYPE = 1 | 2 | 3 |4 | 5 | 6 | 7

	export let level: number = 1
	export let isPlaying: boolean = true
	export let isMuted: boolean = false
	export let gameIsFocused: boolean = true

	let internalLevel = 1
	let blockSize = 0
	let scoreByVelocity = 0
  let score = 0
	let lines = 0
  let dropCounter = 0
  let lastTime = 0
	let tetrisAudio: HTMLAudioElement | null
  let tetrisCanvasHTML: HTMLCanvasElement
	let nextPieceCanvasHTML: HTMLCanvasElement
	let tetrisContext: CanvasRenderingContext2D
	let nextPieceContext: CanvasRenderingContext2D

	$: {
		internalLevel = level
		// eslint-disable-next-line no-use-before-define
		resetBoard()
		// eslint-disable-next-line no-use-before-define
		resetMovingPiece()
	}

  const update = (time = 0) => {
  	const deltaTime = time - lastTime

  	lastTime = time
  	dropCounter += deltaTime

  	if (isPlaying && dropCounter > getFallInterval()) {
  		MOVING_PIECE.position.y++
  		dropCounter = 0

  		if (hasCollision()) {
  			MOVING_PIECE.position.y--
  			solidifyPiece()
  			removeRows()
  		}
  		draw()
  		updateInternalLevel()
  		!isMuted && tetrisAudio?.ended && void tetrisAudio.play()
  	}

  	window.requestAnimationFrame(update)
  }

	const updateInternalLevel = () => {
		const newLevel = Math.trunc((score + 1000) / 1000)
		if (newLevel && newLevel > internalLevel) internalLevel = newLevel
	}

	const drawBlockBorders = (context: CanvasRenderingContext2D, x: number, y: number, color: string) => {
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
  	tetrisContext.fillStyle = COLORS.BLACK
  	tetrisContext.fillRect(0, 0, tetrisCanvasHTML.width, tetrisCanvasHTML.height)

  	BOARD.forEach((row, y) => {
  		row.forEach((value, x) => {
  			if (value) {
  				const color = NUMBER_COLOR[value as NUMBER_COLOR_TYPE]
  				tetrisContext.fillStyle = color
  				tetrisContext.fillRect(x, y, 1, 1)
  				drawBlockBorders(tetrisContext, x, y, color)
  			}
  		})
  	})

  	MOVING_PIECE.shape.forEach((row, y) => {
  		row.forEach((value, x) => {
  			if (value) {
  				const newX = x + MOVING_PIECE.position.x
  				const newY = y + MOVING_PIECE.position.y
  				const color = NUMBER_COLOR[value as NUMBER_COLOR_TYPE]
  				tetrisContext.fillStyle = color
  				tetrisContext.fillRect(newX, newY, 1, 1)
  				drawBlockBorders(tetrisContext, newX, newY, color)
  			}
  		})
  	})
  }

	const drawNextPiece = () => {
		const nextPieceBlockSize = blockSize / 1.5
		nextPieceCanvasHTML.width = nextPieceBlockSize * NEXT_PIECE.shape[0].length
		nextPieceCanvasHTML.height = nextPieceBlockSize * NEXT_PIECE.shape.length

		nextPieceContext.scale(nextPieceBlockSize, nextPieceBlockSize)

  	nextPieceContext.fillStyle = COLORS.TRANSPARENT
  	nextPieceContext.fillRect(0, 0, nextPieceCanvasHTML.width, nextPieceCanvasHTML.height)

		NEXT_PIECE.shape.forEach((row, y) => {
  		row.forEach((value, x) => {
  			if (value) {
  				const color = NUMBER_COLOR[value as NUMBER_COLOR_TYPE]
  				nextPieceContext.fillStyle = color
  				nextPieceContext.fillRect(x, y, 1, 1)
  				drawBlockBorders(nextPieceContext, x, y, color)
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
		scoreByVelocity = 0
		lines = 0
		score = 0
		internalLevel = level
	}

	const resetMovingPiece = () => {
		const randomPiece = PIECES[Math.floor(Math.random() * PIECES.length)]
  	MOVING_PIECE.position = { ...NEXT_PIECE.position }
  	MOVING_PIECE.shape = NEXT_PIECE.shape
		NEXT_PIECE.shape = randomPiece

		score += scoreByVelocity
		scoreByVelocity = 0

		nextPieceCanvasHTML && drawNextPiece()
	}

  const createNewMovingPiece = () => {
  	resetMovingPiece()

  	if (hasCollision()) {
  		!isMuted && playAudio("/sounds/clickNotAllowed.mp3")
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
  		lines += 1
  		score += 100
  		!isMuted && playAudio("/sounds/clickNotAllowed.mp3")
  	})
  }

	const keyDown = (event: KeyboardEvent) => {
		if (!isPlaying || !gameIsFocused) return

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
			scoreByVelocity += 1
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
	}

	const getFallInterval = (): number => {
		const baseInterval = 1000
		const reductionPerLevel = 100
		return Math.max(100, baseInterval - (internalLevel - 1) * reductionPerLevel)
	}

	onMount(() => {
		blockSize = getBlockSize()
		tetrisContext = tetrisCanvasHTML.getContext("2d") as CanvasRenderingContext2D
		nextPieceContext = nextPieceCanvasHTML.getContext("2d") as CanvasRenderingContext2D

		tetrisCanvasHTML.width = blockSize * BOARD_WIDTH
		tetrisCanvasHTML.height = blockSize * BOARD_HEIGHT

		tetrisContext.scale(blockSize, blockSize)

		document.addEventListener("keydown", keyDown)
		tetrisAudio = playAudio("/sounds/tetris.mp3", 0.5)
		drawNextPiece()
		update()
	})

	afterUpdate(() => {
		if (isMuted || !isPlaying) {
			tetrisAudio?.pause()
		} else {
			void tetrisAudio?.play()
		}
	})

	onDestroy(() => {
		isPlaying = false
		destroyAudio(tetrisAudio)
		resetBoard()
		resetMovingPiece()
		document.removeEventListener("keydown", keyDown)
	})
</script>

<section class="tetris-border">
	<div class="border-color-down flex flex-col pt-4 p-3 pb-1">
		<strong>{$t("tetrisGame.score")}:</strong>
		<strong class="pl-2 text-blue-800">{score}</strong>
		<strong>{$t("tetrisGame.level")}:</strong>
		<strong class="pl-2 text-blue-800">{internalLevel}</strong>
		<strong>{$t("tetrisGame.lines")}:</strong>
		<strong class="pl-2 text-blue-800">{lines}</strong>
		<div class="border-color-down flex flex-col items-center px-2 w-20 h-20">
			<strong>{$t("tetrisGame.next")}</strong>
			<canvas class="next-piece-canvas" bind:this={nextPieceCanvasHTML} />
		</div>
	</div>
</section>
<section class="tetris-border">
	<canvas class="tetris-canvas border-color-down" bind:this={tetrisCanvasHTML} />
</section>

<style>
	.tetris-canvas {
		height: fit-content;
		padding: 7px;
		background: #bdbdbd;
	}

	.tetris-border {
		padding: 7px;
		background: #bdbdbd;
		border: 7px solid ;
		border-color: #f5f5f5 #777777 #777777 #f5f5f5;
	}
</style>
