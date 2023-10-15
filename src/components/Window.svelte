<script lang="ts">
  import { onMount } from "svelte";

  import { windowsHidden } from "@/stores";
  import type { WindowsHiddenType } from "@/stores";
  import { t } from "@/i18n";
  
  import Draggable from "./Draggable.svelte";
  import WindowButton from "./WindowButton.svelte";
  import Resize from "./Resize.svelte";

  export let title: string;
  export let hasQuestionButton = false;
  export let canBeMinimized = false;
  export let canBeMaximized = false;
  export let canBeResized = true;
  export let left = 0;
  export let top = 0;
  export let maxWidth = 0;

  let width: number;
	let height: number;
  let minWidth = 200;
  let minHeight = 100;
  let headerHeight = 24;
  let windowDiv: HTMLElement;

  const onQuestionButtonClick = (e: Event) => console.log("?");
  const onMinimizeButtonClick = () => console.log("_");
  const onMaximizeButtonClick = () => console.log("❒");
  const onCloseButtonClick = () => windowsHidden.update((wH: WindowsHiddenType) => ({ ...wH, login: true }));

  onMount(() => {
    if (!left && !top) {
      const rect = windowDiv.getBoundingClientRect();
      top = rect.top + window.scrollY;
      left = rect.left + window.scrollX;
      width = rect.width;
      height = rect.height;
      // TODO por qué coge un width de 503 en vez de uno mas grande?
    }
  })
</script>

<div
  class="background-silver border-color-up window-size absolute"
  class:window-hidden={$windowsHidden.login}
  class:window-center={!left && !top}
  class:window-position={left || top}
  class:window-max-width={maxWidth}
  style="--left:{left}; --top:{top}; --minWidth{minWidth}; --minHeight:{minHeight}; --maxWidth:{maxWidth}; --width:{width}; --height:{height};"
  bind:this={windowDiv}
>
  <Resize {canBeResized} {minWidth} {minHeight} bind:width bind:height bind:top bind:left>
    <Draggable bind:left bind:top>
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
  </Resize>
</div>

<style>
  .window-hidden {
    display: none;
  }

  .window-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .window-position {
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
  }

  .window-max-width {
    max-width: calc(var(--maxWidth) * 1px);
  }

  .window-size {
    width: calc(var(--width) * 1px);
    height: calc(var(--height) * 1px);
  }
</style>