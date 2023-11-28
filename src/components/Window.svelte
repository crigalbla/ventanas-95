<script lang="ts">
  import { onMount } from "svelte"

  import { user, removeWindow, windows, updateWindowParams, loginWindowId } from "@/stores"
  import type { IndividualWindowType, UserType, WindowsType } from "@/stores"
  import { t } from "@/i18n"

  import Draggable from "./Draggable.svelte"
  import WindowButton from "./WindowButton.svelte"
  import Resize from "./Resize.svelte"
  import { avaliableDimensions, doItMouseDownEvent } from "@/utils"

  export let title: string
  export let windowId: string = undefined!
  export let icon: string = undefined!
  export let hasQuestionButton: boolean = false
  export let canBeHidden: boolean = false
  export let canBeMaximizedOrMinimized: boolean = false
  export let canBeResized: boolean = true
  export let canBeDraggabled: boolean = true
  export let canLoseFocus: boolean = true
  export let isMinimized: boolean = false
  export let isFullScreen: boolean = false
  export let isFocused: boolean = true
  export let initialWidth: number = 0
  export let initialHeight: number = 0
  export let left: number = undefined!
  export let top: number = undefined!
  export let maxWidth: number = 0
  export let zIndex: number = 0
  export let width: number = undefined!
	export let height: number = undefined!
  export let minWidth: number = undefined!
  export let minHeight: number = undefined!
  export let oldWidth: number = undefined!
  export let oldHeight: number = undefined!
  export let oldTop: number = undefined!
  export let oldLeft: number = undefined!
  export let closeCallBack: () => void = undefined!

  let windowDiv: HTMLElement = undefined!
  const headerHeight = 24

  const doIfIsFullScreen = () => {
  	if (isFullScreen) {
  		const { avaliableWidth, avaliableHeight } = avaliableDimensions()
  		updateWindowParams(windowId, {
  			width: avaliableWidth,
  			height: avaliableHeight,
  			top: 0,
  			left: 0,
  			canBeDraggabled: false,
  			canBeResized: false
  		})
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

  const onHideButtonClick = () => updateWindowParams(windowId, { isMinimized: !isMinimized, isFocused: !isFocused })

  const onMaximizeOrMinimizeButtonClick = () => {
  	if (isFullScreen) {
  		updateWindowParams(windowId, {
  			width: oldWidth,
  			height: oldHeight,
  			top: oldTop,
  			left: oldLeft,
  			canBeDraggabled: true,
  			canBeResized: true,
  	    isFullScreen: false
  		})
  	} else {
  		const { avaliableWidth, avaliableHeight } = avaliableDimensions()
  		updateWindowParams(windowId, {
  			oldWidth: width,
  			oldHeight: height,
  			oldTop: top,
  			oldLeft: left,
  			width: avaliableWidth,
  			height: avaliableHeight,
  			top: 0,
  			left: 0,
  			canBeDraggabled: false,
  			canBeResized: false,
  	    isFullScreen: true
  		})
  	}
  }

  const onCloseButtonClick = () => {
  	closeCallBack && closeCallBack()
  	removeWindow(windowId)
  	if (windowId === loginWindowId) user.update((u: UserType) => ({ ...u, isLoggedIn: true }))
  }

  const onFocus = () => windows.update((ws: WindowsType) => {
  	const oldZIndex: number = ws.find((w: IndividualWindowType) => w.windowId === windowId)?.zIndex as number

  	return ws.map((w: IndividualWindowType) => {
  		if (w.windowId === windowId) return ({ ...w, isFocused: true, zIndex: ws.length })
  		if ((w.zIndex as number) > oldZIndex) return ({ ...w, zIndex: (w.zIndex as number) - 1 })

  		return w
  	})
  })

  const onUnFocus = () => updateWindowParams(windowId, { isFocused: false })

  onMount(() => {
  	updateWindowParams(windowId, {
  		width: windowDiv.offsetWidth,
  		minWidth: windowDiv.offsetWidth,
  	  height: windowDiv.offsetHeight,
  		minHeight: windowDiv.offsetHeight
  	})

  	if (!left && !top) {
  		const rect = windowDiv.getBoundingClientRect()
  		updateWindowParams(windowId, { top: rect.top, left: rect.left })
  	}

  	if (canLoseFocus) {
  		const { removeEvent } = doItMouseDownEvent({
  			searchElement: `#${windowId}`,
  			callBackMouseDownOutside: onUnFocus,
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
  style="--zIndex:{zIndex}; --left:{left}; --top:{top}; --width:{width || initialWidth || ""}; --height:{height || initialHeight || ""};
         --maxWidth:{maxWidth}; --minWidth:{minWidth}; --minHeight:{minHeight}; --headerHeight:{headerHeight + 2}"
  bind:this={windowDiv}
>
  <Resize fake {canBeResized} {minWidth} {minHeight} {windowId} {top} {left} {width} {height}>
    <div class="h-full w-full">
      <Draggable id={windowId} fake {canBeDraggabled} {top} {left}>
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
