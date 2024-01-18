<script lang="ts">
  import { locale, locales } from "@/i18n"
</script>

<select class="choose-language absolute top-1 right-1" bind:value={$locale}>
  {#each locales as l}
    <option value={l}>{l}</option>
  {/each}
</select>

<style>
  .choose-language, option {
    cursor: url('/cursors/arrow.cur'), default;
    z-index: 499;
  }
</style>
