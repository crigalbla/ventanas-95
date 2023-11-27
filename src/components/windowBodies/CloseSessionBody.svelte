<script lang="ts">
  import { t } from "@/i18n"
  import Button from "../Button.svelte"
  import { createLoginWindow, removeWindow, user, windows } from "@/stores"
  import { waitingCursor } from "@/utils"

  export let windowId: string
  export let closeCallBack: () => void

  const onClickNoAnswer = () => {
  	removeWindow(windowId)
  	closeCallBack()
  }

  const onClickYesAnswer = () => {
  	waitingCursor(1500)
  	setTimeout(() => {
  		user.set({})
  		windows.set([])
  		removeWindow(windowId)
  		createLoginWindow()
  	}, 500)
  }
</script>

<section class="flex m-5 mr-11">
  <img class="h-16 w-16" src="icons/key-250px.png" alt="key" draggable="false"/>
  <div class="flex flex-col gap-6">
    <p class="w-max">{$t("navigationBar.sureCloseSession")}</p>
    <div class="flex gap-3">
      <Button className="px-9" on:click={onClickYesAnswer}>{$t("yes")}</Button>
      <Button className="px-9" on:click={onClickNoAnswer}>{$t("no")}</Button>
    </div>
  </div>
</section>
