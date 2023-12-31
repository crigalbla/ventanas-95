<script lang="ts">
  import { freezeCurrentCursor, isMouseOutOfScreen, unfreezeCurrentCursor } from "@/utils"
	import { updateWindowParams, updateDesktopIconParams, desktopIconIdPrefix, windowIdPrefix } from "@/stores"
  import { DESKTOP_SCREEN_ID } from "@/constants"

	export let left: number
	export let top: number
	export let fake = false
	export let canBeDraggabled = true
	export let id: string

	let moving = false
	let fakeDraggable: HTMLElement
	let fakeLeft = 0
	let fakeTop = 0
	let outOfScreenLeft = 0
	let outOfScreenTop = 0

	const updateParams = (() => {
		if (id.includes(desktopIconIdPrefix)) return updateDesktopIconParams
		if (id.includes(windowIdPrefix)) return updateWindowParams

		return () => null
	})()

	const onMouseDown = (e: MouseEvent) => {
		const target: HTMLElement = e?.target as HTMLElement
		if (target?.tagName === "BUTTON" || target.parentElement?.tagName === "BUTTON") return

		moving = true
		outOfScreenLeft = 0
		outOfScreenTop = 0
	}

  const onMouseUp = () => {
  	unfreezeCurrentCursor()
  	moving = false
  	if (fake && fakeDraggable) {
  		fakeDraggable.classList.add("display-none")
  		updateParams(id, { left: left + fakeLeft, top: top + fakeTop })

  		fakeLeft = 0
  		fakeTop = 0
  	}
  }

	const onMouseMove = (e: MouseEvent) => {
		if (moving) {
			freezeCurrentCursor(e)
			if (!isMouseOutOfScreen(e)) {
				if (fake && fakeDraggable) {
					fakeDraggable.classList.remove("display-none")
					fakeLeft += e.movementX + outOfScreenLeft
					fakeTop += e.movementY + outOfScreenTop
				} else {
					updateParams(id, { left: left + e.movementX + outOfScreenLeft, top: top + e.movementY + outOfScreenTop })
				}
				outOfScreenLeft = 0
				outOfScreenTop = 0
			} else {
				outOfScreenLeft += e.movementX
				outOfScreenTop += e.movementY
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
		border: 2px dotted black;
		position: absolute;
		top: calc(var(--fakeTop) * 1px);
    left: calc(var(--fakeLeft) * 1px);
		width: calc(var(--width) * 1px);
    height: calc(var(--height) * 1px);
	}
</style>
