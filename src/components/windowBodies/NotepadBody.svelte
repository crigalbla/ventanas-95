<script lang="ts">
  import { t } from "@/i18n"
  import Button from "../Button.svelte"
  import { onMount } from "svelte"

  export let text: string = `
lorem
examples examples examples examples examples examples examples examples examples lorem ipsum
          lorem ipsum
`

  let textareaRef: HTMLElement
  let verStaDecTriangle = ""
  let verEndIncTriangle = ""
  let horStaDecTriangle = ""
  let horEndIncTriangle = ""

  const getTriangle = (points: string, fill: string = "rgba(0, 0, 0, 1)"): string =>
  	`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="${fill}"><polygon points="${points}"/></svg>`

  const onClickHeaderButton = () => console.log("onClickHeaderButton")

  onMount(() => {
  	const textAreaWasResized = () => {
  		if (textareaRef.scrollHeight > textareaRef.clientHeight) {
  			verStaDecTriangle = getTriangle("50,00 0,50 100,50")
  			verEndIncTriangle = getTriangle("0,0 100,0 50,50")
  		} else {
  			verStaDecTriangle = getTriangle("50,00 0,50 100,50", "rgba(0, 0, 0, 0.3)")
  			verEndIncTriangle = getTriangle("0,0 100,0 50,50", "rgba(0, 0, 0, 0.3)")
  		}

  		if (textareaRef.scrollWidth > textareaRef.clientWidth) {
  			horStaDecTriangle = getTriangle("0,50 50,100 50,0")
  			horEndIncTriangle = getTriangle("0,0 0,100 50,50")
  		} else {
  			horStaDecTriangle = getTriangle("0,50 50,100 50,0", "rgba(0, 0, 0, 0.3)")
  			horEndIncTriangle = getTriangle("0,0 0,100 50,50", "rgba(0, 0, 0, 0.3)")
  		}
  	}

  	new ResizeObserver(textAreaWasResized).observe(textareaRef)
  })
</script>

<section class="notepad">
  <div class="header mx-1">
    <Button className="mx-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("notepadBody.file")}</Button>
    <Button className="mx-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("notepadBody.edition")}</Button>
    <Button className="mx-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("notepadBody.search")}</Button>
    <Button className="mx-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("notepadBody.help")}</Button>
  </div>
  <div class="body border-color-soft-down">
    <textarea
      wrap="off"
      style="
        --verStaDecTriangle: url('{verStaDecTriangle}');
        --verEndIncTriangle: url('{verEndIncTriangle}');
        --horStaDecTriangle: url('{horStaDecTriangle}');
        --horEndIncTriangle: url('{horEndIncTriangle}');"
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

  ::-webkit-scrollbar {
    width: var(--scrollbarWidth);
    height: var(--scrollbarWidth);
  }

  ::-webkit-scrollbar-track {
    background: #c0c0c0;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect x="0" y="0" width="5" height="5" fill="rgba(255, 255, 255, 0.4)" /><line x1="1" y1="5" x2="5" y2="0" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1" /></svg>');
  }

  ::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border: solid 2px;
		border-color: #f5f5f5 #0b1717 #0b1717 #f5f5f5;
  }

  ::-webkit-scrollbar-corner {
    background-color: #c0c0c0;
  }

  ::-webkit-scrollbar-button:single-button {
    width: var(--scrollbarWidth); /* from :root */
    height: var(--scrollbarWidth); /* from :root */
    background: #c0c0c0;
    border: solid 2px;
		border-color: #f5f5f5 #0b1717 #0b1717 #f5f5f5;
    background-size: 8px;
    background-repeat: no-repeat;
  }

  ::-webkit-scrollbar-button:single-button:active {
    border-color: #0b1717 #f5f5f5 #f5f5f5 #0b1717;
  }

  ::-webkit-scrollbar-button:vertical:start:decrement {
    background-position: center 4px;
    background-image: var(--verStaDecTriangle);
  }

  ::-webkit-scrollbar-button:vertical:end:increment {
    background-position: center 4px;
    background-image: var(--verEndIncTriangle);
  }

  ::-webkit-scrollbar-button:horizontal:start:decrement {
    background-position: 4px 3px;
    background-image: var(--horStaDecTriangle);
  }

  ::-webkit-scrollbar-button:horizontal:end:increment {
    background-position: 5px 3px;
    background-image: var(--horEndIncTriangle);
  }
</style>
