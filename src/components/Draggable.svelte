<script lang="ts">
	import { updateWindowParams, updateDesktopIconParams, desktopIconIdPrefix, windowIdPrefix, desktopIcons, type IndividualDesktopIconType } from "@/stores"
  import { freezeCurrentCursor, isMouseOutOfDesktopScreen, isMouseOutOfThisElement, unfreezeCurrentCursor } from "@/utils"
  import { DESKTOP_ROUTE, FAKE_DESKTOP_ICON_ID } from "@/constants"

	export let left: number
	export let top: number
	export let fake = false
	export let canBeDraggabled = true
	export let canBeDropped: boolean = true
	export let id: string

	const isWindow = id.substring(0, 1) === windowIdPrefix
	const isDesktopIcon = id.substring(0, 2) === desktopIconIdPrefix
	let isMouseDown = false
	let realId: string // This is to prevent a error
	let fakeDraggable: HTMLElement
	let fakeLeft = 0
	let fakeTop = 0
	let outOfScreenLeft = 0
	let outOfScreenTop = 0

	$: desktopIcon = $desktopIcons.find(di => di.desktopIconId === id) as IndividualDesktopIconType
	$: updateParams = (() => {
		if (isDesktopIcon && canBeDropped) return updateDesktopIconParams
		if (isWindow) return updateWindowParams

		return () => null
	})()

	const onMouseDown = (e: MouseEvent) => {
		const target: HTMLElement = e?.target as HTMLElement
		if (target?.tagName === "BUTTON" || target.parentElement?.tagName === "BUTTON") return

		isMouseDown = true
		realId = id
		outOfScreenLeft = 0
		outOfScreenTop = 0
	}

  const onMouseUp = () => {
  	isDesktopIcon && isMouseDown && updateDesktopIconParams(realId, { isMoving: false })
  	isWindow && unfreezeCurrentCursor()
  	isMouseDown = false
  	if (fake && fakeDraggable) {
  		fakeDraggable.classList.add("display-none")
  		updateParams(realId, { left: left + fakeLeft, top: top + fakeTop })

  		fakeLeft = 0
  		fakeTop = 0
  	}
  }

	const onMouseMove = (e: MouseEvent) => {
		if (isMouseDown) {
			const isMouseOutOfRange = isDesktopIcon ? isMouseOutOfThisElement(e, document.body) : isMouseOutOfDesktopScreen(e)
			isDesktopIcon && updateDesktopIconParams(id, { isMoving: true })
			isWindow && freezeCurrentCursor(e)
			if (!isMouseOutOfRange) {
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
		class:desktop-icon-only={isDesktopIcon}
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
				class:change-position={desktopIcon.route !== DESKTOP_ROUTE}
				id={FAKE_DESKTOP_ICON_ID}
				style="
					--fakeTop:{fakeTop};
					--fakeLeft:{fakeLeft};
					--color:black;
					--none:none;
					--cursor:{canBeDropped ? "" : "url('/cursors/no-drop.cur'), no-drop"};"
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
	.desktop-icon-only {
		width: 0px;
		height: 0px;
	}

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
		z-index: 1500;
		opacity: 0.5;
	}

	/* TODO: cambiar el 106 y el 10 */
	.change-position {
		top: calc((var(--fakeTop) + 106) * 1px) !important;
		left: calc((var(--fakeLeft) + 10) * 1px) !important;
	}
</style>
