<script>
  import { freezeCurrentCursor, isMouseOutOfDesktopScreen, unfreezeCurrentCursor } from "@/utils"
	import { updateWindowParams } from "@/stores"

	export let width
	export let height
	export let minWidth
	export let minHeight
	export let top
	export let left
	export let fake = false
	export let canBeResized = true
	export let windowId

	let fakeWidth = width
	let fakeHeight = height
	let fakeTop = 0
	let fakeLeft = 0
	let outOfScreenLeft = 0
	let outOfScreenTop = 0
	let resizing = false
	let fakeResizeRef

	const resize = (element) => {
		if (!canBeResized) return

	  const resizerTop = element.querySelector(".resizer.top")
	  resizerTop.direction = "north"

	  const resizerRight = element.querySelector(".resizer.right")
	  resizerRight.direction = "east"

	  const resizerBottom = element.querySelector(".resizer.bottom")
	  resizerBottom.direction = "south"

	  const resizerLeft = element.querySelector(".resizer.left")
	  resizerLeft.direction = "west"

	  const resizerTopRight = element.querySelector(".resizer.top-right")
	  resizerTopRight.direction = "northeast"

	  const resizerTopLeft = element.querySelector(".resizer.top-left")
	  resizerTopLeft.direction = "northwest"

	  const resizerBottomRight = element.querySelector(".resizer.bottom-right")
	  resizerBottomRight.direction = "southeast"

	  const resizerBottomLeft = element.querySelector(".resizer.bottom-left")
	  resizerBottomLeft.direction = "southwest"

	  const resizers = [resizerTop, resizerRight, resizerBottom, resizerLeft, resizerTopRight, resizerTopLeft, resizerBottomRight, resizerBottomLeft]

	  let active = null; let initialRect = null

	  const onMouseDown = (event) => {
			const isTouchStart = event.type === "touchstart"
			!isTouchStart && freezeCurrentCursor(event)
			resizing = true
			outOfScreenLeft = 0
			outOfScreenTop = 0

	    active = event.target
	    const rect = element.getBoundingClientRect()

	    initialRect = {
	      width: rect.width,
	      height: rect.height,
	      left: rect.left,
	      top: rect.top
	    }
	  }

	  const onMouseUp = (event) => {
	    if (!active) return

			const isTouchEnd = event.type === "touchend"
			!isTouchEnd && unfreezeCurrentCursor()
			resizing = false
	    active = null
	    initialRect = null

			if (fake) {
				updateWindowParams(windowId, {
					left: left + fakeLeft,
					top: top + fakeTop,
					width: fakeWidth || width,
					height: fakeHeight || height
				})
				width = fakeWidth || width
				height = fakeHeight || height

				fakeLeft = 0
				fakeTop = 0
			}
	  }

	  const onMouseMove = (event) => {
	    if (!active || !resizing) return

			const isTouchMove = event.type === "touchmove"
	    const direction = active.direction
	    let delta

	    if (direction.match("east")) {
				if (!isMouseOutOfDesktopScreen(event) || isTouchMove) {
					const newWidth = event.clientX - initialRect.left
					if (minWidth < newWidth) {
						if (fake) {
							fakeWidth = newWidth
						} else {
							updateWindowParams(windowId, { width: newWidth })
						}
	      	}
				}
	    }

	    if (direction.match("west")) {
				if (!isMouseOutOfDesktopScreen(event) || isTouchMove) {
					delta = initialRect.left - event.clientX
					const newWidth = initialRect.width + delta
					const newFakeLeft = event.clientX - left + outOfScreenLeft
					if (minWidth < newWidth) {
						if (fake) {
							fakeWidth = newWidth
							fakeLeft = newFakeLeft
						} else {
							updateWindowParams(windowId, { left: event.clientX + outOfScreenLeft, width: newWidth })
						}
						outOfScreenLeft = 0
	      	}
				} else {
					outOfScreenLeft += event.movementX
				}
	    }

	    if (direction.match("north")) {
				if (!isMouseOutOfDesktopScreen(event) || isTouchMove) {
					delta = initialRect.top - event.clientY
					const newHeight = initialRect.height + delta
					const newFakeTop = event.clientY - top + outOfScreenTop
					if (minHeight < newHeight) {
						if (fake) {
							fakeHeight = newHeight
							fakeTop = newFakeTop
						} else {
							updateWindowParams(windowId, { top: event.clientY + outOfScreenTop, height: newHeight })
						}
						outOfScreenTop = 0
	      	}
				} else {
					outOfScreenTop += event.movementY
				}
	    }

	    if (direction.match("south")) {
				if (!isMouseOutOfDesktopScreen(event) || isTouchMove) {
					const newHeight = event.clientY - initialRect.top
					if (minHeight < newHeight) {
						if (fake) {
							fakeHeight = newHeight
						} else {
							updateWindowParams(windowId, { height: newHeight })
						}
	      	}
				}
	    }
	  }

		const onTouchMove = (event) =>
			onMouseMove({ clientX: event.touches[0].clientX, clientY: event.touches[0].clientY, type: "touchmove" })
		const onTouchEnd = onMouseUp

	  resizers.forEach(resizer => {
	    element.appendChild(resizer)
	    resizer.addEventListener("mousedown", onMouseDown)
			resizer.addEventListener("touchstart", onMouseDown)
	  })

	  window.addEventListener("mousemove", onMouseMove)
	  window.addEventListener("mouseup", onMouseUp)
		window.addEventListener("touchmove", onTouchMove)
	  window.addEventListener("touchend", onTouchEnd)

	  return () => {
	    window.removeEventListener("mousemove", onMouseMove)
	    window.removeEventListener("mouseup", onMouseUp)
			window.removeEventListener("touchmove", onTouchMove)
	    window.removeEventListener("touchend", onTouchEnd)

	    resizers.forEach(resizer => element.removeChild(resizer))
	  }
	}
</script>

<!-- TODO eliminar condicionar para que solo haya un slot -->
<div class="h-full" class:resizable-box={canBeResized} use:resize={canBeResized}>
  <slot />

  {#if canBeResized}
    <div class="resizer top" />
    <div class="resizer right" />
    <div class="resizer bottom" />
    <div class="resizer left" />
    <div class="resizer top-right" />
    <div class="resizer top-left" />
    <div class="resizer bottom-right" />
    <div class="resizer bottom-left" />
    {#if fake && resizing}
      <div
        class="fake-resize"
        bind:this={fakeResizeRef}
        style="--fakeWidth:{fakeWidth || width}; --fakeHeight:{fakeHeight || height}; --fakeTop:{fakeTop}; --fakeLeft:{fakeLeft}"
      />
    {/if}
  {/if}
</div>

<style>
	.resizable-box {
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
		width: 5px;
		height: 100%;
		right: -3px;
		cursor: url('/cursors/e-resize.cur'), e-resize;
	}

	.resizer.left {
		width: 5px;
		height: 100%;
		left: -3px;
		cursor: url('/cursors/e-resize.cur'), e-resize;
	}

	.resizer.top {
		height: 5px;
		width: 100%;
		top: -3px;
		cursor: url('/cursors/n-resize.cur'), n-resize;
	}

	.resizer.bottom {
		height: 5px;
		width: 100%;
		bottom: -3px;
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

	.fake-resize {
		border: 2px dotted black;
		position: absolute;
		top: calc(var(--fakeTop) * 1px);
    left: calc(var(--fakeLeft) * 1px);
		width: calc(var(--fakeWidth) * 1px);
    height: calc(var(--fakeHeight) * 1px);
	}
</style>
