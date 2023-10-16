<script lang="ts">
	export let left = 0;
	export let top = 0;
	export let fake = false;
	let moving = false;
	let fakeDraggable: HTMLElement;
	let fakeLeft = 0;
	let fakeTop = 0;
	
	const onMouseDown = () => moving = true;
  const onMouseUp = () => {
		moving = false;
		if (fake) {
			fakeDraggable.classList.add("display-none");
			left += fakeLeft;
			top += fakeTop;
	
			fakeLeft = 0;
			fakeTop = 0;
		}
	}
	const onMouseMove = (e: MouseEvent) => {
		if (moving) {
			if (fake) {
				fakeDraggable.classList.remove("display-none");
				fakeLeft += e.movementX;
				fakeTop += e.movementY;
			} else {
				left += e.movementX;
				top += e.movementY;
			}
		}
	}
</script>

<section
  on:mousedown={onMouseDown}
  class="draggable"
  role="button"
  tabindex="0"
>
	<slot />
</section>
<div class="fake-draggable display-none" bind:this={fakeDraggable} style="--fakeTop:{fakeTop}; --fakeLeft:{fakeLeft}" />
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.draggable {
		user-select: none;
    cursor: default;
	}

	.fake-draggable {
		border: 1px dotted black;
		position: absolute;
		top: calc(var(--fakeTop) * 1px);
    left: calc(var(--fakeLeft) * 1px);
		width: calc(var(--width) * 1px);
    height: calc(var(--height) * 1px);
	}

	.display-none {
		display: none;
	}
</style>