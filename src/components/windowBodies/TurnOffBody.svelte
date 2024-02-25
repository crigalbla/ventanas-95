<script lang="ts">
  import { createLoginWindow, removeWindow, user, windows } from "@/stores"
  import { waitingCursor } from "@/utils"
  import Button from "../Button.svelte"
  import { t } from "@/i18n"

  export let windowId: string
  export let closeCallBack: () => void

  let radioValue = "turnOff"

  const onClickCancelAnswer = () => {
  	removeWindow(windowId)
  	closeCallBack()
  }

  const onClickAcceptAnswer = () => {
  	waitingCursor(1500)
  	setTimeout(() => {
  		user.set({})
  		windows.set([])
  		if (radioValue === "restart") createLoginWindow()
  	}, 500)
  }
</script>

<section class="flex m-5 mr-11">
  <img class="h-16 w-16" src="icons/turn-off.png" alt="turn-off" draggable="false"/>
  <div class="flex flex-col ml-4">
    <p class="w-max mb-4">{$t("navigationBar.confirmWhatWant")}</p>
    <label class="flex items-center gap-1">
      <input type="radio" bind:group={radioValue} value="turnOff" />
      <span>{$t("navigationBar.turnOffSystem")}</span>
    </label>
    <label class="flex items-center gap-1">
      <input type="radio" bind:group={radioValue} value="restart" />
      <span>{$t("navigationBar.restart")}</span>
    </label>
    <div class="flex gap-3 mt-6">
      <Button className="px-5" on:click={onClickAcceptAnswer}>{$t("accept")}</Button>
      <Button className="px-5" on:click={onClickCancelAnswer}>{$t("cancel")}</Button>
    </div>
  </div>
</section>
