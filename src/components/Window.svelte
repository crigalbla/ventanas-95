<script lang="ts">
  import { onMount } from "svelte"

  import { user, removeWindow, windows } from "@/stores"
  import type { IndividualWindowType, UserType, WindowsType } from "@/stores"
  import { t } from "@/i18n"

  import Draggable from "./Draggable.svelte"
  import WindowButton from "./WindowButton.svelte"
  import Resize from "./Resize.svelte"
  import { avaliableDimensions, doItClickEvent } from "@/utils"

  export let title: string
  export let windowId: string = undefined!
  export let icon: string = undefined!
  export let hasQuestionButton = false
  export let canBeHidden = false
  export let canBeMaximizedOrMinimized = false
  export let canBeResized = true
  export let canBeDraggabled = true
  export let canLoseFocus = true
  export let isMinimized = false
  export let isFullScreen = false
  export let isFocused = true
  export let initialWidth = 0
  export let initialHeight = 0
  export let left: number = undefined!
  export let top: number = undefined!
  export let maxWidth = 0
  export let zIndex = 0
  export let closeCallBack: () => void = undefined!

  const headerHeight = 24
  let width: number
	let height: number
  let minWidth: number
  let minHeight: number
  let windowDiv: HTMLElement
  let oldWidth: number
  let oldHeight: number
  let oldTop: number
  let oldLeft: number

  const doIfIsFullScreen = () => {
  	if (isFullScreen) {
  		const { avaliableWidth, avaliableHeight } = avaliableDimensions()
  		width = avaliableWidth
  		height = avaliableHeight
  		top = 0
  		left = 0
  		canBeDraggabled = false
  		canBeResized = false
  	}
  }

  doIfIsFullScreen()

  const onQuestionButtonClick = (event: Event) => {
  	const helpButton: HTMLButtonElement = event.target as HTMLButtonElement
  	const modifyCursor = (cursor: string = "", pointerEvents: string = "") => {
  		windowDiv.style.cursor = cursor
  		for (const child of windowDiv.children) {
  			(child as HTMLElement).style.pointerEvents = pointerEvents
  		}
  	}

  	const removeHelpCursor = () => {
  		modifyCursor()
  		helpButton?.classList.remove("border-color-down")
  		windowDiv.removeEventListener("click", removeHelpCursor)
  	}

  	helpButton?.classList.add("border-color-down")
  	modifyCursor("url('/cursors/help.cur'), help", "none")
  	setTimeout(() => windowDiv.addEventListener("click", removeHelpCursor), 1)
  }

  const onHideButtonClick = () => {
  	windows.update((ws: WindowsType) =>
  		ws.map((w: IndividualWindowType) => w.windowId === windowId ? ({ ...w, isMinimized: !isMinimized, isFocused: !isFocused }) : w))
  }

  const onMaximizeOrMinimizeButtonClick = () => {
  	if (isFullScreen) {
  		width = oldWidth
  		height = oldHeight
  		top = oldTop
  		left = oldLeft
  		canBeDraggabled = true
  		canBeResized = true
  	} else {
  		const { avaliableWidth, avaliableHeight } = avaliableDimensions()
  		oldWidth = width
  		oldHeight = height
  		oldTop = top
  		oldLeft = left
  		width = avaliableWidth
  		height = avaliableHeight
  		top = 0
  	  left = 0
  		canBeDraggabled = false
  		canBeResized = false
  	}

  	isFullScreen = !isFullScreen
  }

  const onCloseButtonClick = () => {
  	closeCallBack && closeCallBack()
  	removeWindow(windowId)
  	if (windowId === "login") user.update((u: UserType) => ({ ...u, isLoggedIn: true }))
  }

  const onFocus = () => windows.update((ws: WindowsType) => {
  	const oldZIndex: number = ws.find((w: IndividualWindowType) => w.windowId === windowId)?.zIndex as number

  	return ws.map((w: IndividualWindowType) => {
  		if (w.windowId === windowId) return ({ ...w, isFocused: true, zIndex: ws.length })
  		if ((w.zIndex as number) > oldZIndex) return ({ ...w, zIndex: (w.zIndex as number) - 1 })

  		return w
  	})
  })

  const onUnFocus = () => windows.update((ws: WindowsType) =>
  		ws.map((w: IndividualWindowType) => w.windowId === windowId ? ({ ...w, isFocused: false }) : w))

  onMount(() => {
  	width = minWidth = windowDiv.offsetWidth
  	height = minHeight = windowDiv.offsetHeight

  	if (!left && !top) {
  		const rect = windowDiv.getBoundingClientRect()
  		top = rect.top
  		left = rect.left
  	}

  	if (canLoseFocus) {
  		const { removeEvent } = doItClickEvent({
  			searchElement: `#${windowId}`,
  			callBackClickOutside: onUnFocus,
  			callBackInside: onFocus,
  			avoidCallBacksIfThisElement: `#${windowId}-tab`
  		})
  		return removeEvent
  	}
  })
</script>

<div
  class="background-silver border-color-up window-sizes absolute"
  class:window-center={typeof left === "undefined" && typeof top === "undefined"}
  class:window-position={typeof left === "number" || typeof top === "number"}
  class:window-max-width={maxWidth}
  class:display-none={isMinimized}
  id={windowId}
  style="--zIndex:{zIndex}; --left:{left}; --top:{top}; --width:{initialWidth || width}; --height:{initialHeight || height};
         --maxWidth:{maxWidth}; --minWidth:{minWidth}; --minHeight:{minHeight}; --headerHeight:{headerHeight + 2}"
  bind:this={windowDiv}
>
  <Resize fake {canBeResized} {minWidth} {minHeight} bind:width bind:height bind:top bind:left>
    <div class="h-full w-full">
      <Draggable fake {canBeDraggabled} bind:left bind:top>
        <div class={`${isFocused
        	? "background-window-head"
        	: "background-dark-silver"
        } window-header-height flex justify-between h-6 px-1 m-px`}>
          <div class="flex items-center">
            {#if icon}
              <img class="h-5 w-5" src={`icons/${icon}.png`} alt={icon} draggable="false"/>
            {/if}
            <span class="text-white ml-1">{$t(title)}</span>
          </div>
          <div class="flex self-center gap-1 ml-4">
            {#if hasQuestionButton}
              <WindowButton on:click={onQuestionButtonClick}>?</WindowButton>
            {/if}
            {#if canBeHidden}
              <WindowButton on:click={onHideButtonClick}>_</WindowButton>
            {/if}
            {#if canBeMaximizedOrMinimized}
              <WindowButton on:click={onMaximizeOrMinimizeButtonClick}>
                {#if isFullScreen}
                  <img class="h-3 w-3" src="icons/minimalist-window.png" alt="minimalist-window" draggable="false"/>
                {:else}
                  <img class="h-3 w-3" src="icons/minimalist-windows.png" alt="minimalist-windows" draggable="false"/>
                {/if}
              </WindowButton>
            {/if}
            <WindowButton on:click={onCloseButtonClick}>X</WindowButton>
          </div>
        </div>
      </Draggable>
      <slot />
    </div>
  </Resize>
</div>

<style>
  .window-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .window-position {
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
  }

  .window-sizes {
    height: calc(var(--height) * 1px);
		width: calc(var(--width) * 1px);
		min-height: calc(var(--minHeight) * 1px);
		min-width: calc(var(--minWidth) * 1px);
    z-index: var(--zIndex);
  }
</style>
