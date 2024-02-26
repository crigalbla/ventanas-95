<script lang="ts">
  import { createIsTouchableDeviceWindow, removeWindow, windows } from "@/stores"
  import Window from "./Window.svelte"
  import Button from "./Button.svelte"
  import { t } from "@/i18n"

  $: dataWindow = $windows[0]

  createIsTouchableDeviceWindow()
</script>

{#if dataWindow}
  <Window {...dataWindow}>
    <section class="flex m-5 mr-11">
      <img class="h-16 w-16" src="icons/error-270px.png" alt="error" draggable="false"/>
      <div class="flex flex-col gap-4 ml-4">
        <p>{$t("usingTouchableDevice1")}</p>
        <p>{$t("usingTouchableDevice2")}</p>
        <p class="font-black">{$t("usingTouchableDevice3")}</p>
        <div class="flex self-center mt-2">
          <Button className="px-9" on:click={() => removeWindow(dataWindow.windowId)}>{$t("accept")}</Button>
        </div>
      </div>
    </section>
  </Window>
{/if}
