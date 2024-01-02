<script lang="ts">
  import { desktopIcons, type DesktopIconsType, type IndividualDesktopIconType } from "@/stores"
  import { freezeCurrentCursor, isMouseOutOfScreen, unfreezeCurrentCursor } from "@/utils"
  import { DESKTOP_SCREEN_ID } from "@/constants"
  import { onMount } from "svelte"

  let width: number
  let height: number
  let top: number
  let left: number
  let isShowed = false
  let isMouseDown = false
  let initialCursorPosition: { x: number, y: number }

  onMount(() => {
  	const createEvents = () => {
  		const desktopScreen = document.querySelector(`#${DESKTOP_SCREEN_ID}`) as HTMLElement
  		const isMouseInDesktopScreen = (event: MouseEvent) => desktopScreen === event.target
  		const updateIconFocus = () => desktopIcons.update((dis: DesktopIconsType) =>
  			dis.map((di: IndividualDesktopIconType) => {
  				const desktopIconHTML = document.querySelector(`#${di.desktopIconId}`)
  				const rect = desktopIconHTML?.getBoundingClientRect() as DOMRect
  				const rectAjusted = {
  					right: rect.right - 15,
  					left: rect.left + 15,
  					bottom: rect.bottom - 15,
  					top: rect.top + 15
  				}

  				if (
  					!(rectAjusted.right < left ||
              rectAjusted.left > left + width ||
              rectAjusted.bottom < top ||
              rectAjusted.top > top + height)
  				) {
  					if (di.isFocused) return di
  					return { ...di, isFocused: true }
  				} else {
  					if (di.isFocused) return { ...di, isFocused: false }
  					return di
  				}
  			})
  		)

  		const onMouseDown = (event: MouseEvent) => {
  			if (isMouseInDesktopScreen(event)) {
  				isMouseDown = true
  				top = event.pageY
  				left = event.pageX
  				initialCursorPosition = { x: event.pageX, y: event.pageY }
  			}
  		}

  		const onMouseUp = () => {
  			if (isMouseDown) {
  				unfreezeCurrentCursor()
  				isMouseDown = false
  				isShowed = false
  				height = 0
  				width = 0
  			}
  		}

  		const onMouseMove = (event: MouseEvent) => {
  			if (isMouseDown && !isMouseOutOfScreen(event)) {
  				freezeCurrentCursor(event)
  				isShowed = height > 2 || width > 2

  				if (initialCursorPosition.y > event.pageY) {
  					height = initialCursorPosition.y - event.pageY
  					top = event.pageY
  				} else {
  					height = event.pageY - top
  				}

  				if (initialCursorPosition.x > event.pageX) {
  					width = initialCursorPosition.x - event.pageX
  					left = event.pageX
  				} else {
  					width = event.pageX - left
  				}

  				updateIconFocus()
  			}
  		}

  		window.addEventListener("mousedown", onMouseDown)
  		window.addEventListener("mousemove", onMouseMove)
  		window.addEventListener("mouseup", onMouseUp)

  		return () => {
  			window.removeEventListener("mousedown", onMouseDown)
  			window.removeEventListener("mousemove", onMouseMove)
  			window.removeEventListener("mouseup", onMouseUp)
  		}
  	}

  	createEvents()
  })
</script>

{#if isShowed}
  <section
    class="icons-selector"
    style="--width:{width}; --height:{height}; --top:{top}; --left:{left}"
  />
{/if}

<style>
  .icons-selector {
    border: 1px dotted black;
		position: absolute;
		top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
		width: calc(var(--width) * 1px);
    height: calc(var(--height) * 1px);
    z-index: 499;
  }
</style>
