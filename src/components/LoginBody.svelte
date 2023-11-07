<script lang="ts">
  import { removeWindow, user } from "@/stores"
  import type { UserType } from "@/stores"
  import { t } from "@/i18n"
  import Button from "./Button.svelte"

  export let windowId: string = undefined!

  const onClickButtons = () => {
  	removeWindow(windowId)
  	user.update((u: UserType) => ({ ...u, isLoggedIn: true }))
  }
  const onKeyUp = (event: Event) => {
  	const target = event.target as HTMLInputElement
  	const value = target.value

  	user.update((u: UserType) => ({ ...u, userName: value }))
  }
</script>

<div class="background-silver login-body-height flex justify-center gap-4 p-4">
  <img class="h-16 w-16" src="icons/connection-2-computers.png" alt="connection-2-computers" />
  <div class="flex gap-4 flex-col">
    <p>{$t("login.description")}</p>
    <div class="flex gap-2 flex-col">
      <div class="flex items-center">
        <p class="w-28">{$t("login.username")}</p>
        <input class="flex-1" type="text" on:keyup={onKeyUp}/>
      </div>
      <div class="flex items-center">
        <p class="w-28">{$t("login.password")}</p>
        <input class="flex-1"type="password" />
      </div>
    </div>
  </div>
  <div class="flex gap-2 flex-col">
    <Button className="px-4" on:click={onClickButtons}>{$t("accept")}</Button>
    <Button className="px-4" on:click={onClickButtons}>{$t("cancel")}</Button>
  </div>
</div>

<style>
  .login-body-height {
    height: calc(100% - var(--headerHeight) * 1px);
  }
</style>
