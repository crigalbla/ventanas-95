<script>
  import { locale, locales } from "@/i18n";  
</script>

<select bind:value={$locale}>
  {#each locales as l}
    <option value={l}>{l}</option>
  {/each}
</select>