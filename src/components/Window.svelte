<script lang="ts">
  import { windowsHidden } from '@/stores';
  import type { WindowsHiddenType } from "@/stores";
  import { t } from "@/i18n";

  import WindowButton from './WindowButton.svelte';

  export let title: string;
  export let hasQuestionButton = false;
  export let canBeMinimized = false;
  export let canBeMaximized = false;
  export let canBeResized = true;
  export let xPosition = 0;
  export let yPosition = 0;
  export let maxWidth: number;

  const onQuestionButtonClick = () => console.log("?");
  const onMinimizeButtonClick = () => console.log("_");
  const onMaximizeButtonClick = () => console.log("❒");
  const onCloseButtonClick = () => windowsHidden.update((wH: WindowsHiddenType) => ({ ...wH, login: true }));

  console.log("test", document.getElementById("draggable"))
</script>

<div
  class="border-2 border-gray-600 absolute"
  class:window-hidden={$windowsHidden.login}
  class:window-center={!xPosition && !yPosition}
  class:window-position={xPosition || yPosition}
  class:window-maxWidth={maxWidth}
  style="--xPosition:{xPosition}; --yPosition:{yPosition}; --maxWidth:{maxWidth};"
>
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
    top: calc(var(--xPosition) * 1px);
    left: calc(var(--yPosition) * 1px);
  }

  .window-maxWidth {
    max-width: calc(var(--maxWidth) * 1px);
  }
</style>