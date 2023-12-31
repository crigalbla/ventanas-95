<script lang="ts">
  import { createRightClickMenuInDesktopIcon, desktopIcons, removeDesktopIcon, type DesktopIconsType, type IndividualDesktopIconType, updateDesktopIconParams } from "@/stores"
  import { DESKTOP_ICON_HEIGHT, DESKTOP_ICON_WIDTH, DESKTOP_ROUTE, DI_MY_PC, DI_RECYCLE_BIN } from "@/constants"
  import Draggable from "./Draggable.svelte"
  import { t } from "@/i18n"

  export let desktopIconId: string
  export let icon: string
  export let name: string
  export let route: string
  export let isFocused = false
  export let isEditingName = false
  export let zIndex: number = 0
  export let top: number = 0
  export let left: number = 0
  export let onDblClick: () => void

  let desktopIconRef: HTMLElement
  let textareaRef: HTMLTextAreaElement
  $: maxHeight = isFocused || isEditingName ? 350 : DESKTOP_ICON_HEIGHT
  $: if (textareaRef) {
  	textareaRef.focus()
  	textareaRef.select()
  	textareaRef.style.height = "auto"
  	textareaRef.style.height = (textareaRef.scrollHeight) + "px"
  }

  const onMouseDownDesktopIcon = () => !isEditingName && desktopIcons.update((dis: DesktopIconsType) => {
  	const oldZIndex: number = dis.find((di: IndividualDesktopIconType) => di.desktopIconId === desktopIconId)?.zIndex as number

  	return dis.map((di: IndividualDesktopIconType) => {
  		if (di.desktopIconId === desktopIconId) return ({ ...di, isFocused: true, zIndex: dis.length + 1 })
  		if ((di.zIndex as number) > oldZIndex) return ({ ...di, zIndex: (di.zIndex as number) - 1 })

  		return di
  	})
  })

  const onInput = (event: Event) => {
  	const textareaHTML = event.target as HTMLTextAreaElement
  	textareaHTML.style.height = "auto"
  	textareaHTML.style.height = (textareaHTML.scrollHeight) + "px"
  	const newName = $t(textareaHTML.value)
  	if (newName.length > 0) updateDesktopIconParams(desktopIconId, { name: newName.trim() })
  }

  const onKeyDown = (event: KeyboardEvent) => event.key === "Enter" && updateDesktopIconParams(desktopIconId, { isEditingName: false })

  const onContextMenu = (event: MouseEvent) => {
  	let customSection
  	const isMyPc = desktopIconId === DI_MY_PC
  	const isRecycleBin = desktopIconId === DI_RECYCLE_BIN
  	if (isRecycleBin) {
  		customSection = {
  			position: 1,
  			section: [{ text: "rightClickMenu.cleanRecycleBin" }]
  		}
  	}

  	createRightClickMenuInDesktopIcon({
  		event,
  		canBeEdited: !isRecycleBin,
  		canBeCutAndCopy: !isMyPc && !isRecycleBin,
  		canBeDeleted: !isMyPc && !isRecycleBin,
  		customSection,
  		onDblClick,
  		removeDesktopIcon: () => removeDesktopIcon(desktopIconId),
  		changeToEditingName: () => updateDesktopIconParams(desktopIconId, { isEditingName: true })
  	})
  }
</script>

<Draggable id={desktopIconId} canBeDraggabled={!isEditingName} {top} {left}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- NOTE: doble tap with touchpad does not work with on:dblclick -->
  <section
    class="desktop-icon flex flex-col items-center text-center absolute"
    id={desktopIconId}
    style="--zIndex:{zIndex}; --left:{left}; --top:{top}; --width:{DESKTOP_ICON_WIDTH}; --max-height:{maxHeight}"
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
      <textarea
        class="text text-center"
        value={$t(name)}
        maxlength="200"
        on:input={onInput}
        on:keydown={onKeyDown}
        bind:this={textareaRef}
      />
    {:else}
      <span class="text" class:focused={isFocused} class:overflow-text={!isFocused} class:text-white={route === DESKTOP_ROUTE}>
        {$t(name)}
      </span>
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
    font-size: 13px;
    line-height: 1;
  }

  .overflow-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
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
    color: white;
    overflow-wrap: break-word;
  }

  .blue-tone {
    filter: sepia(1) saturate(25) hue-rotate(180deg) brightness(0.7);
  }
</style>
