<script lang="ts">
  import { removeWindow, windows, type IndividualWindowType } from "@/stores"
  import { t } from "@/i18n"

  import Button from "../Button.svelte"
  import { W_TETRIS_GAME } from "@/constants"
  import { beforeUpdate } from "svelte"

  export let windowId: string
  export let closeCallBack: IndividualWindowType["closeCallBack"]

  $: tetrisGameWindow = $windows.find(w => w.windowId === W_TETRIS_GAME)

  const onAccept = () => {
  	removeWindow(windowId)
  	closeCallBack?.()
  }

  beforeUpdate(() => {
  	!tetrisGameWindow && removeWindow(windowId)
  })
</script>

<section class="flex flex-col m-5 gap-4 w-28">
  <p class="flex justify-center">{$t("tetrisGame.gameOver")}</p>
  <div class="flex justify-center">
    <Button className="px-3" on:click={onAccept}>{$t("accept")}</Button>
  </div>
</section>
