<script lang="ts">
  import type { SectionInRightClickMenuType } from "@/stores"
  import { RIGHT_CLICK_MENU_ID } from "@/constants"
  import Button from "./Button.svelte"
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
    <Button
      className={`${option.isDisabled ? "w-full px-6 text-gray-500" : "w-full px-6"}`}
      hasHover={!option.isDisabled}
      removeButtonStyles on:click={() => !option.isDisabled && console.log($t(option.text))}
    >
      <span>{$t(option.text)}</span>
      {#if option.sections?.length}
        <span class="triangle"/>
      {/if}
    </Button>
    {/each}
    {#if sections.length - 1 !== i}
      <div class="separator border-color-soft-down" />
    {/if}
  {/each}
</section>

<style>
  .right-click-menu {
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    z-index: 1000;
    padding: 2px 1px;
  }

  .triangle {
    position: absolute;
    right: 5px;
    width: 15px;
    height: 15px;
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: 5px 2px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="rgba(0, 0, 0, 1)"><polygon points="0,0 0,100 50,50"/></svg>');
  }

  /* TODO fix this change background-image */
  .background-silver:hover .triangle {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="rgba(255, 255, 255, 1)"><polygon points="0,0 0,100 50,50"/></svg>');
  }

  .separator {
    margin: 4px 0px;
    width: 100%;
  }
</style>
