<script lang="ts">
	export let left = 0;
	export let top = 0;
	let moving = false;
	
	const onMouseDown = () => moving = true;
  const onMouseUp = () =>  moving = false;
	const onMouseMove = (e: MouseEvent) => {
		if (moving) {
			left += e.movementX;
			top += e.movementY;
		}
	}
</script>

<style>
	.draggable {
		user-select: none;
    cursor: default;
	}
</style>

<section
  on:mousedown={onMouseDown}
  class="draggable"
  role="button"
  tabindex="0"
>
	<slot />
</section>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />