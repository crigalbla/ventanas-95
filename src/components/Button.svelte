<script lang="ts">
  export let className = ""
  export let removeButtonStyles = false
  export let hasHover = false
  export let buttonRef: HTMLElement | undefined = undefined
</script>

<button
  class:remove-button-styles={removeButtonStyles}
  class:option={hasHover}
  class={`background-silver flex items-center ${className}`.trim()}
  on:click
  bind:this={buttonRef}
>
  <slot />
</button>

<style>
  .remove-button-styles {
    cursor: url('/cursors/arrow.cur'), default;
    border: none;
    outline: none;
  }

  .option:hover {
    color: white;
    background-color: #0000bb;
  }
</style>
