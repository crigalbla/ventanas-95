<script lang="ts">
  import { onMount } from "svelte";

  import DraggableItem from "@/components/DraggableItem.svelte";
  import { windowsHidden } from '@/stores';
  import type { WindowsHiddenType } from "@/stores";
  import { t } from "@/i18n";

  import WindowButton from './WindowButton.svelte';

  export let title: string;
  export let hasQuestionButton = false;
  export let canBeMinimized = false;
  export let canBeMaximized = false;
  export let canBeResized = true;
  export let left = 0;
  export let top = 0;
  export let maxWidth = 0;

  let windowDiv: HTMLElement;

  const onQuestionButtonClick = () => console.log("?");
  const onMinimizeButtonClick = () => console.log("_");
  const onMaximizeButtonClick = () => console.log("❒");
  const onCloseButtonClick = () => windowsHidden.update((wH: WindowsHiddenType) => ({ ...wH, login: true }));

  onMount(() => {
    if (!left && !top) {
      const rect = windowDiv.getBoundingClientRect();
      top = rect.top + window.scrollY;
      left = rect.left + window.scrollX;
    }
  })
</script>

<div
  class="border-2 border-gray-600 absolute"
  class:window-hidden={$windowsHidden.login}
  class:window-center={!left && !top}
  class:window-position={left || top}
  class:window-maxWidth={maxWidth}
  style="--left:{left}; --top:{top}; --maxWidth:{maxWidth};"
  bind:this={windowDiv}
>
  <DraggableItem bind:left bind:top>
    <div class="background-window-head flex justify-between">
      <span class="text-white">{@html $t(title)}</span>
      <div>
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
  </DraggableItem>
  <slot />
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

  .window-maxWidth {
    max-width: calc(var(--maxWidth) * 1px);
  }
</style>