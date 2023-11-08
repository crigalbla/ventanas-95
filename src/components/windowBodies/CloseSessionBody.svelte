<script lang="ts">
  import { t } from "@/i18n"
  import Button from "../Button.svelte"
</script>

<section class="flex flex-col h-40 w-96 m-5">
  <div class="flex items-center">
    <img class="h-16 w-16" src="icons/key-250px.png" alt="key" />
    <p>{$t("navigationBar.sureCloseSession")}</p>
  </div>
  <div class="flex self-center gap-3">
    <Button className="px-8" on:click={() => console.log("yes")}>{$t("yes")}</Button>
    <Button className="px-8" on:click={() => console.log("no")}>{$t("no")}</Button>
  </div>
</section>
