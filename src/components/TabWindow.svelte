<script lang="ts">
  import { windows, type IndividualWindowType, type WindowsType } from "@/stores"
  import Button from "./Button.svelte"
  import { t } from "@/i18n"
  import { INITIAL_WINDOW_Z_INDEX } from "@/constants"

  export let title: string
  export let subTitle: string = undefined!
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
  					return ({ ...w, isMinimized: false, isFocused: true, zIndex: ws.length + INITIAL_WINDOW_Z_INDEX })
  				} else {
  					if (isFocused) {
  						return ({ ...w, isMinimized: true, isFocused: !w.canLoseFocus || false })
  					} else {
  						return ({ ...w, isMinimized: false, isFocused: true, zIndex: ws.length + INITIAL_WINDOW_Z_INDEX })
  					}
  				}
  			}
  			if ((w.zIndex as number) > oldZIndex) return ({ ...w, zIndex: (w.zIndex as number) - 1 })

  			return ({ ...w, isFocused: !w.canLoseFocus || false })
  		})
  	})
  }
</script>

<Button
  className={`${!isFocused ? "border-color-up" : "border-color-down background-granulated font-extrabold"} h-5/6 w-1/3 px-1`}
  id={`${windowId}-tab`}
  on:click={onClickTabWindow}
>
  {#if icon}
    <img class="h-5 w-5" src={`icons/${icon}.png`} alt={icon} draggable="false"/>
  {/if}
  <span class="overflow-text h-6 ml-1">
    {`${$t(title)}${subTitle ? " - " + $t(subTitle) : ""}`}
  </span>
</Button>

<style>
  .overflow-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
</style>
