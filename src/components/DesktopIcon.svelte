<script lang="ts">
  import { createRightClickMenuInDesktopIcon, desktopIcons, type DesktopIconsType, type IndividualDesktopIconType, updateDesktopIconParams, cleanRecycleBin, isThereAnyCutOrCopiedDesktopIcon, windows, createBlockingWindow } from "@/stores"
  import { DESKTOP_ICON_HEIGHT, DESKTOP_ICON_WIDTH, DESKTOP_ROUTE, DI_MY_PC, DI_RECYCLE_BIN, DI_TETRIS_GAME, NOTEPAD_ICON } from "@/constants"
  import { thereIsBlockingWindow } from "@/utils"
  import Draggable from "./Draggable.svelte"
  import { t } from "@/i18n"

  export let desktopIconId: string
  export let icon: string
  export let name: string
  export let route: string
  export let isFocused = false
  export let isEditingName = false
  export let isCut = false
  export let isCopied = false
  export let canBeDropped: boolean = undefined!
  export let zIndex: number = 0
  export let top: number = 0
  export let left: number = 0
  export let onDblClick: () => void

  let desktopIconRef: HTMLElement
  let textareaRef: HTMLTextAreaElement
  $: newName = name
  $: pointerEventsNoneInTextarea = $windows && thereIsBlockingWindow()
  $: thisRoute = icon !== NOTEPAD_ICON ? `${route}\\${name}` : undefined
  $: maxHeight = isFocused || isEditingName ? 350 : DESKTOP_ICON_HEIGHT
  $: if (textareaRef) {
  	textareaRef.focus()
  	textareaRef.select()
  	textareaRef.style.height = "auto"
  	textareaRef.style.height = (textareaRef.scrollHeight + 1.6) + "px"
  }
  $: if (isFocused) {
  	const desktopIconByQuerySelector = document.querySelector(`#${desktopIconId}`) as HTMLElement

  	desktopIconByQuerySelector?.focus()
  }

  const containCharacterNotAllowed = () => {
  	const regex = /[\\/:*?"<>|]/
  	return regex.test(newName)
  }

  const onMouseDownDesktopIcon = (event: MouseEvent) => !isEditingName && event.button !== 1 && !thereIsBlockingWindow() &&
    desktopIcons.update((dis: DesktopIconsType) => {
    	const oldZIndex = dis.find((di: IndividualDesktopIconType) => di.desktopIconId === desktopIconId)?.zIndex as number

    	return dis.map((di: IndividualDesktopIconType) => {
    		if (di.desktopIconId === desktopIconId) return ({ ...di, isFocused: true, zIndex: dis.length + 1 })
    		if ((di.zIndex as number) > oldZIndex) return ({ ...di, zIndex: (di.zIndex as number) - 1 })

    		return di
    	})
    })

  const onInput = (event: Event) => {
  	if (thereIsBlockingWindow()) return

  	const target = event.target as EventTarget & { value: string }
  	if (!target?.value.includes("\n")) { // Change value if value is different of enter key
  		const textareaHTML = event.target as HTMLTextAreaElement
  		textareaHTML.style.height = "auto"
  		textareaHTML.style.height = (textareaHTML.scrollHeight + 1.6) + "px"
  		newName = $t(textareaRef.value).trim() || name
  	} else {
  		textareaRef.value = textareaRef.value.slice(0, -1).trim() // Remove enter key
  	}
  }

  const onKeyDownInInput = (event: KeyboardEvent) => {
  	if (thereIsBlockingWindow()) return

  	if (event.key === "Enter") {
  		setTimeout(() => { // Timer to avoid open folder
  			if (containCharacterNotAllowed()) {
  				createBlockingWindow(desktopIconId, "charactersNotAllowed.title")
  			} else {
  				updateDesktopIconParams(desktopIconId, { isEditingName: false, isFocused: true, name: newName })
  			}
  		}, 0)
  	}
  }

  const onMouseDown = (event: MouseEvent) => {
  	if (thereIsBlockingWindow()) return

  	const target = event.target as Node
  	const desktopIconHTML = document.querySelector(`#${desktopIconId}`)
  	if (newName && newName !== name && !desktopIconHTML?.contains(target)) {
  		if (containCharacterNotAllowed()) {
  			createBlockingWindow(desktopIconId, "charactersNotAllowed.title")
  		} else {
  			updateDesktopIconParams(desktopIconId, { isEditingName: false, isFocused: false, name: newName })
  		}
  	}
  }

  const onContextMenu = (event: MouseEvent) => {
  	if (thereIsBlockingWindow()) return

  	let customSection
  	const isMyPcOrTetrisGame = desktopIconId === DI_MY_PC || desktopIconId.includes(DI_TETRIS_GAME)
  	const isRecycleBin = desktopIconId === DI_RECYCLE_BIN
  	const isAlreadyCutOrCopied = isCut || isCopied
  	if (isRecycleBin) {
  		customSection = {
  			position: 2,
  			section: [{ text: "rightClickMenu.cleanRecycleBin", onClick: cleanRecycleBin }]
  		}
  	}

  	createRightClickMenuInDesktopIcon({
  		event,
  		desktopIcon: $desktopIcons.find(di => di.desktopIconId === desktopIconId) as IndividualDesktopIconType,
  		canBeEdited: !isRecycleBin,
  		canBeCutAndCopied: !isMyPcOrTetrisGame && !isRecycleBin,
  		canBeDeleted: !isMyPcOrTetrisGame && !isRecycleBin,
  		canBePasted: icon !== NOTEPAD_ICON && !isAlreadyCutOrCopied && isThereAnyCutOrCopiedDesktopIcon(),
  		customSection,
  		onDblClick
  	})
  }

  const onTouchStart = () => {
  	if (thereIsBlockingWindow()) return

  	onMouseDownDesktopIcon({ button: true } as unknown as MouseEvent)
  }

  const onDblClickLocal = () => !isEditingName && !thereIsBlockingWindow() && onDblClick()
</script>

<Draggable id={desktopIconId} canBeDraggabled={!isEditingName} canBeDropped={canBeDropped} {top} {left} fake>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- NOTE: doble tap with touchpad does not work with on:dblclick -->
  <!-- NOTE2: tabindex is to allow on:keydown -->
  <section
    class="desktop-icon flex flex-col items-center text-center"
    id={desktopIconId}
    data-route={thisRoute}
    style="--zIndex:{zIndex}; --left:{left}; --top:{top}; --width:{DESKTOP_ICON_WIDTH}; --max-height:{maxHeight};"
    tabindex={0}
    on:mousedown={onMouseDownDesktopIcon}
    on:contextmenu={onContextMenu}
    on:dblclick={onDblClickLocal}
    on:touchstart={onTouchStart}
    bind:this={desktopIconRef}
  >
    <img
      class="h-8 w-8 mb-1"
      class:blue-tone={isFocused}
      class:is-cut={isCut}
      src={`icons/${icon}.png`}
      alt={icon}
      draggable="false"
    />
    {#if isEditingName}
      <textarea
        class="text text-center"
        class:pointer-events-none={pointerEventsNoneInTextarea}
        value={$t(name)}
        maxlength="200"
        on:input={onInput}
        on:keydown={onKeyDownInInput}
        on:dragstart={(event) => event.preventDefault()}
        bind:this={textareaRef}
      />
    {:else}
      <span
        class="text"
        class:focused={isFocused}
        class:overflow-text={!isFocused}
        class:text-white={route === DESKTOP_ROUTE || !route}>
          {$t(name)}
      </span>
    {/if}
  </section>
</Draggable>
<svelte:window on:mousedown={onMouseDown} />

<style>
  .desktop-icon {
    position: relative;
    width: calc(var(--width) * 1px);
    max-height: calc(var(--max-height) * 1px);
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    z-index: var(--zIndex);
    outline: none;
  }

  .desktop-icon *:not(textarea) {
    pointer-events: none;
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
    line-clamp: 2;
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
    border: var(--none, 1px dotted white);
    background-color: var(--none, #0000aa);
    color: var(--color, white);
    overflow-wrap: break-word;
  }

  .blue-tone {
    filter: var(--none, sepia(1) saturate(25) hue-rotate(180deg) brightness(0.7));
  }

  .is-cut {
    opacity: 0.5;
  }
</style>
