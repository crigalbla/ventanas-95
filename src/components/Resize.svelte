<script>
  import { mouseOutOfScreen } from "@/utils"

	export let width
	export let height
	export let minWidth
	export let minHeight
	export let top
	export let left
	export let canBeResized = true

	const resize = (element) => {
		const resizerTop = document.querySelector(".resizer.top")
		resizerTop.direction = "north"

		const resizerRight = document.querySelector(".resizer.right")
		resizerRight.direction = "east"

		const resizerBottom = document.querySelector(".resizer.bottom")
		resizerBottom.direction = "south"

		const resizerLeft = document.querySelector(".resizer.left")
		resizerLeft.direction = "west"

		const resizerTopRight = document.querySelector(".resizer.top-right")
		resizerTopRight.direction = "northeast"

		const resizerTopLeft = document.querySelector(".resizer.top-left")
		resizerTopLeft.direction = "northwest"

		const resizerBottomRight = document.querySelector(".resizer.bottom-right")
		resizerBottomRight.direction = "southeast"

		const resizerBottomLeft = document.querySelector(".resizer.bottom-left")
		resizerBottomLeft.direction = "southwest"

		const resizers = [resizerTop, resizerRight, resizerBottom, resizerLeft, resizerTopRight, resizerTopLeft, resizerBottomRight, resizerBottomLeft]
		const html = document.querySelector("html")
		const body = document.querySelector("body")

		let active = null; let initialRect = null; let cursorPosition = null

		const onMousedown = (event) => {
			const estiloCalculado = window.getComputedStyle(event.toElement)
			const cursor = estiloCalculado.cursor

			html.style.cursor = cursor
			body.style.pointerEvents = "none"

			active = event.target
			const rect = element.getBoundingClientRect()
			const parent = element.parentElement.getBoundingClientRect()

			initialRect = {
				width: rect.width,
				height: rect.height,
				left: rect.left - parent.left,
				right: parent.right - rect.right,
				top: rect.top - parent.top,
				bottom: parent.bottom - rect.bottom
			}
			cursorPosition = { x: event.pageX, y: event.pageY }
		}

		const onMouseup = () => {
			if (!active) return

			html.style.cursor = null
			body.style.pointerEvents = null
			active = null
			initialRect = null
			cursorPosition = null
		}

		const onMove = (event) => {
			if (!active || mouseOutOfScreen(event)) return

			const direction = active.direction
			let delta

			if (direction.match("east")) {
				delta = event.pageX - cursorPosition.x
				const newWidth = initialRect.width + delta
				if (minWidth < newWidth) {
					width = newWidth
				}
			}

			if (direction.match("west")) {
				delta = cursorPosition.x - event.pageX
				const newWidth = initialRect.width + delta
				if (minWidth < newWidth) {
					width = newWidth
					left = event.pageX
				}
			}

			if (direction.match("north")) {
				delta = cursorPosition.y - event.pageY
				const newHeight = initialRect.height + delta
				if (minHeight < newHeight) {
					height = newHeight
					top = event.pageY
				}
			}

			if (direction.match("south")) {
				delta = event.pageY - cursorPosition.y
				const newHeight = initialRect.height + delta
				if (minHeight < newHeight) {
					height = newHeight
				}
			}
		}

		resizers.forEach(resizer => {
			element.appendChild(resizer)
			resizer.addEventListener("mousedown", onMousedown)
		})

		window.addEventListener("mousemove", onMove)
		window.addEventListener("mouseup", onMouseup)

		return () => {
			window.removeEventListener("mousemove", onMove)
			window.removeEventListener("mousemove", onMousedown)

			resizers.forEach(resizer => element.removeChild(resizer))
		}
	}
</script>

{#if canBeResized}
	<div class="redizable-box" use:resize>
		<slot />
		<div class="resizer top"/>
		<div class="resizer right" />
		<div class="resizer bottom" />
		<div class="resizer left" />
		<div class="resizer top-right" />
		<div class="resizer top-left" />
		<div class="resizer bottom-right" />
		<div class="resizer bottom-left" />
	</div>
{:else}
	<slot />
{/if}

<style>
	.redizable-box {
		background: #e5e5e5;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		user-select: none;
		height: 100%;
	}

	.resizer {
		position: absolute;
		box-sizing: border-box;
	}

	.resizer.right {
		width: 4px;
		height: 100%;
		right: -2px;
		cursor: url('/cursors/e-resize.cur'), e-resize;
	}

	.resizer.left {
		width: 4px;
		height: 100%;
		left: -2px;
		cursor: url('/cursors/e-resize.cur'), e-resize;
	}

	.resizer.top {
		height: 4px;
		width: 100%;
		top: -2px;
		cursor: url('/cursors/n-resize.cur'), n-resize;
	}

	.resizer.bottom {
		height: 4px;
		width: 100%;
		bottom: -2px;
		cursor: url('/cursors/n-resize.cur'), n-resize;
	}

	.resizer.top-left {
		height: 8px;
		width: 8px;
		top: -4px;
		left: -4px;
		cursor: url('/cursors/nw-resize.cur'), nw-resize;
		border-radius: 100%;
	}

	.resizer.top-right {
		height: 8px;
		width: 8px;
		top: -4px;
		right: -4px;
		cursor: url('/cursors/ne-resize.cur'), ne-resize;
		border-radius: 100%;
	}

	.resizer.bottom-left {
		height: 8px;
		width: 8px;
		bottom: -4px;
		left: -4px;
		cursor: url('/cursors/ne-resize.cur'), sw-resize;
		border-radius: 100%;
	}

	.resizer.bottom-right {
		height: 8px;
		width: 8px;
		bottom: -4px;
		right: -4px;
		cursor: url('/cursors/nw-resize.cur'), se-resize;
		border-radius: 100%;
	}
</style>
