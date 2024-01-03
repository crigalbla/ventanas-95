<script lang="ts">
  import Button from "../Button.svelte"
  import { t } from "@/i18n"

  const onClickHeaderButton = () => null
</script>

<section class="flex flex-col h-full p-1">
  <div class="small-border mb-1">
    <div class="small-border-bottom flex h-8 px-1">
      <div class="border-color-soft-up decoration-bar"/>
      <Button className="mr-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("file")}</Button>
      <Button className="mx-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("edition")}</Button>
      <Button className="mx-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("see")}</Button>
      <Button className="mx-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("goTo")}</Button>
      <Button className="mx-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("favourites")}</Button>
      <Button className="ml-2 mt-1" removeButtonStyles on:click={onClickHeaderButton}>{$t("help")}</Button>
    </div>
    <div class="flex h-8 mx-1">
      <div class="border-color-soft-up decoration-bar"/>
      <div class="flex items-center w-full mt-1">
        <span class="mr-2">{$t("direction")}</span>
        <div class="border-color-soft-up background-white w-full">
          Search...
        </div>
      </div>
    </div>
  </div>
  <div class="border-color-soft-down background-white flex-1">
    This is a folderBody
  </div>
</section>

<style>
  .small-border {
    border: 1px solid #f5f5f5c5;
    box-shadow: 0px 0px 0px 1px #888888;
  }

  .small-border-bottom {
    border-bottom: 1px solid #888888;
    box-shadow: 0px 3px 0px -2px #f5f5f5c5;
  }

  .decoration-bar {
    margin: 2px 12px 2px -2px;
  }
  .background-white {
    background: white;
  }
</style>
