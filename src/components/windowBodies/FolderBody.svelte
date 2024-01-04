<script lang="ts">
  import { createRightClickMenuInScreen, desktopIcons, windows, type IndividualDesktopIconType, type IndividualWindowType } from "@/stores"
  import DesktopIcon from "../DesktopIcon.svelte"
  import Button from "../Button.svelte"
  import { t } from "@/i18n"

  export let windowId: string
  export let desktopIconId: string

  $: window = $windows.find(w => w.windowId === windowId) as IndividualWindowType
  $: desktopIcon = $desktopIcons.find(di => di.desktopIconId === desktopIconId) as IndividualDesktopIconType
  $: thisRoute = `${desktopIcon.route}\\${$t(desktopIcon.name)}`
  $: desktopIconsInThisFolder = $desktopIcons.filter(di => di.route === thisRoute)
  let sectionRef: HTMLElement

  const onClickHeaderButton = () => null

  const onContextMenu = (event: MouseEvent) => {
  	console.log(event.target === sectionRef)
  	// const target = event.target as EventTarget & { className: string }
  	// if (target?.className.includes("desktop-screen")) {
  		createRightClickMenuInScreen(event, thisRoute, { top: window?.top as number, left: window?.left as number })
  	// }
  }
</script>

<section class="flex flex-col h-full p-1" bind:this={sectionRef}>
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
          <span>{thisRoute}</span>
          <div class="border-color-soft-up background-silver triangle"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="border-color-soft-down background-white flex-1" on:contextmenu={onContextMenu}>
    {#each desktopIconsInThisFolder as { properties, ...icon }}
      <DesktopIcon {...icon} />
    {/each}
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

  .triangle {
    width: 20px;
    height: 24px;
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: 4px 8px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="rgba(0, 0, 0, 0.3)"><polygon points="0,0 100,0 50,50"/></svg>');
  }
</style>