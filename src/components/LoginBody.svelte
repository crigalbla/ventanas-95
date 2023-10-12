<script lang="ts">
  import { windowsHidden } from '@/stores';
  import type { WindowsHiddenType } from "@/stores";
  import { t } from "@/i18n";

  import Button from "./Button.svelte";

  const onClickButtons = () => windowsHidden.update((wH: WindowsHiddenType) => ({ ...wH, login: true }));
  const onKeyUp = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    console.log(value);
  };
</script>

<div class="background-silver flex gap-4 p-4 w-">
  <img class="h-16 w-16" src="icons/connection-2-computers.png" alt="connection-2-computers" />
  <div class="flex gap-4 flex-col">
    <span>{@html $t("login.description")}</span>
    <div class="flex gap-2 flex-col">
      <input type="text" on:keyup={onKeyUp}/>
      <input type="password" />
    </div>
  </div>
  <div class="flex gap-2 flex-col">
    <Button on:click={onClickButtons}>{@html $t("acept")}</Button>
    <Button on:click={onClickButtons}>{@html $t("cancel")}</Button>
  </div>
</div>