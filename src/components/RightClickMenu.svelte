<script lang="ts">
  import type { SectionInRightClickMenuType } from "@/stores"
  import { RIGHT_CLICK_MENU_ID } from "@/constants"
  import { t } from "@/i18n"

  export let sections: SectionInRightClickMenuType[]
  export let top: number
  export let left: number
</script>

<section
  class="background-silver border-color-shadow-up right-click-menu absolute"
  id={RIGHT_CLICK_MENU_ID}
  style="--left:{left}; --top:{top};"
>
  {#each sections as options, i}
    {#each options as option}
      <p class="px-6">{$t(option)}</p>
    {/each}
    {#if sections.length - 1 !== i}
      <div class="separator" />
    {/if}
  {/each}
</section>

<style>
  .right-click-menu {
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    z-index: 1000;
  }

  .separator {
    background: black;
    margin: 4px 0px;
    width: 100%;
    height: 1px;
  }
</style>
