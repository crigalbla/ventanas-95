<script>
	export let width;
	export let height;
	export let minWidth;
	export let minHeight;
	export let top;
	export let left;
	export let canBeResized = true;

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
		
		let active = null, initialRect = null, cursorPosition = null
		
		const onMousedown = (event) => {
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
			
			active = null
			initialRect = null
			cursorPosition = null
		}
		
		const onMove = (event) => {
			if (!active) return
			
			const direction = active.direction
			let delta
			
			if (direction.match("east")) {
				delta = event.pageX - cursorPosition.x
				const newWidth = initialRect.width + delta
				if (minWidth < newWidth) {
					width = newWidth;
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
	<div class="redizable-box sizes" use:resize>
		<div class="sizes"><slot /></div>
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
	}

	.sizes {
		height: calc(var(--height) * 1px);
		width: calc(var(--width) * 1px);
		min-height: calc(var(--minHeight) * 1px);
		min-width: calc(var(--minWidth) * 1px);
	}
	
	.resizer {
		position: absolute;
		box-sizing: border-box; 
	}
	
	.resizer.right {
		width: 4px;
		height: 100%;
		background: red;
		right: -2px;
		cursor: e-resize;
	}
	
	.resizer.left {
		width: 4px;
		height: 100%;
		background: blue;
		left: -2px;
		cursor: e-resize;
	}
	
	.resizer.top {
		height: 4px;
		width: 100%;
		background: green;
		top: -2px;
		cursor: n-resize;
	}
	
	.resizer.bottom {
		height: 4px;
		width: 100%;
		background: orange;
		bottom: -2px;
		cursor: n-resize;
	}
	
	.resizer.top-left {
		height: 8px;
		width: 8px;
		background: orange;
		top: -4px;
		left: -4px;
		cursor: nw-resize;
		border-radius: 100%;
	}
	
	.resizer.top-right {
		height: 8px;
		width: 8px;
		background: orange;
		top: -4px;
		right: -4px;
		cursor: ne-resize;
		border-radius: 100%;
	}
	
	.resizer.bottom-left {
		height: 8px;
		width: 8px;
		background: green;
		bottom: -4px;
		left: -4px;
		cursor: sw-resize;
		border-radius: 100%;
	}
	
	.resizer.bottom-right {
		height: 8px;
		width: 8px;
		background: green;
		bottom: -4px;
		right: -4px;
		cursor: se-resize;
		border-radius: 100%;
	}
</style>