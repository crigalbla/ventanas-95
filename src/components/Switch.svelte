<script lang="ts">
  import { isMobileOrTablet } from "@/utils"
  import Main from "./Main.svelte"
  import MainTouchableDevice from "./MainTouchableDevice.svelte"

  const isMobileOrTabletResult = isMobileOrTablet()
</script>

{#if isMobileOrTabletResult}
  <MainTouchableDevice />
{:else if isMobileOrTabletResult === false}
  <Main />
{/if}
