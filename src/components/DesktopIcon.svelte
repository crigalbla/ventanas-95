<script lang="ts">
  import { t } from "@/i18n"
  import { createRightClickMenuInDesktopIcon, desktopIcons, removeDesktopIcon, type DesktopIconsType, type IndividualDesktopIconType, updateDesktopIconParams } from "@/stores"
  import { DESKTOP_ICON_HEIGHT, DESKTOP_ICON_WIDTH } from "@/constants"
  import Draggable from "./Draggable.svelte"

  export let desktopIconId: string
  export let icon: string
  export let name: string
  export let isFocused = false
  export let isEditingName = false
  export let zIndex: number = 0
  export let top: number = 0
  export let left: number = 0
  export let onDblClick: () => void

  let desktopIconRef: HTMLElement

  const onMouseDownDesktopIcon = () => desktopIcons.update((dis: DesktopIconsType) => {
  	const oldZIndex: number = dis.find((di: IndividualDesktopIconType) => di.desktopIconId === desktopIconId)?.zIndex as number

  	return dis.map((di: IndividualDesktopIconType) => {
  		if (di.desktopIconId === desktopIconId) return ({ ...di, isFocused: true, zIndex: dis.length + 1 })
  		if ((di.zIndex as number) > oldZIndex) return ({ ...di, zIndex: (di.zIndex as number) - 1 })

  		return di
  	})
  })

  const onInput = (event: Event) => updateDesktopIconParams(desktopIconId, { name: (event.target as HTMLTextAreaElement).value })

  const onContextMenu = (event: MouseEvent) =>
  	createRightClickMenuInDesktopIcon(
  		event,
  		onDblClick,
  		() => removeDesktopIcon(desktopIconId),
  		() => updateDesktopIconParams(desktopIconId, { isEditingName: true })
  	)
</script>

<Draggable id={desktopIconId} canBeDraggabled={!isEditingName} {top} {left}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- NOTE: doble tap with touchpadn does not work with on:dblclick -->
  <section
    class="desktop-icon flex flex-col items-center text-center absolute"
    id={desktopIconId}
    style="--zIndex:{zIndex}; --left:{left}; --top:{top}; --width:{DESKTOP_ICON_WIDTH}; --max-height:{DESKTOP_ICON_HEIGHT}"
    on:mousedown={onMouseDownDesktopIcon}
    on:contextmenu={onContextMenu}
    on:dblclick={() => !isEditingName && onDblClick()}
    bind:this={desktopIconRef}
  >
    <img
      class="h-8 w-8 mb-1"
      class:blue-tone={isFocused}
      src={`icons/${icon}.png`}
      alt={icon}
      draggable="false"
    />
    {#if isEditingName}
      <textarea class="text text-sm text-center" value={$t(name)} on:input={onInput} />
    {:else}
      <span
        class="text text-white text-ellipsis overflow-hidden text-sm leading-none"
        class:focused={isFocused}
      >{$t(name)}</span>
    {/if}
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

  textarea {
    overflow: hidden;
    border: 1px solid black;
    box-shadow: none;
    resize: none;
    cursor: auto;
    font-size: 14px;
  }

  textarea:focus {
    outline: none;
  }

  .focused {
    width: calc(2px + var(--width) * 1px);
    margin: 0px;
    border: 1px dotted white;
    background-color: #0000aa;
  }

  .blue-tone {
    filter: sepia(1) saturate(25) hue-rotate(180deg) brightness(0.7);
  }
</style>
