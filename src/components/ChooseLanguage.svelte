<script lang="ts">
  import { locale, locales } from "@/i18n"
</script>

<select class="choose-language" bind:value={$locale}>
  {#each locales as l}
    <option value={l}>{l}</option>
  {/each}
</select>

<style>
  .choose-language, option {
    cursor: url('/cursors/arrow.cur'), default;
  }
</style>
