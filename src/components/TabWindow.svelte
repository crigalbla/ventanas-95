<script lang="ts">
  import { windows, type IndividualWindowType, type WindowsType } from "@/stores"
  import Button from "./Button.svelte"
  import { t } from "@/i18n"

  export let title: string
  export let windowId: string
  export let icon: string = undefined!
  export let isMinimized: boolean

  const onClickTabWindow = () => {
  	windows.update((ws: WindowsType) =>
  		ws.map((w: IndividualWindowType) => w.windowId === windowId
  			? ({ ...w, isMinimized: !isMinimized })
  			: ({ ...w, isMinimized: true })))
  }
</script>

<Button
  className={`${isMinimized ? "border-color-soft-up" : "border-color-soft-down"} h-5/6 w-1/3 px-1`}
  on:click={onClickTabWindow}
>
  {#if icon}
    <img class="h-5 w-5" src={`icons/${icon}.png`} alt={icon}/>
  {/if}
  <span class="text-white ml-1">{$t(title)}</span>
</Button>

<style>

</style>
