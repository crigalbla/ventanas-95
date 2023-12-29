<script lang="ts">
  import { DESKTOP_SCREEN_ID } from "@/constants"
  import { onMount } from "svelte"

  export let width: number
  export let height: number
  export let top: number
  export let left: number

  const isShowed = false

  onMount(() => {
  	const desktopScreen = document.querySelector(`#${DESKTOP_SCREEN_ID}`) as HTMLElement
  	const mouseDownEvent = (event: MouseEvent) => {
  		// TODO
  	}

  	desktopScreen.addEventListener("mousedown", mouseDownEvent)

  	return () => desktopScreen.removeEventListener("mousedown", mouseDownEvent)
  })
</script>

{#if isShowed}
  <section
    class="incos-selector"
    style="--width:{width}; --height:{height}; --top:{top}; --left:{left}"
  />
{/if}

<style>
  .incos-selector {
    border: 2px dotted black;
		position: absolute;
		top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
		width: calc(var(--width) * 1px);
    height: calc(var(--height) * 1px);
  }
</style>
