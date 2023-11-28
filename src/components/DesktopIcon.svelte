<script lang="ts">
  import { onMount } from "svelte"
  import { t } from "@/i18n"
  import { doItDblClickEvent, doItMouseDownEvent } from "@/utils"
  import { updateDesktopIconParams } from "@/stores"
  import Draggable from "./Draggable.svelte"

  export let desktopIconId: string
  export let icon: string
  export let text: string
  export let isFocused: boolean = false
  export let zIndex: number = 0
  export let top: number = 0
  export let left: number = 0

  let desktopIconRef: HTMLElement

  const onClickInDesktopIcon = () => updateDesktopIconParams(desktopIconId, { isFocused: true })
  const onDbClickInDesktopIcon = () => console.log("dobleClick")
  const onClickOutSide = () => updateDesktopIconParams(desktopIconId, { isFocused: false })

  onMount(() => {
  	const { removeEvent: removeMouseDownEvent } = doItMouseDownEvent({
  		searchElement: `#${desktopIconId}`,
  		callBackMouseDownOutside: onClickOutSide,
  		callBackInside: onClickInDesktopIcon
  	})

  	const { removeEvent: removeDbClickEvent } = doItDblClickEvent({
  		searchElement: `#${desktopIconId}`,
  		callBackInside: onDbClickInDesktopIcon
  	})

  	return () => {
  		removeMouseDownEvent()
  		removeDbClickEvent()
  	}
  })
</script>

<Draggable id={desktopIconId} {top} {left}>
  <section
    class="desktop-icon flex flex-col items-center text-center absolute w-16"
    id={desktopIconId}
    style="--zIndex:{zIndex}; --left:{left}; --top:{top};"
    bind:this={desktopIconRef}
  >
    <img
      class="h-8 w-8 mb-2"
      class:blue-tone={isFocused}
      src={`icons/${icon}.png`}
      alt={icon}
      draggable="false"
    />
    <span
      class="text text-white text-sm leading-none"
      class:focused={isFocused}
    >{$t(text)}</span>
  </section>
</Draggable>

<style>
  .desktop-icon {
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    z-index: var(--zIndex);
  }

  .text {
    margin: 1px;
    padding: 1px 1px 0px 1px;
  }

  .focused {
    margin: 0px;
    border: 1px dotted white;
    background-color: #0000aa;
  }

  .blue-tone {
    filter: sepia(1) saturate(25) hue-rotate(180deg) brightness(0.7)
  }
</style>
