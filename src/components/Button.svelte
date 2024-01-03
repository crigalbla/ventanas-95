<script lang="ts">
  export let className = ""
  export let id: string = undefined!
  export let removeButtonStyles = false
  export let isMousePointer = false
  export let hasHover = false
  export let buttonRef: HTMLElement | undefined = undefined
</script>

<button
  class:remove-button-styles={removeButtonStyles}
  class:mouse-pointer={isMousePointer}
  class:option={hasHover}
  class={`background-silver flex items-center ${className}`.trim()}
  id={id}
  on:click
  bind:this={buttonRef}
>
  <slot />
</button>

<style>
  .remove-button-styles {
    border: none;
    outline: none;
  }

  .mouse-pointer {
		cursor: url('/cursors/pointer.cur'), pointer;
  }

  .option:hover {
    color: white;
    background-color: #0000aa;
  }

  button:active {
		border-color: #f5f5f5 #0b1717 #0b1717 #f5f5f5;
  }
</style>
