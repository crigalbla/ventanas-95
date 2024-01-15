<script lang="ts">
	import { updateWindowParams, updateDesktopIconParams, desktopIconIdPrefix, windowIdPrefix } from "@/stores"
  import { freezeCurrentCursor, isMouseOutOfScreen, unfreezeCurrentCursor } from "@/utils"
  import { FAKE_DESKTOP_ICON_ID } from "@/constants"

	export let left: number
	export let top: number
	export let fake = false
	export let canBeDraggabled = true
	export let canBeDropped: boolean = true
	export let id: string

	const isWindow = id.substring(0, 1) === windowIdPrefix
	const isDesktopIcon = id.substring(0, 2) === desktopIconIdPrefix
	let isMouseDown = false
	let fakeDraggable: HTMLElement
	let fakeLeft = 0
	let fakeTop = 0
	let outOfScreenLeft = 0
	let outOfScreenTop = 0

	$: updateParams = (() => {
		if (isDesktopIcon && canBeDropped) return updateDesktopIconParams
		if (isWindow) return updateWindowParams

		return () => null
	})()

	const onMouseDown = (e: MouseEvent) => {
		const target: HTMLElement = e?.target as HTMLElement
		if (target?.tagName === "BUTTON" || target.parentElement?.tagName === "BUTTON") return

		isMouseDown = true
		outOfScreenLeft = 0
		outOfScreenTop = 0
	}

  const onMouseUp = () => {
  	isWindow && unfreezeCurrentCursor()
  	isMouseDown = false
  	if (fake && fakeDraggable) {
  		fakeDraggable.classList.add("display-none")
  		updateParams(id, { left: left + fakeLeft, top: top + fakeTop, isMoving: false })

  		fakeLeft = 0
  		fakeTop = 0
  	}
  }

	const onMouseMove = (e: MouseEvent) => {
		if (isMouseDown) {
			updateParams(id, { isMoving: true })
			isWindow && freezeCurrentCursor(e)
			if (!isMouseOutOfScreen(e)) {
				if (fake && fakeDraggable) {
					fakeDraggable.classList.remove("display-none")
					fakeLeft += e.movementX + outOfScreenLeft
					fakeTop += e.movementY + outOfScreenTop
				} else {
					updateParams(id, { left: left + e.movementX + outOfScreenLeft, top: top + e.movementY + outOfScreenTop, isMoving: true })
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
	{#if fake && isMouseDown}
		{#if isWindow}
			<div
				class="fake-window position display-none"
				style="--fakeTop:{fakeTop}; --fakeLeft:{fakeLeft};"
				bind:this={fakeDraggable}
			/>
		{:else if isDesktopIcon}
			<div
				class="fake-desktop-icon position display-none"
				id={FAKE_DESKTOP_ICON_ID}
				style="--fakeTop:{fakeTop}; --fakeLeft:{fakeLeft}; --color:black; --none:none; --cursor:{canBeDropped ? "" : "no-drop"};"
				bind:this={fakeDraggable}
			>
				<slot />
			</div>
		{/if}
	{/if}
{:else}
	<slot />
{/if}
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.position {
		position: absolute;
		top: calc(var(--fakeTop) * 1px);
    left: calc(var(--fakeLeft) * 1px);
		width: calc(var(--width) * 1px);
    height: calc(var(--height) * 1px);
	}
	.fake-window {
		border: 2px dotted black;
	}

	.fake-desktop-icon {
		cursor: var(--cursor);
		z-index: 999;
		opacity: 0.6;
	}
</style>
