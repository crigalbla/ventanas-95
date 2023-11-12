<script lang="ts">
  import Button from "./Button.svelte"
  import Curtain from "./Curtain.svelte"
  import CloseSessionBody from "./windowBodies/CloseSessionBody.svelte"
  import { t } from "@/i18n"
  import { getCurrentTime, waitingCursor } from "@/utils"
  import { createWindow, user, windows, type UserType } from "@/stores"
  import TurnOffBody from "./windowBodies/TurnOffBody.svelte"
  import TabWindow from "./TabWindow.svelte"

  type MenuOptions = "closeSession" | "suspend" | "turnOff"

  let hideStartMenu = true
  let currentTime = getCurrentTime()
  let buttonRef: HTMLElement
  let showCurtain = false

  setInterval(() => currentTime = getCurrentTime(), 1000)

  $: if (hideStartMenu) {
  	buttonRef?.classList.remove("border-color-down")
  } else {
  	buttonRef?.classList.add("border-color-down")
  }

  const onClickInOption = (option: MenuOptions) => {
  	if (option === "closeSession") {
  		showCurtain = !showCurtain
  		setTimeout(() => {
  			createWindow({
  				title: "navigationBar.closeVentanas95Session",
  				windowId: "closeSession",
  				zIndex: 100,
  				canBeResized: false,
  				canBeDraggabled: false,
  				body: CloseSessionBody,
  				closeCallBack: () => showCurtain = !showCurtain
  			})
  		}, 700)
  	} else if (option === "suspend") {
  		const miliseconds = 1200
  		waitingCursor(miliseconds)
  		setTimeout(() => {
  			user.update((u: UserType) => ({ ...u, isLoggedIn: false }))
  		}, miliseconds)
  	} else if (option === "turnOff") {
  		showCurtain = !showCurtain
  		setTimeout(() => {
  			createWindow({
  				title: "navigationBar.closeVentanas95",
  				windowId: "turnOff",
  				zIndex: 100,
  				canBeResized: false,
  				canBeDraggabled: false,
  				body: TurnOffBody,
  				closeCallBack: () => showCurtain = !showCurtain
  			})
  		}, 700)
  	}

  	hideStartMenu = !hideStartMenu
  }
</script>

<Curtain show={showCurtain} />
<section
  class="background-silver border-top-white w-full h-11 absolute bottom-0 flex items-center justify-between px-1"
  id="navigation-bar"
>
  <div class:display-none={hideStartMenu} class="background-silver border-color-up w-64 fixed bottom-10 flex">
    <div class="background-dark-silver text-color-silver vertical-text tracking-wide text-5xl pr-1 py-3">
      <span class="font-extrabold">Ventanas</span>
      <span class="text-white">95</span>
    </div>
    <div class="w-full flex flex-col-reverse">
      <Button className="text-left" hasHover removeButtonStyles on:click={() => onClickInOption("turnOff")}>
        <img class="h-16 w-16" src="icons/turn-off.png" alt="turn-off"/>
        <span>
          {$t("navigationBar.turnOff")}
        </span>
      </Button>
      <Button className="text-left" hasHover removeButtonStyles on:click={() => onClickInOption("suspend")}>
        <img class="h-16 w-16" src="icons/suspend.png" alt="suspend"/>
        <span>
          {$t("navigationBar.suspend")}
        </span>
      </Button>
      <Button className="text-left" hasHover removeButtonStyles on:click={() => onClickInOption("closeSession")}>
        <img class="h-16 w-16" src="icons/key-250px.png" alt="key"/>
        <span>
          {`${$t("navigationBar.closeSession")} ${$user.userName ?? ""}`.trim()}
        </span>
      </Button>
      <div class="border-color-soft-down self-center h-0 w-11/12 my-2" />
    </div>
  </div>

  <div class="flex items-center gap-1 h-full w-full">
    <Button className="px-1 h-5/6" on:click={() => hideStartMenu = !hideStartMenu} bind:buttonRef>
      <img src="icons/window.png" alt="start" />
      <span class="text-xl tracking-wider font-extrabold ml-2">{$t("navigationBar.start")}</span>
    </Button>
    {#each $windows as window}
      <TabWindow title={window.title} windowId={window.windowId} isMinimized={window.isMinimized ?? false} icon={window.icon}>
        <svelte:component this={window.body} closeCallBack={window.closeCallBack} windowId={window.windowId} />
      </TabWindow>
    {/each}
  </div>
  <div class="background-silver border-color-soft-down flex items-center justify-between pl-1 pr-2 h-5/6 w-28">
    <img class="h-8 w-8" src="icons/speaker-220px.png" alt="speaker"/>
    {currentTime}
  </div>
</section>

<style>
  .vertical-text {
    writing-mode: vertical-rl;
    white-space: nowrap;
    transform: rotate(180deg);
  }
</style>
