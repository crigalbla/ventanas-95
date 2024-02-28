<script lang="ts">
  import { onMount } from "svelte"

  import { createLoginWindow, createRightClickMenuInScreen, desktopIconIdPrefix, desktopIcons, getNewCoordinatesInNewFolder, loadDesktopIcons, loginWindowId, removeRightClickMenu, rightClickMenu, updateDesktopIconParams, updateWindowParams, user, windowIdPrefix, windows } from "@/stores"
  import { DESKTOP_ROUTE, DESKTOP_SCREEN_ID, FAKE_DESKTOP_ICON_ID, NAVIGATION_BAR_HEIGHT, RIGHT_CLICK_MENU_ID, SUB_RIGHT_CLICK_MENU_ID, W_BLOCKING } from "@/constants"
  import { isDifferentOfRecycleBinAndMyPC, playAudio, thereIsBlockingWindow, waitingCursor } from "@/utils"
  import LoginBody from "@/components/windowBodies/LoginBody.svelte"
  import NavigationBar from "@/components/NavigationBar.svelte"
  import DesktopIcon from "@/components/DesktopIcon.svelte"
  import Window from "@/components/Window.svelte"

	import RightClickMenu from "./RightClickMenu.svelte"
  import IconsSelector from "./IconsSelector.svelte"

	let desktopScreenRef: HTMLElement
	let windowUnderMouseAtInitOfDrag: string | undefined
  $: loginWindow = $windows.find(w => w.windowId === loginWindowId)
	$: desktopIconsInDesktop = $desktopIcons.filter(di => di.route === DESKTOP_ROUTE)
	$: if ($user?.isLoggedIn) {
  	playAudio("/sounds/starting.mp3")
  	waitingCursor()
  	loadDesktopIcons()
	}

  createLoginWindow()

  const wakeUp = (_: HTMLElement) => {
  	const wakingUp = () => {
  		waitingCursor(1000)
  		createLoginWindow()
  	}

  	setTimeout(() => {
  		window.addEventListener("click", wakingUp)
  		window.addEventListener("keydown", wakingUp)
  	}, 2000)

	  const destroy = () => {
	    window.removeEventListener("click", wakingUp)
	    window.removeEventListener("keydown", wakingUp)
	  }

  	return { destroy }
  }

	const onContextMenu = (event: MouseEvent) => {
		if (thereIsBlockingWindow(event)) return

		const target = event.target as EventTarget & { id: string }
		if (target?.id === DESKTOP_SCREEN_ID) createRightClickMenuInScreen(event)
	}

	// To avoid move desktopIcons between the same folder in different windows
	const updateWindowUnderMouse = (elementsUnderMouse: Element[]) => {
		if (!windowUnderMouseAtInitOfDrag) {
			windowUnderMouseAtInitOfDrag = elementsUnderMouse.find(x => x.id.substring(0, 1) === windowIdPrefix)?.id || "fake"
		}
	}

	const dropDesktopIcon = (event: MouseEvent) => {
		// Complete method when there is the possibility to move several desktopIcons
		const movingDesktopIcons = $desktopIcons.filter(di => di.isMoving)
		if (movingDesktopIcons?.length > 0) {
			if (thereIsBlockingWindow(event)) return

			const isMouseMove = event.type === "mousemove"
			const isMouseUp = event.type === "mouseup"
			const elementsUnderMouse = document.elementsFromPoint(event.clientX, event.clientY)
				?.filter(x => x.id !== FAKE_DESKTOP_ICON_ID)
			updateWindowUnderMouse(elementsUnderMouse)
			const elementShadow = elementsUnderMouse[0] as HTMLElement
			const elementUnderDesktopIcon = elementsUnderMouse[1] as HTMLElement
			const destinationRoute = elementUnderDesktopIcon?.dataset.route
			const isDestinationADesktopIcon = elementUnderDesktopIcon.id.substring(0, 2) === desktopIconIdPrefix
			const isMovingFewPixels = elementUnderDesktopIcon.id === movingDesktopIcons[0].desktopIconId
			const isRecycleBinOrMyPC = !isDifferentOfRecycleBinAndMyPC(movingDesktopIcons[0].desktopIconId)
			const canBeDroppedInFolderOrDesktopIcon = isMovingFewPixels || !isDestinationADesktopIcon || !isRecycleBinOrMyPC
			const isDestinationRouteDifferentOfOrigin = destinationRoute && destinationRoute !== movingDesktopIcons[0].route
			const routePlusName = `${movingDesktopIcons[0].route}\\${movingDesktopIcons[0].name}`
			const isDestinationRouteDifferentOfOriginWithName = destinationRoute && destinationRoute !== routePlusName
			const isRecycleBinOrMyPCMovingToFolder =
				isRecycleBinOrMyPC && isDestinationRouteDifferentOfOrigin && isDestinationRouteDifferentOfOriginWithName
			const isOldRouteIncludedInDestinationRoute = destinationRoute?.includes(routePlusName)

			if (
				canBeDroppedInFolderOrDesktopIcon &&
				(isDestinationRouteDifferentOfOriginWithName || isMovingFewPixels) &&
				(!isOldRouteIncludedInDestinationRoute || isMovingFewPixels) &&
				!isRecycleBinOrMyPCMovingToFolder
			) {
				if (isMouseUp && !isMovingFewPixels) {
					if (isDestinationRouteDifferentOfOrigin) {
						const rectOfShadow = elementShadow.getBoundingClientRect()
						const ajustmentInX = rectOfShadow.left - event.clientX
						const ajustmentInY = rectOfShadow.top - event.clientY
						const newCoordinates = destinationRoute === DESKTOP_ROUTE
							? { top: event.clientY + ajustmentInY, left: event.clientX + ajustmentInX }
							// : { top: 0, left: 0 }
							: getNewCoordinatesInNewFolder(destinationRoute)

						updateDesktopIconParams(
							movingDesktopIcons[0].desktopIconId,
							{ ...newCoordinates, route: destinationRoute, isMoving: false }
						)
					} else {
						const windowUnderMouse = elementsUnderMouse.find(x => x.id.substring(0, 1) === windowIdPrefix)?.id || "fake"
						if (isDestinationADesktopIcon || windowUnderMouseAtInitOfDrag !== windowUnderMouse) {
							updateDesktopIconParams(movingDesktopIcons[0].desktopIconId, { canBeDropped: false })
						}
					}
				}
				if (isMouseMove && !movingDesktopIcons[0].canBeDropped) {
					updateDesktopIconParams(movingDesktopIcons[0].desktopIconId, { canBeDropped: true })
				}

				// Focus or unfocus destination desktopIcon
				if (isMouseMove && isDestinationADesktopIcon) {
					desktopIcons.update(dis =>
						dis.map(di => {
							if (di.desktopIconId === movingDesktopIcons[0].desktopIconId || di.desktopIconId === elementUnderDesktopIcon.id) {
								return { ...di, isFocused: true }
							} else {
								return { ...di, isFocused: false }
							}
						}))
				} else if (isMouseMove && $desktopIcons.filter(di => di.isFocused).length > 1) {
					desktopIcons.update(dis =>
						dis.map(di =>
							di.desktopIconId !== movingDesktopIcons[0].desktopIconId ? { ...di, isFocused: false } : di))
				}
			} else {
				if (isMouseMove && movingDesktopIcons[0].canBeDropped) {
					updateDesktopIconParams(movingDesktopIcons[0].desktopIconId, { canBeDropped: false })
				}
			}

			if (isMouseUp) windowUnderMouseAtInitOfDrag = undefined
		}
	}

	onMount(() => {
		const mouseDown = (event: MouseEvent) => {
			if (thereIsBlockingWindow(event)) return

			const target = event.target as Node
			const rightClickMenu = document.querySelector(`#${RIGHT_CLICK_MENU_ID}`)
			const subRightClickMenu = document.querySelector(`#${SUB_RIGHT_CLICK_MENU_ID}`)

			if (!rightClickMenu?.contains(target) && !subRightClickMenu?.contains(target)) removeRightClickMenu()

			$windows.forEach((w) => {
				const windowsHTML = document.querySelector(`#${w.windowId}`)
				const windowsTabHTML = document.querySelector(`#${w.windowId}-tab`)

				// The target is not the window, is not their tab, is focused and can lose focus
				if (!windowsHTML?.contains(target) && !windowsTabHTML?.contains(target) && w.isFocused && w.canLoseFocus) {
					updateWindowParams(w.windowId, { isFocused: false })
				}
			})

			$desktopIcons.forEach((di) => {
				const desktopIconHTML = document.querySelector(`#${di.desktopIconId}`)

				// The target is not the desktopIcon
				if (!desktopIconHTML?.contains(target)) {
					if (di.isFocused) {
						updateDesktopIconParams(di.desktopIconId, { isFocused: false, isEditingName: false })
					} else if (di.isEditingName) {
						setTimeout(() => {
							const blockingWindow = document.querySelector(`#${W_BLOCKING}`)
							!blockingWindow && updateDesktopIconParams(di.desktopIconId, { isEditingName: false, isFocused: true })
						}, 0)
					}
				}
			})
		}
		const keyDown = (event: KeyboardEvent) => {
			if (thereIsBlockingWindow(event)) return

			if (event.key === "Enter") {
				$desktopIcons.forEach((di) => {
					if (di.isFocused && !di.isEditingName) di.onDblClick()
				})
			}
		}
		const mouseMove = (event: MouseEvent) => dropDesktopIcon(event)
		const mouseUp = (event: MouseEvent) => dropDesktopIcon(event)

		document.addEventListener("mousedown", mouseDown)
		document.addEventListener("keydown", keyDown)
		document.addEventListener("mousemove", mouseMove)
		document.addEventListener("mouseup", mouseUp)

		return () => {
			document.removeEventListener("mousedown", mouseDown)
			document.removeEventListener("keydown", keyDown)
			document.removeEventListener("mousemove", mouseMove)
			document.removeEventListener("mouseup", mouseUp)
		}
	})
