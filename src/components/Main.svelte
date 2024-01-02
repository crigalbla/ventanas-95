<script lang="ts">
  import { createInitialDesktopIcons, createInitialWindows, createLoginWindow, createRightClickMenuInDesktopScreen, desktopIcons, loginWindowId, removeRightClickMenu, rightClickMenu, updateDesktopIconParams, updateWindowParams, user, windows } from "@/stores"
  import { DESKTOP_SCREEN_ID, NAVIGATION_BAR_HEIGHT, RIGHT_CLICK_MENU_ID, SUB_RIGHT_CLICK_MENU_ID } from "@/constants"
  import LoginBody from "@/components/windowBodies/LoginBody.svelte"
  import NavigationBar from "@/components/NavigationBar.svelte"
  import DesktopIcon from "@/components/DesktopIcon.svelte"
  import Window from "@/components/Window.svelte"
  import { isDifferenceGreaterThan2Seconds, waitingCursor } from "@/utils"
  import { onMount } from "svelte"
  import RightClickMenu from "./RightClickMenu.svelte"
  import IconsSelector from "./IconsSelector.svelte"

  $: loginWindow = $windows.find(w => w.windowId === loginWindowId)
	let userLoggedAt: Date

  createLoginWindow()

  const playStartingAudio = () => {
  	// eslint-disable-next-line no-undef
  	const audio = new Audio("/sounds/starting.mp3")
  	void audio?.play()
  }

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
		const target = event.target as EventTarget & { className: string }
		// isDifferenceGreaterThan2Seconds is necessary due to body.style.pointerEvents is empty in this moment
		if (target?.className.includes("desktop-screen") && isDifferenceGreaterThan2Seconds(userLoggedAt, new Date())) {
			createRightClickMenuInDesktopScreen(event)
		}
	}

  $: if ($user?.isLoggedIn) {
  	playStartingAudio()
  	waitingCursor()
  	createInitialWindows()
  	createInitialDesktopIcons()
  	userLoggedAt = new Date()
  }

	onMount(() => {
		const mouseDownEvent = (event: Event) => {
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
						updateDesktopIconParams(di.desktopIconId, { isEditingName: false })
					}
				}
			})
		}
		document.addEventListener("mousedown", mouseDownEvent)

		return () => document.removeEventListener("mousedown", mouseDownEvent)
	})
</script>

{#if $user?.isLoggedIn} <!-- HOME SCREEN! User can use Ventanas 95 -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<section
		class="desktop-screen"
		id={DESKTOP_SCREEN_ID}
		style="--navigation-bar-height:{NAVIGATION_BAR_HEIGHT};"
		on:contextmenu={onContextMenu}
	>
		{#each $windows as { body, canLoseFocus, desktopIconId, ...window }}
			<Window {...window}>
				<svelte:component this={body} closeCallBack={window.closeCallBack} windowId={window.windowId} />
			</Window>
		{/each}
		{#each $desktopIcons as { properties, ...icon }}
			<DesktopIcon {...icon} />
		{/each}
	</section>
	<IconsSelector />
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

<style>
	.desktop-screen {
		width: 100vw;
		height: calc(100vh - calc(var(--navigation-bar-height) * 1px));
	}
</style>
