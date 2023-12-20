<script lang="ts">
  import { t } from "@/i18n"
  import Button from "../Button.svelte"
  import { desktopIcons, removeWindow, windows, type IndividualDesktopIconType } from "@/stores"

  export let windowId: string
  export let closeCallBack: (props?: { shouldSaveChanges?: boolean, shouldCloseNotepadWindow?: boolean }) => void

  const desktopIconId = $windows.find((w) => w.windowId === windowId)?.desktopIconId as string
  const desktopIcon = $desktopIcons.find((di) => di.desktopIconId === desktopIconId) as IndividualDesktopIconType

  const onClickCancelAnswer = () => {
  	removeWindow(windowId)
  	closeCallBack()
  }

  const onClickNoAnswer = () => {
  	removeWindow(windowId)
  	closeCallBack({ shouldSaveChanges: false, shouldCloseNotepadWindow: true })
  }

  const onClickYesAnswer = () => {
  	removeWindow(windowId)
  	closeCallBack({ shouldSaveChanges: true, shouldCloseNotepadWindow: true })
  }
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
