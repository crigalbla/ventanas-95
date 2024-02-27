<script lang="ts">
  import { windows, type IndividualWindowType, type WindowsType, desktopIcons, type IndividualDesktopIconType } from "@/stores"
  import { INITIAL_WINDOW_Z_INDEX, W_BLOCKING } from "@/constants"
  import Button from "./Button.svelte"
  import { t } from "@/i18n"

  export let title: string
  export let subTitle: string = undefined!
  export let windowId: string
  export let desktopIconId: string = undefined!
  export let icon: string = undefined!
  export let isMinimized: boolean
  export let isFocused: boolean

  $: iconFromDesktopIcon = $desktopIcons.find((di: IndividualDesktopIconType) => di.desktopIconId === desktopIconId)?.icon
  $: desktopIcon = $desktopIcons.find((di: IndividualDesktopIconType) => di.desktopIconId === desktopIconId)
  $: finalTitle = $t((windowId !== W_BLOCKING && desktopIcon?.name) || title)

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
  className={`${!isFocused ? "border-color-up" : "border-color-down background-granulated font-extrabold"} w-1/3 px-1`}
  id={`${windowId}-tab`}
  hasActiveDisabled
  on:click={onClickTabWindow}
>
  {#if icon || iconFromDesktopIcon}
    <img
      class="h-5 w-5"
      src={`icons/${icon || iconFromDesktopIcon}.png`}
      alt={icon || iconFromDesktopIcon}
      draggable="false"
    />
  {/if}
  <span class="overflow-text text-left h-6 ml-1">
    {`${$t(finalTitle)}${subTitle ? " - " + $t(subTitle) : ""}`}
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
