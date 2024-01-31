<script lang="ts">
	import { desktopIcons, type DesktopIconsType, type IndividualDesktopIconType } from "@/stores"
  import { freezeCurrentCursor, isMouseOutOfThisElement, unfreezeCurrentCursor } from "@/utils"
  import { DESKTOP_ROUTE } from "@/constants"
  import { onMount } from "svelte"

	export let rangeToMoveMouse: HTMLElement
	export let relativeCoordinates = { top: 0, left: 0 }
	export let folderRoute = DESKTOP_ROUTE

  let width: number
  let height: number
  let top: number
  let left: number
  let isShowed = false
  let isMouseDown = false
  let initialCursorPosition: { x: number, y: number }

  onMount(() => {
  	const createEvents = () => {
  		const isMouseInThisHTMLElement = (event: MouseEvent) => rangeToMoveMouse === event.target
  		const updateIconFocus = () => desktopIcons.update((dis: DesktopIconsType) =>
  			dis.map((di: IndividualDesktopIconType) => {
  				const desktopIconHTML = document.querySelector(`#${di.desktopIconId}`)

  				if (!desktopIconHTML || folderRoute !== di.route) return di

  				const rect = desktopIconHTML.getBoundingClientRect()
  				const rectAjusted = {
  					right: rect.right - relativeCoordinates.left - 15,
  					left: rect.left - relativeCoordinates.left + 15,
  					bottom: rect.bottom - relativeCoordinates.top - 15,
  					top: rect.top - relativeCoordinates.top + 15
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
  			const isLeftClick = event.button === 0
  			if (isMouseInThisHTMLElement(event) && isLeftClick) {
  				isMouseDown = true
  				top = event.pageY - relativeCoordinates.top
  				left = event.pageX - relativeCoordinates.left
  				initialCursorPosition = { x: event.pageX, y: event.pageY }
  			}
  		}

  		const onMouseUp = () => {
  			if (isMouseDown) {
  				isShowed && unfreezeCurrentCursor()
  				isMouseDown = false
  				isShowed = false
  				height = 0
  				width = 0
  			}
  		}

  		const onMouseMove = (event: MouseEvent) => {
  			const isLeftClick = event.button === 0
  			if (isMouseDown && !isMouseOutOfThisElement(event, rangeToMoveMouse) && isLeftClick) {
  				isShowed = height > 2 || width > 2
  				isShowed && freezeCurrentCursor(event)

  				if (initialCursorPosition.y > event.pageY) {
  					height = initialCursorPosition.y - event.pageY
  					top = event.pageY - relativeCoordinates.top
  				} else {
  					height = event.pageY - top - relativeCoordinates.top
  				}

  				if (initialCursorPosition.x > event.pageX) {
  					width = initialCursorPosition.x - event.pageX
  					left = event.pageX - relativeCoordinates.left
  				} else {
  					width = event.pageX - left - relativeCoordinates.left
  				}

  				updateIconFocus()
  			}
  		}

  		rangeToMoveMouse.addEventListener("mousedown", onMouseDown)
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
