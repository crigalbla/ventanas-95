<script lang="ts">
  import { isMobileOrTablet } from "@/utils"
  import Main from "./Main.svelte"
  import MainTouchableDevice from "./MainTouchableDevice.svelte"
</script>

{#if isMobileOrTablet()}
  <MainTouchableDevice />
{:else}
  <Main />
{/if}
