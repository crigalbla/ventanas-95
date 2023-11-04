<script lang="ts">
  import { freezeCurrentCursor, mouseOutOfScreen, unfreezeCurrentCursor } from "@/utils"

	export let left: number
	export let top: number
	export let fake = false
	export let canBeDraggabled = true

	let moving = false
	let fakeDraggable: HTMLElement
	let fakeLeft = 0
	let fakeTop = 0

	const onMouseDown = (e: MouseEvent) => {
		const target: HTMLElement = e?.target as HTMLElement
		if (target?.tagName === "BUTTON" || target.parentElement?.tagName === "BUTTON") return

	  freezeCurrentCursor(e)
		moving = true
	}

  const onMouseUp = () => {
  	unfreezeCurrentCursor()
  	moving = false
  	if (fake && fakeDraggable) {
  		fakeDraggable.classList.add("display-none")
  		left += fakeLeft
  		top += fakeTop

  		fakeLeft = 0
  		fakeTop = 0
  	}
  }

	const onMouseMove = (e: MouseEvent) => {
		if (moving && !mouseOutOfScreen(e)) {
	    if (fake && fakeDraggable) {
	      fakeDraggable.classList.remove("display-none")
	      fakeLeft += e.movementX
	      fakeTop += e.movementY
	    } else {
	      left += e.movementX
	      top += e.movementY
	    }
	  }
	}
</script>

{#if canBeDraggabled}
	<section
		on:mousedown={onMouseDown}
		role="tab"
		tabindex="0"
	>
		<slot />
	</section>
	{#if fake && moving}
		<div class="fake-draggable display-none" bind:this={fakeDraggable} style="--fakeTop:{fakeTop}; --fakeLeft:{fakeLeft}" />
	{/if}
{:else}
		<slot />
{/if}
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.fake-draggable {
		border: 1px dotted black;
		position: absolute;
		top: calc(var(--fakeTop) * 1px);
    left: calc(var(--fakeLeft) * 1px);
		width: calc(var(--width) * 1px);
    height: calc(var(--height) * 1px);
	}
</style>
