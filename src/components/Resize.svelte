<script>
	export let minWidth = 100;
	export let minHeight = 50;

	const resize = (element) => {
		const top = document.createElement("div")
		top.direction = "north"
		top.classList.add("resizer")
		top.classList.add("top")
		
		const right = document.createElement("div")
		right.direction = "east"
		right.classList.add("resizer")
		right.classList.add("right")
		
		const bottom = document.createElement("div")
		bottom.direction = "south"
		bottom.classList.add("resizer")
		bottom.classList.add("bottom")

		const left = document.createElement("div")
		left.direction = "west"
		left.classList.add("resizer")
		left.classList.add("left")
		
		const topRight = document.createElement("div")
		topRight.direction = "northeast"
		topRight.classList.add("resizer")
		topRight.classList.add("top-right")
		
		const topLeft = document.createElement("div")
		topLeft.direction = "northwest"
		topLeft.classList.add("resizer")
		topLeft.classList.add("top-left")
		
		const bottomRight = document.createElement("div")
		bottomRight.direction = "southeast"
		bottomRight.classList.add("resizer")
		bottomRight.classList.add("bottom-right")
		
		const bottomLeft = document.createElement("div")
		bottomLeft.direction = "southwest"
		bottomLeft.classList.add("resizer")
		bottomLeft.classList.add("bottom-left")
				
		const resizers = [top, right, bottom, left, topRight, topLeft, bottomRight, bottomLeft]
		
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
		
		const onMouseup = (event) => {
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
				const newWidth = initialRect.width + delta;
				if (minWidth < newWidth) element.style.width = `${newWidth}px`
			}
			
			if (direction.match("west")) {
				delta = cursorPosition.x - event.pageX
				const newWidth = initialRect.width + delta;
				if (minWidth < newWidth) {
					element.style.left = `${initialRect.left - delta}px`
					element.style.width = `${newWidth}px`
				}
			}
			
			if (direction.match("north")) {
				delta = cursorPosition.y - event.pageY
				const newHeight = initialRect.height + delta;
				if (minHeight < newHeight) {
					element.style.height = `${newHeight}px`
					element.style.top = `${initialRect.top - delta}px`
				}
			}
			
			if (direction.match("south")) {
				delta = event.pageY - cursorPosition.y
				const newHeight = initialRect.height + delta;
				if (minHeight < newHeight) element.style.height = `${newHeight}px`
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

<section class="h-0 w-0" style="--minWidth:{minWidth}; --minHeight:{minHeight};">
	<div class="redizable-box" use:resize>
		Redizable-box
	</div>
</section>

<style>
	.redizable-box {
		left: 300px;
		top: 100px;
		height: calc(var(--minHeight) * 1px);
		width: calc(var(--minWidth) * 1px);
		background: #e5e5e5;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		user-select: none;
	}
	
	:global(.resizer) {
		position: absolute;
		box-sizing: border-box; 
	}
	
	:global(.resizer.right) {
		width: 4px;
		height: 100%;
		background: red;
		right: -2px;
		cursor: e-resize;
	}
	
	:global(.resizer.left) {
		width: 4px;
		height: 100%;
		background: blue;
		left: -2px;
		cursor: e-resize;
	}
	
	:global(.resizer.top) {
		height: 4px;
		width: 100%;
		background: green;
		top: -2px;
		cursor: n-resize;
	}
	
	:global(.resizer.bottom) {
		height: 4px;
		width: 100%;
		background: orange;
		bottom: -2px;
		cursor: n-resize;
	}
	
	:global(.resizer.top-left) {
		height: 8px;
		width: 8px;
		background: orange;
		top: -4px;
		left: -4px;
		cursor: nw-resize;
		border-radius: 100%;
	}
	
	:global(.resizer.top-right) {
		height: 8px;
		width: 8px;
		background: orange;
		top: -4px;
		right: -4px;
		cursor: ne-resize;
		border-radius: 100%;
	}
	
	:global(.resizer.bottom-left) {
		height: 8px;
		width: 8px;
		background: green;
		bottom: -4px;
		left: -4px;
		cursor: sw-resize;
		border-radius: 100%;
	}
	
	:global(.resizer.bottom-right) {
		height: 8px;
		width: 8px;
		background: green;
		bottom: -4px;
		right: -4px;
		cursor: se-resize;
		border-radius: 100%;
	}
</style>