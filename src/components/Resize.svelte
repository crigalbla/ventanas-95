<script>
  import { freezeCurrentCursor, mouseOutOfScreen, unfreezeCurrentCursor } from "@/utils"
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
	let resizing = false
	let fakeResize

	const resize = (element) => {
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

	  let active = null; let initialRect = null; let cursorPosition = null

	  const onMouseDown = (event) => {
			freezeCurrentCursor(event)
			resizing = true

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

	  const onMouseUp = () => {
	    if (!active) return

			unfreezeCurrentCursor()
			resizing = false
	    active = null
	    initialRect = null
	    cursorPosition = null

			if (fake) {
				fakeResize.classList.add("display-none")
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
	    if (!active || !resizing || mouseOutOfScreen(event)) return

			fakeResize.classList.remove("display-none")
	    const direction = active.direction
	    let delta

	    if (direction.match("east")) {
				delta = event.pageX - cursorPosition.x
	      const newWidth = initialRect.width + delta
	      if (minWidth < newWidth) {
					if (fake) {
						fakeWidth = newWidth
					} else {
						updateWindowParams(windowId, { width: newWidth })
					}
	      }
	    }

	    if (direction.match("west")) {
	      delta = cursorPosition.x - event.pageX
	      const newWidth = initialRect.width + delta
	      if (minWidth < newWidth) {
					if (fake) {
						fakeWidth = newWidth
						fakeLeft += event.movementX
					} else {
						updateWindowParams(windowId, { left: event.pageX, width: newWidth })
					}
	      }
	    }

	    if (direction.match("north")) {
	      delta = cursorPosition.y - event.pageY
	      const newHeight = initialRect.height + delta
	      if (minHeight < newHeight) {
					if (fake) {
						fakeHeight = newHeight
						fakeTop += event.movementY
					} else {
						updateWindowParams(windowId, { top: event.pageY, height: newHeight })
					}
	      }
	    }

	    if (direction.match("south")) {
	      delta = event.pageY - cursorPosition.y
	      const newHeight = initialRect.height + delta
	      if (minHeight < newHeight) {
					if (fake) {
						fakeHeight = newHeight
					} else {
						updateWindowParams(windowId, { height: newHeight })
					}
	      }
	    }
	  }

	  resizers.forEach(resizer => {
	    element.appendChild(resizer)
	    resizer.addEventListener("mousedown", onMouseDown)
	  })

	  window.addEventListener("mousemove", onMouseMove)
	  window.addEventListener("mouseup", onMouseUp)

	  return () => {
	    window.removeEventListener("mousemove", onMouseMove)
	    window.removeEventListener("mousemove", onMouseDown)

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
		{#if fake && resizing}
			<div
				class="fake-resize display-none"
				bind:this={fakeResize}
				style="--fakeWidth:{fakeWidth || width}; --fakeHeight:{fakeHeight || height}; --fakeTop:{fakeTop}; --fakeLeft:{fakeLeft}"
			/>
		{/if}
	</div>
{:else}
	<slot />
{/if}

<style>
	.redizable-box {
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
