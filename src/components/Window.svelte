<script lang="ts">
  import { onMount } from "svelte"

  import { windowsHidden, user } from "@/stores"
  import type { UserType, WindowsHiddenType } from "@/stores"
  import { t } from "@/i18n"

  import Draggable from "./Draggable.svelte"
  import WindowButton from "./WindowButton.svelte"
  import Resize from "./Resize.svelte"

  export let title: string
  export let hasQuestionButton = false
  export let canBeMinimized = false
  export let canBeMaximized = false
  export let canBeResized = true
  export let isLogin = false
  export let initialWidth = 0
  export let initialHeight = 0
  export let left = 0
  export let top = 0
  export let maxWidth = 0

  const headerHeight = 24
  let width: number
	let height: number
  let minWidth: number
  let minHeight: number
  let windowDiv: HTMLElement

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
  const onMinimizeButtonClick = () => console.log("_")
  const onMaximizeButtonClick = () => console.log("❒")
  const onCloseButtonClick = () => {
  	windowsHidden.update((wH: WindowsHiddenType) => ({ ...wH, login: true }))
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
  class:display-none={$windowsHidden.login}
  class:window-center={!left && !top}
  class:window-position={left || top}
  class:window-max-width={maxWidth}
  style="--left:{left}; --top:{top}; --width:{width || initialWidth}; --height:{initialHeight || height};
         --maxWidth:{maxWidth}; --minWidth:{minWidth}; --minHeight:{minHeight}; --headerHeight:{headerHeight + 2}"
  bind:this={windowDiv}
>
  <Resize fake {canBeResized} {minWidth} {minHeight} bind:width bind:height bind:top bind:left>
    <div class="h-full w-full">
      <Draggable fake bind:left bind:top>
        <div class="background-window-head window-header-height flex justify-between h-6 px-1 m-px">
          <span class="text-white">{@html $t(title)}</span>
          <div class="flex self-center gap-1">
            {#if hasQuestionButton}
              <WindowButton on:click={onQuestionButtonClick}>?</WindowButton>
            {/if}
            {#if canBeMinimized}
              <WindowButton on:click={onMinimizeButtonClick}>_</WindowButton>
            {/if}
            {#if canBeMaximized}
              <WindowButton on:click={onMaximizeButtonClick}>❒</WindowButton>
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
  }
</style>
