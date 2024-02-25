<script lang="ts">
	import { updateWindowParams, updateDesktopIconParams, desktopIconIdPrefix, windowIdPrefix, desktopIcons, type IndividualDesktopIconType, windows, getFolderDesktopIconContainingFile } from "@/stores"
  import { freezeCurrentCursor, isMouseOutOfDesktopScreen, isMouseOutOfThisElement, thereIsWindowBlocking, unfreezeCurrentCursor } from "@/utils"
  import { FAKE_DESKTOP_ICON_ID } from "@/constants"
  import { onMount } from "svelte"

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
	let mainSection: HTMLElement
	let fakeDraggable: HTMLElement
	let parentElement: HTMLElement | null
	let fakeLeft = 0
	let fakeTop = 0
	let plusFakeTop = 0
	let plusFakeLeft = 0
	let outOfScreenLeft = 0
	let outOfScreenTop = 0
	let parentScrollLeft = 0
	let parentScrollTop = 0

	$: desktopIcon = $desktopIcons.find(di => di.desktopIconId === id) as IndividualDesktopIconType
	$: route = desktopIcon?.route // route to avoid repetitions of getFolderDesktopIconContainingFile
	$: updateParams = (() => {
		if (isDesktopIcon && canBeDropped) return updateDesktopIconParams
		if (isWindow) return updateWindowParams

		return () => null
	})()
	$: if (route) {
		const folderDesktopIconContainingFile = getFolderDesktopIconContainingFile(route)
		const htmlWindowContainingFile = folderDesktopIconContainingFile && document.querySelector(
			`#${$windows.find((di) => di.desktopIconId === folderDesktopIconContainingFile.desktopIconId)?.windowId}`
		)
		if (htmlWindowContainingFile && parentElement) {
			const htmlWindowContainingFileRect = htmlWindowContainingFile.getBoundingClientRect()
			const parentElementRect = parentElement.getBoundingClientRect()
			const smallMargin = 5

			plusFakeTop = parentElementRect.top - htmlWindowContainingFileRect.top + smallMargin
			plusFakeLeft = parentElementRect.left - htmlWindowContainingFileRect.left + smallMargin
		}
	}

	const onMouseDown = (e: MouseEvent) => {
		if (isDesktopIcon && thereIsWindowBlocking()) return
		if (e.button === 1 || e.button === 2) return

		const target: HTMLElement = e?.target as HTMLElement
		if (target?.tagName === "BUTTON" || target.parentElement?.tagName === "BUTTON") return

		parentScrollLeft = parentElement?.scrollLeft || 0
		parentScrollTop = parentElement?.scrollTop || 0
		isMouseDown = true
		realId = id
		outOfScreenLeft = 0
		outOfScreenTop = 0
		fakeLeft = 0 - parentScrollLeft
  	fakeTop = 0 - parentScrollTop
	}

  const onMouseUp = () => {
  	isDesktopIcon && isMouseDown && updateDesktopIconParams(realId, { isMoving: false })
  	isMouseDown && isWindow && unfreezeCurrentCursor()
  	isMouseDown = false
  	if (fake && fakeDraggable) {
  		fakeDraggable.classList.add("display-none")
  		const newLeft = left + fakeLeft + parentScrollLeft
  		const newTop = top + fakeTop + parentScrollTop
  		if (id === realId) updateParams(realId, { left: newLeft, top: newTop })
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

	onMount(() => {
		if (isDesktopIcon) parentElement = mainSection.parentElement
	})
</script>

{#if canBeDraggabled || isDesktopIcon}
	<section
		class:desktop-icon-only={isDesktopIcon}
		on:mousedown={canBeDraggabled ? onMouseDown : () => null}
		role="tab"
		tabindex="0"
		bind:this={mainSection}
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
				style="
					--fakeTop:{fakeTop};
					--fakeLeft:{fakeLeft};
					--plusFakeTop:{plusFakeTop};
					--plusFakeLeft:{plusFakeLeft};
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
		top: calc((var(--fakeTop) + var(--plusFakeTop, 0)) * 1px);
    left: calc((var(--fakeLeft) + var(--plusFakeLeft, 0)) * 1px);
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
</style>
