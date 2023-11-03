<script lang="ts">
  export let className: string = ""
</script>

<button class={`background-silver flex items-center px-4 ${className}`.trim()} on:click>
  <slot />
</button>
