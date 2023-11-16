<script lang="ts">
  import { windows, type IndividualWindowType, type WindowsType } from "@/stores"
  import Button from "./Button.svelte"
  import { t } from "@/i18n"

  export let title: string
  export let windowId: string
  export let icon: string = undefined!
  export let isMinimized: boolean
  export let isFocused: boolean

  const onClickTabWindow = () => {
  	windows.update((ws: WindowsType) => {
  		const oldZIndex: number = ws.find((w: IndividualWindowType) => w.windowId === windowId)?.zIndex as number

  		return ws.map((w: IndividualWindowType) => {
  			if (w.windowId === windowId) {
  				if (isMinimized) {
  					return ({ ...w, isMinimized: false, isFocused: true, zIndex: ws.length })
  				} else {
  					if (isFocused) {
  						return ({ ...w, isMinimized: true, isFocused: false })
  					} else {
  						return ({ ...w, isMinimized: false, isFocused: true, zIndex: ws.length })
  					}
  				}
  			}
  			if ((w.zIndex as number) > oldZIndex) return ({ ...w, zIndex: (w.zIndex as number) - 1 })

  			return ({ ...w, isFocused: false })
  		})
  	})
  }
</script>

<Button
  className={`${!isFocused ? "border-color-soft-up" : "border-color-soft-down background-granulated font-extrabold"} h-5/6 w-1/5 px-1`}
  id={`${windowId}-tab`}
  on:click={onClickTabWindow}
>
  {#if icon}
    <img class="h-5 w-5" src={`icons/${icon}.png`} alt={icon} draggable="false"/>
  {/if}
  <span class="ml-1">{$t(title)}</span>
</Button>

<style>
</style>
