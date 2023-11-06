<script lang="ts">
  import { onMount } from "svelte"

  import { windows, user, removeWindow } from "@/stores"
  import type { UserType, WindowsType } from "@/stores"
  import { t } from "@/i18n"

  import Draggable from "./Draggable.svelte"
  import WindowButton from "./WindowButton.svelte"
  import Resize from "./Resize.svelte"
  import { avaliableDimensions } from "@/utils"

  export let title: string
  export let windowId: string
  export let icon: string = undefined!
  export let hasQuestionButton = false
  export let canBeHidden = false
  export let canBeMaximizedOrMinimized = false
  export let canBeResized = true
  export let isLogin = false
  export let isMinimized = false
  export let isFullScreen = false
  export let initialWidth = 0
  export let initialHeight = 0
  export let left: number = undefined!
  export let top: number = undefined!
  export let maxWidth = 0
  export let zIndex = 0

  const headerHeight = 24
  let canBeDraggabled = true
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
  const onHideButtonClick = () => console.log("_")
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
  	removeWindow(windowId)
  	if (isLogin) user.update((u: UserType) => ({ ...u, isLoggedIn: true }))
  }

  onMount(() => {
  	width = minWidth = windowDiv.offsetWidth
  	height = minHeight = windowDiv.offsetHeight

  	if (!left && !top) {
  		const rect = windowDiv.getBoundingClientRect()
  		top = rect.top
  		left = rect.left
  	}
  })
</script>

<div
  class="background-silver border-color-up window-sizes absolute"
  class:window-center={typeof left === "undefined" && typeof top === "undefined"}
  class:window-position={typeof left === "number" || typeof top === "number"}
  class:window-max-width={maxWidth}
  style="--zIndex:{zIndex}; --left:{left}; --top:{top}; --width:{width || initialWidth}; --height:{initialHeight || height};
         --maxWidth:{maxWidth}; --minWidth:{minWidth}; --minHeight:{minHeight}; --headerHeight:{headerHeight + 2}"
  bind:this={windowDiv}
>
  <Resize fake {canBeResized} {minWidth} {minHeight} bind:width bind:height bind:top bind:left>
    <div class="h-full w-full">
      <Draggable fake {canBeDraggabled} bind:left bind:top>
        <div class="background-window-head window-header-height flex justify-between h-6 px-1 m-px">
          <span class="text-white">{$t(title)}</span>
          <div class="flex self-center gap-1">
            {#if hasQuestionButton}
              <WindowButton on:click={onQuestionButtonClick}>?</WindowButton>
            {/if}
            {#if canBeHidden}
              <WindowButton on:click={onHideButtonClick}>_</WindowButton>
            {/if}
            {#if canBeMaximizedOrMinimized}
              <WindowButton on:click={onMaximizeOrMinimizeButtonClick}>
                {#if isFullScreen}
                  <img class="h-3 w-3" src="icons/minimalist-window.png" alt="minimalist-window"/>
                {:else}
                  <img class="h-3 w-3" src="icons/minimalist-windows.png" alt="minimalist-windows"/>
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
