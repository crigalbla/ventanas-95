<script lang="ts">
  import { createRightClickMenuInScreen, desktopIcons, windows, type IndividualDesktopIconType, type IndividualWindowType } from "@/stores"
  import IconsSelector from "../IconsSelector.svelte"
  import DesktopIcon from "../DesktopIcon.svelte"
  import Button from "../Button.svelte"
  import { t } from "@/i18n"
  import { onMount } from "svelte"
  import { MY_PC_ICON, RECYCLE_BIN_ICON } from "@/constants"

  export let windowId: string
  export let desktopIconId: string

  $: window = $windows.find(w => w.windowId === windowId) as IndividualWindowType
  $: desktopIcon = $desktopIcons.find(di => di.desktopIconId === desktopIconId) as IndividualDesktopIconType
  $: thisRoute = `${desktopIcon.route}\\${desktopIcon.name}`
  $: isRecycleBin = desktopIcon.icon === RECYCLE_BIN_ICON
  $: isMyPC = desktopIcon.icon === MY_PC_ICON

  const getRouteTranslated = (route: string) => {
  	const arrayText = route.split("\\")

  	if (isRecycleBin || isMyPC) return $t(arrayText[arrayText.length - 1])

  	const arrayTextTranslated = arrayText.map((str) => $t(str))

  	return arrayTextTranslated.join("\\")
  }

  $: thisRouteTranslated = $t(desktopIcon.name) && getRouteTranslated(thisRoute) // $t is necessary to rerender when change language
  $: desktopIconsInThisFolder = $desktopIcons.filter(di => di.route === thisRoute)
  $: windowCoordinates = { top: window.top as number, left: window.left as number }
  let sectionRef: HTMLElement
  let inputSearchRef: HTMLInputElement

  const onClickHeaderButton = () => null

  const onContextMenu = (event: MouseEvent) => {
  	if (event.target === sectionRef) {
  		createRightClickMenuInScreen(event, thisRoute, { top: window?.top as number, left: window?.left as number })
  	}
  }

  onMount(() => inputSearchRef.scrollLeft = inputSearchRef.scrollWidth)
</script>

<section class="flex flex-col h-full p-1">
  <div class="small-border mb-1">
    <div class="small-border-bottom flex h-8 px-1">
      <div class="border-color-soft-up decoration-bar"/>
      <Button className="mr-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("file")}</Button>
      <Button className="mx-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("edition")}</Button>
      <Button className="mx-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("see")}</Button>
      <Button className="mx-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("goTo")}</Button>
      <Button className="mx-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("favourites")}</Button>
      <Button className="ml-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("help")}</Button>
    </div>
    <div class="flex h-8 mx-1">
      <div class="border-color-soft-up decoration-bar"/>
      <div class="flex items-center w-full mt-1">
        <span class="mr-2">{$t("direction")}</span>
        <div class="border-color-soft-down background-white flex justify-between items-center h-7 w-full">
          <img class="h-5 w-5" src={`icons/${desktopIcon.icon}.png`} alt={desktopIcon.icon} draggable="false"/>
          <input class="flex-1 mx-1" value={thisRouteTranslated} readonly bind:this={inputSearchRef} />
          <div class="border-color-soft-up background-silver triangle"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="border-color-soft-down background-white flex-1" on:contextmenu={onContextMenu} bind:this={sectionRef}>
    {#each desktopIconsInThisFolder as { properties, ...icon }}
      <DesktopIcon {...icon} onDblClick={isRecycleBin ? () => null : icon.onDblClick} />
    {/each}
    {#if sectionRef}
      <IconsSelector htmlElement={sectionRef} relativeCoordinates={windowCoordinates} folderRoute={thisRoute} />
    {/if}
  </div>
</section>

<style>
  .small-border {
    border: 1px solid #f5f5f5c5;
    box-shadow: 0px 0px 0px 1px #888888;
  }

  .small-border-bottom {
    border-bottom: 1px solid #888888;
    box-shadow: 0px 3px 0px -2px #f5f5f5c5;
  }

  .decoration-bar {
    margin: 2px 12px 2px -2px;
  }
  .background-white {
    background: white;
  }

  input {
    border: none;
    box-shadow: none;
  }

  .triangle {
    width: 21px;
    height: 24px;
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: 4px 8px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="rgba(0, 0, 0, 0.3)"><polygon points="0,0 100,0 50,50"/></svg>');
  }
</style>
