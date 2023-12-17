<script lang="ts">
  import { t } from "@/i18n"
  import Button from "../Button.svelte"
  import { onMount } from "svelte"
  import { updateDesktopIconParams, windows, desktopIcons, updateWindowParams, type IndividualDesktopIconType } from "@/stores"

  type PropertiesType = {
    text: string
  }

  export let windowId: string

  // TODO fix focus and text bug when there are some notepad windows
  const desktopIconId = $windows.find((w) => w.windowId === windowId)?.desktopIconId as string
  const desktopIcon = $desktopIcons.find((di) => di.desktopIconId === desktopIconId) as IndividualDesktopIconType
  const properties = desktopIcon.properties as PropertiesType
  let textareaRef: HTMLTextAreaElement
  let text = ""
  let verStaDecTriangle = ""
  let verEndIncTriangle = ""
  let horStaDecTriangle = ""
  let horEndIncTriangle = ""

  // TODO fix this bug in this method when there are some notepad windows
  const changeCloseCallBack = () => {
  	updateWindowParams(windowId, {
  		closeCallBack: () => {
  			updateDesktopIconParams(desktopIconId, { properties: { ...properties, text } })
  			window.localStorage.removeItem(windowId)
  		}
  	})
  }
  changeCloseCallBack()

  const getTriangle = (points: string, fill: string = "rgba(0, 0, 0, 1)"): string =>
  	`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="${fill}"><polygon points="${points}"/></svg>`

  const onClickHeaderButton = () => console.log("onClickHeaderButton")

  const onInput = (event: Event) => window.localStorage.setItem(windowId, (event.target as HTMLTextAreaElement).value)

  onMount(() => {
  	const textAreaWasResized = () => {
  		if (textareaRef?.scrollHeight > textareaRef?.clientHeight) {
  			verStaDecTriangle = getTriangle("50,00 0,50 100,50")
  			verEndIncTriangle = getTriangle("0,0 100,0 50,50")
  		} else {
  			verStaDecTriangle = getTriangle("50,00 0,50 100,50", "rgba(0, 0, 0, 0.3)")
  			verEndIncTriangle = getTriangle("0,0 100,0 50,50", "rgba(0, 0, 0, 0.3)")
  		}

  		if (textareaRef?.scrollWidth > textareaRef?.clientWidth) {
  			horStaDecTriangle = getTriangle("0,50 50,100 50,0")
  			horEndIncTriangle = getTriangle("0,0 0,100 50,50")
  		} else {
  			horStaDecTriangle = getTriangle("0,50 50,100 50,0", "rgba(0, 0, 0, 0.3)")
  			horEndIncTriangle = getTriangle("0,0 0,100 50,50", "rgba(0, 0, 0, 0.3)")
  		}
  	}

  	const fillText = () => {
  		const localText = window.localStorage.getItem(windowId) as string
  		if (localText) {
  			text = localText
  		} else {
  			text = properties.text
  			window.localStorage.setItem(windowId, text)
  		}
  	}

  	new ResizeObserver(textAreaWasResized).observe(textareaRef)
  	fillText()
  })
</script>

<section class="notepad">
  <div class="header mx-2">
    <Button className="mr-2" removeButtonStyles on:click={onClickHeaderButton}>{$t("notepadBody.file")}</Button>
    <Button className="mx-2" removeButtonStyles on:click={onClickHeaderButton}>{$t("notepadBody.edition")}</Button>
    <Button className="mx-2" removeButtonStyles on:click={onClickHeaderButton}>{$t("notepadBody.search")}</Button>
    <Button className="ml-2" removeButtonStyles on:click={onClickHeaderButton}>{$t("notepadBody.help")}</Button>
  </div>
  <div class="body border-color-soft-down">
    <textarea
      wrap="off"
      style="
        --verStaDecTriangle: url('{verStaDecTriangle}');
        --verEndIncTriangle: url('{verEndIncTriangle}');
        --horStaDecTriangle: url('{horStaDecTriangle}');
        --horEndIncTriangle: url('{horEndIncTriangle}');"
      on:input={onInput}
      bind:value={text}
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
</style>
