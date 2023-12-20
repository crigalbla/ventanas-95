<script lang="ts">
  import { t } from "@/i18n"
  import Button from "../Button.svelte"
  import { desktopIcons, removeWindow, windows, type IndividualDesktopIconType } from "@/stores"

  export let windowId: string

  const desktopIconId = $windows.find((w) => w.windowId === windowId)?.desktopIconId as string
  const desktopIcon = $desktopIcons.find((di) => di.desktopIconId === desktopIconId) as IndividualDesktopIconType

  const onClickCancelAnswer = () => removeWindow(windowId)

  // TODO hacer que no guarde
  const onClickNoAnswer = () => removeWindow(windowId)

  // TODO hacer que guarde
  const onClickYesAnswer = () => removeWindow(windowId)
</script>

<section class="flex m-5 mr-11">
  <img class="h-14 w-14" src="icons/warning-275px.png" alt="warning" draggable="false"/>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col ml-3 gap-2">
      <p class="w-max">{$t("saveChangesBody.title", { file: $t(desktopIcon?.name) })}</p>
      <p class="w-max">{$t("saveChangesBody.question")}</p>
    </div>
    <div class="flex gap-3">
      <Button className="flex justify-center w-24" on:click={onClickYesAnswer}>{$t("yes")}</Button>
      <Button className="flex justify-center w-24" on:click={onClickNoAnswer}>{$t("no")}</Button>
      <Button className="flex justify-center w-24" on:click={onClickCancelAnswer}>{$t("cancel")}</Button>
    </div>
  </div>
</section>
