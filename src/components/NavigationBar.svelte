<script lang="ts">
  import Button from "./Button.svelte"
  import { t } from "@/i18n"
  import { getCurrentTime } from "@/utils"

  let hideStartMenu = true
  let currentTime = getCurrentTime()

  setInterval(() => currentTime = getCurrentTime(), 1000)
</script>

<section class="background-silver border-top-white w-full h-11 absolute bottom-0 flex items-center justify-between px-1" id="navigation-bar">
  <div class:display-none={hideStartMenu} class="background-silver border-color-up h-2/5 w-64 fixed bottom-10 flex">
    <div>
      <span>Ventanas</span>
      <span>95</span>
    </div>
    <div>
      <div class="h-0 w-full" />
      <div class="flex items-center">
        <img class="h-16 w-16" src="icons/key-250px.png" alt="key"/>
        <span>
          {$t("navigationBar.closeSession")}
        </span>
      </div>
      <div class="flex items-center">
        <img class="h-16 w-16" src="icons/suspend.png" alt="suspend"/>
        <span>
          {$t("navigationBar.suspend")}
        </span>
      </div>
      <div class="flex items-center">
        <img class="h-16 w-16" src="icons/turn-off.png" alt="turn-off"/>
        <span>
          {$t("navigationBar.turnOff")}
        </span>
      </div>
    </div>
  </div>

  <Button className="h-5/6" on:click={() => hideStartMenu = !hideStartMenu}>
    <img src="icons/window.png" alt="start" />
    <span class="text-xl font-extrabold ml-2">{$t("navigationBar.start")}</span>
  </Button>
  <div class="background-silver border-under flex items-center justify-between pl-1 pr-2 h-5/6 w-28">
    <img class="h-8 w-8" src="icons/speaker-220px.png" alt="speaker"/>
    {currentTime}
  </div>
</section>

<style>

</style>
