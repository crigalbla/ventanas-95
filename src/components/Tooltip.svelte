<script lang="ts">
	export let top: number
  export let left: number
  export let text: string
</script>

<section class="tooltip" style="--top:{top}; --left:{left};">{text}</section>

<style>
  .tooltip {
    position: absolute;
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    background: yellow;
    border: 1px solid black;
  }
</style>
