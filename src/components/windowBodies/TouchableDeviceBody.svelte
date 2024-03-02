<script lang="ts">
  import { removeWindow } from "@/stores"
  import Button from "../Button.svelte"
  import { t } from "@/i18n"

  export let windowId: string
</script>

<section class="flex m-5 mr-11">
  <!-- min-w-[4rem] to avoid windo size problems in mobile -->
  <img class="h-16 w-16 min-w-[4rem]" src="icons/warning-275px.png" alt="error" draggable="false"/>
  <div class="flex flex-col gap-4 ml-4">
    <p>{$t("usingTouchableDevice1")}</p>
    <p>{$t("usingTouchableDevice2")}</p>
    <p class="font-black">{$t("usingTouchableDevice3")}</p>
    <div class="flex self-center mt-2">
      <Button className="px-9" on:click={() => removeWindow(windowId)}>{$t("accept")}</Button>
    </div>
  </div>
</section>
