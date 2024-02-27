<script lang="ts">
  import MainTouchableDevice from "./MainTouchableDevice.svelte"
  import { isMobileOrTablet } from "@/utils"
  import Main from "./Main.svelte"

  const isMobileOrTabletResult = isMobileOrTablet()
</script>

{#if isMobileOrTabletResult}
  <MainTouchableDevice />
{:else if isMobileOrTabletResult === false}
  <Main />
{/if}
