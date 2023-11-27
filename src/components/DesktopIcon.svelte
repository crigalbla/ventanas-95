<script lang="ts">
  import { t } from "@/i18n"
  import { updateDesktopIconParams } from "@/stores"

  export let desktopIconId: string
  export let icon: string
  export let text: string
  export let isFocused: boolean = false
  export let zIndex: number = 0
  export let top: number = 0
  export let left: number = 0
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
  class="desktop-icon flex flex-col items-center text-center absolute w-16"
  on:click={() => updateDesktopIconParams(desktopIconId, { isFocused: !isFocused })}
  id={desktopIconId}
  style="--zIndex:{zIndex}; --left:{left}; --top:{top};"
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

<style>
  .desktop-icon {
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    z-index: var(--zIndex);
  }

  .text {
    padding: 1px 1px 0px 1px;
  }

  .focused {
    border: 1px solid black;
    background-color: #0000aa;
  }

  .blue-tone {
    filter: brightness(1.2) hue-rotate(180deg)
  }
</style>
