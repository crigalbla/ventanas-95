<script lang="ts">
  import { t } from "@/i18n"
  import { desktopIcons, type DesktopIconType, type IndividualDesktopIconType } from "@/stores"
  import { DESKTOP_ICON_HEIGHT, DESKTOP_ICON_WIDTH } from "@/constants"
  import Draggable from "./Draggable.svelte"

  export let desktopIconId: string
  export let icon: string
  export let text: string
  export let isFocused: boolean = false
  export let zIndex: number = 0
  export let top: number = 0
  export let left: number = 0
  export let onDblClick: () => void

  let desktopIconRef: HTMLElement

  const onMouseDownDesktopIcon = () => desktopIcons.update((dis: DesktopIconType) => {
  	const oldZIndex: number = dis.find((di: IndividualDesktopIconType) => di.desktopIconId === desktopIconId)?.zIndex as number

  	return dis.map((di: IndividualDesktopIconType) => {
  		if (di.desktopIconId === desktopIconId) return ({ ...di, isFocused: true, zIndex: dis.length + 1 })
  		if ((di.zIndex as number) > oldZIndex) return ({ ...di, zIndex: (di.zIndex as number) - 1 })

  		return di
  	})
  })
</script>

<Draggable id={desktopIconId} {top} {left}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- NOTE: doble tap with touchpadn does not work with on:dblclick -->
  <section
    class="desktop-icon flex flex-col items-center text-center absolute"
    id={desktopIconId}
    style="--zIndex:{zIndex}; --left:{left}; --top:{top}; --width:{DESKTOP_ICON_WIDTH}; --max-height:{DESKTOP_ICON_HEIGHT}"
    on:mousedown={onMouseDownDesktopIcon}
    on:dblclick={onDblClick}
    bind:this={desktopIconRef}
  >
    <img
      class="h-8 w-8 mb-2"
      class:blue-tone={isFocused}
      src={`icons/${icon}.png`}
      alt={icon}
      draggable="false"
    />
    <span
      class="text text-white text-ellipsis overflow-hidden text-sm leading-none"
      class:focused={isFocused}
    >{$t(text)}</span>
  </section>
</Draggable>

<style>
  .desktop-icon {
    width: calc(var(--width) * 1px);
    max-height: calc(var(--max-height) * 1px);
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    z-index: var(--zIndex);
  }

  .text {
    width: calc(var(--width) * 1px);
    margin: 1px;
    padding: 1px 1px 0px 1px;
  }

  .focused {
    margin: 0px;
    border: 1px dotted white;
    background-color: #0000aa;
  }

  .blue-tone {
    filter: sepia(1) saturate(25) hue-rotate(180deg) brightness(0.7);
  }
</style>
