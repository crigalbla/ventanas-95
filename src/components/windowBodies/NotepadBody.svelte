<script lang="ts">
  import { t } from "@/i18n"
  import Button from "../Button.svelte"
  import { afterUpdate, onMount } from "svelte"
  import { updateDesktopIconParams, desktopIcons, updateWindowParams, type IndividualDesktopIconType, createWindow, removeWindow } from "@/stores"
  import SaveChangesBody from "./SaveChangesBody.svelte"

  type PropertiesType = {
    text: string
  }

  export let windowId: string
  export let desktopIconId: string

  const desktopIcon = $desktopIcons.find((di) => di.desktopIconId === desktopIconId) as IndividualDesktopIconType
  const properties = desktopIcon.properties as PropertiesType
  let textareaRef: HTMLTextAreaElement
  let saveChangeWindowIsActive = false
  let text = ""
  let verStaDecTriangleLocal = ""
  let verEndIncTriangleLocal = ""
  let horStaDecTriangleLocal = ""
  let horEndIncTriangleLocal = ""

  const changeCloseCallBack = () => {
  	updateWindowParams(windowId, {
  		closeCallBack: () => {
  			const textInLocalStorage = window.localStorage.getItem(windowId)
  			if (!textInLocalStorage || properties.text === textInLocalStorage) {
  				window.localStorage.removeItem(windowId)

  				return { preventCloseWindow: false }
  			}
  			if (!saveChangeWindowIsActive) createSaveChangesWindow()

  			return { preventCloseWindow: true }
  		}
  	})
  }

  const createSaveChangesWindow = () => {
  	saveChangeWindowIsActive = true
  	createWindow({
  		title: $t("subTitle.notepad"),
  		canBeResized: false,
  		canLoseFocus: false,
  		desktopIconId,
  		closeCallBack: (props) => {
  			const typedProps = props as { shouldSaveChanges?: boolean, shouldCloseNotepadWindow?: boolean } | undefined
  			if (typedProps?.shouldSaveChanges as boolean) saveChanges()
  			if (typedProps?.shouldCloseNotepadWindow) {
  				window.localStorage.removeItem(windowId)
  				removeWindow(windowId)
  			}
  			saveChangeWindowIsActive = false
  		},
  		body: SaveChangesBody
  	})
  }

  const saveChanges = () => {
  	const textModified = window.localStorage.getItem(windowId)
  	updateDesktopIconParams(desktopIconId, { properties: { ...properties, text: textModified || properties.text } })
  }

  const getTriangle = (points: string, fill: string = "rgba(0, 0, 0, 1)"): string =>
  	`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="${fill}"><polygon points="${points}"/></svg>`

  const onClickHeaderButton = () => null

  const onInput = (event: Event) => window.localStorage.setItem(windowId, (event.target as HTMLTextAreaElement).value)

  const updateText = () => {
  	text = window.localStorage.getItem(windowId) || properties.text || ""

  	if (text === "desktopIcon.about.text") text = $t(text)
  }

  onMount(() => {
  	const textAreaWasResized = () => {
  		if (textareaRef?.scrollHeight > textareaRef?.clientHeight) {
  			verStaDecTriangleLocal = getTriangle("50,00 0,50 100,50")
  			verEndIncTriangleLocal = getTriangle("0,0 100,0 50,50")
  		} else {
  			verStaDecTriangleLocal = getTriangle("50,00 0,50 100,50", "rgba(0, 0, 0, 0.3)")
  			verEndIncTriangleLocal = getTriangle("0,0 100,0 50,50", "rgba(0, 0, 0, 0.3)")
  		}

  		if (textareaRef?.scrollWidth > textareaRef?.clientWidth) {
  			horStaDecTriangleLocal = getTriangle("0,50 50,100 50,0")
  			horEndIncTriangleLocal = getTriangle("0,0 0,100 50,50")
  		} else {
  			horStaDecTriangleLocal = getTriangle("0,50 50,100 50,0", "rgba(0, 0, 0, 0.3)")
  			horEndIncTriangleLocal = getTriangle("0,0 0,100 50,50", "rgba(0, 0, 0, 0.3)")
  		}
  	}

  	new ResizeObserver(textAreaWasResized).observe(textareaRef)
  })

  afterUpdate(() => {
  	changeCloseCallBack()
  	updateText()
  })
</script>

<section class="notepad">
  <div class="header mx-2">
    <Button className="mr-2" removeButtonStyles on:click={onClickHeaderButton}>{$t("file")}</Button>
    <Button className="mx-2" removeButtonStyles on:click={onClickHeaderButton}>{$t("edition")}</Button>
    <Button className="mx-2" removeButtonStyles on:click={onClickHeaderButton}>{$t("search")}</Button>
    <Button className="ml-2" removeButtonStyles on:click={onClickHeaderButton}>{$t("help")}</Button>
  </div>
  <div class="body border-color-soft-down">
    <textarea
      wrap="off"
      style="
        --verStaDecTriangleLocal: url('{verStaDecTriangleLocal}');
        --verEndIncTriangleLocal: url('{verEndIncTriangleLocal}');
        --horStaDecTriangleLocal: url('{horStaDecTriangleLocal}');
        --horEndIncTriangleLocal: url('{horEndIncTriangleLocal}');"
      value={text}
      on:input={onInput}
      bind:this={textareaRef}
    />
  </div>
  <div class="fake-resize">
    <div class="border-color-soft-down w-2/6" />
    <div class="border-color-soft-down w-4/6" />
    <div class="border-color-soft-down w-full" />
  </div>
</section>

<style>
  .notepad {
    display: flex;
    flex-direction: column;
    height: calc(100% - var(--headerHeight) * 1px);
  }

  .header {
    display: flex
  }

  .body {
    height: 100%;
    margin: 0px 3px 3px 3px;
  }

  .fake-resize {
    width: var(--scrollbarWidth);
    height: var(--scrollbarWidth);
    position: absolute;
    bottom: 4px;
    right: 4px;
    transform: rotate(125deg);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  textarea {
    width: 100%;
    height: 100%;
    padding: 0px 2px;
    overflow: scroll;
    border: none;
    box-shadow: none;
    resize: none;
    cursor: auto;
  }

  textarea:focus {
    outline: none;
  }

  ::-webkit-scrollbar-button:vertical:start:decrement {
    background-position: center 4px;
    background-image: var(--verStaDecTriangleLocal);
  }

  ::-webkit-scrollbar-button:vertical:end:increment {
    background-position: center 4px;
    background-image: var(--verEndIncTriangleLocal);
  }

  ::-webkit-scrollbar-button:horizontal:start:decrement {
    background-position: 4px 3px;
    background-image: var(--horStaDecTriangleLocal);
  }

  ::-webkit-scrollbar-button:horizontal:end:increment {
    background-position: 5px 3px;
    background-image: var(--horEndIncTriangleLocal);
  }
</style>