</script>

{#if $user?.isLoggedIn} <!-- HOME SCREEN! User can use Ventanas 95 -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<section
		class="desktop-screen"
		id={DESKTOP_SCREEN_ID}
		data-route={DESKTOP_ROUTE}
		style="--navigation-bar-height:{NAVIGATION_BAR_HEIGHT};"
		on:contextmenu={onContextMenu}
		on:drag={(event) => event.preventDefault()}
		bind:this={desktopScreenRef}
	>
		{#each $windows as { body, canLoseFocus, ...window }}
			<Window {...window}>
				<svelte:component
					this={body}
					closeCallBack={window.closeCallBack}
					windowId={window.windowId}
					desktopIconId={window.desktopIconId}
				/>
			</Window>
		{/each}
		{#each desktopIconsInDesktop as { properties, ...icon }}
			<DesktopIcon {...icon} />
		{/each}
	</section>
	{#if desktopScreenRef}
		<IconsSelector rangeToMoveMouse={desktopScreenRef} />
	{/if}
  <NavigationBar />
	{#if $rightClickMenu}
		<RightClickMenu {...$rightClickMenu} />
	{/if}
{:else}
  {#if loginWindow} <!-- INITIAL SCREEN! User has to log in -->
    <Window {...loginWindow}>
      <LoginBody windowId={loginWindow.windowId} />
    </Window>
  {:else} <!-- SUSPENDED SCREEN! User has to click or press a key -->
    <section class="w-full h-full bg-black absolute" use:wakeUp />
  {/if}
{/if}
<svelte:window on:scroll={() => window.scrollTo({ top: 0, left: 0 })} />

<style>
	.desktop-screen {
		width: 100vw;
		height: calc(100vh - calc(var(--navigation-bar-height) * 1px));
	}
</style>
