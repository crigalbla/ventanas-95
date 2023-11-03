<script lang="ts">
  import Button from "./Button.svelte"
  import { user } from "@/stores"
  import { t } from "@/i18n"
  import { getCurrentTime } from "@/utils"

  let hideStartMenu = true
  let currentTime = getCurrentTime()

  setInterval(() => currentTime = getCurrentTime(), 1000)
</script>

<section class="background-silver border-top-white w-full h-11 absolute bottom-0 flex items-center justify-between px-1">
  <div class:display-none={hideStartMenu} class="background-silver border-color-up h-2/5 w-64 fixed bottom-10">
    <span>
      Hola {$user.userName || "desconocido"}
    </span>
  </div>

  <Button className="h-5/6" on:click={() => hideStartMenu = !hideStartMenu}>
    <img src="icons/ventanas-95.png" alt="start" />
    <span class="font-bold ml-2">{@html $t("navigationBar.start")}</span>
  </Button>
  <div class="background-silver border-under flex items-center justify-center h-5/6 w-40">
    {currentTime}
  </div>
</section>

<style>

</style>
