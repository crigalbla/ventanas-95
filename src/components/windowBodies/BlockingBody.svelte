<script lang="ts">
  import { desktopIcons, windows, removeWindow, type IndividualDesktopIconType, type IndividualWindowType } from "@/stores"
  import Button from "../Button.svelte"
  import { playAudio } from "@/utils"
  import { onMount } from "svelte"
  import { t } from "@/i18n"

  export let windowId: string
  export let desktopIconId: string

  const desktopIcon = $desktopIcons.find((di) => di.desktopIconId === desktopIconId) as IndividualDesktopIconType
  const myWindow = $windows.find((w) => w.windowId === windowId) as IndividualWindowType
  const subTitle = `${myWindow?.title.split(".")[0]}.subtitle`

  onMount(() => playAudio("/sounds/error.mp3"))
</script>

<section class="flex m-5 mr-11 gap-4">
  <img class="h-11 w-11" src="icons/error-270px.png" alt="error" draggable="false" />
  <div class="flex flex-col gap-6">
    <p>{$t(subTitle, { filename: $t(desktopIcon?.name) })}</p>
    <div class="flex justify-center">
      <Button className="px-9" on:click={() => removeWindow(windowId)}>{$t("accept")}</Button>
    </div>
  </div>
</section>
