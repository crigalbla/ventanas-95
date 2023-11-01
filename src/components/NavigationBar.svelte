<script lang="ts">
  import Button from "./Button.svelte"
  import { user } from "@/stores"
  import { t } from "@/i18n"
</script>

<section class="background-silver w-full h-10 absolute bottom-0 flex items-center justify-between px-1">
  <Button>
    <img src="icons/ventanas-95.png" alt="start" />
    <span class="font-bold ml-2">{@html $t("navigationBar.start")}</span>
  </Button>
  <div class="background-dark-silver h-full w-40">
    <span>
      Hola {$user.userName || "desconocido"}
    </span>

  </div>
</section>

<style>

</style>
