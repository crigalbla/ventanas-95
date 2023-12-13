<script lang="ts">
  import { createInitialDesktopIcons, createLoginWindow, createWindow, desktopIcons, loginWindowId, user, windows } from "@/stores"
  import LoginBody from "@/components/windowBodies/LoginBody.svelte"
  import NavigationBar from "@/components/NavigationBar.svelte"
  import DesktopIcon from "@/components/DesktopIcon.svelte"
  import Window from "@/components/Window.svelte"
  import { waitingCursor } from "@/utils"

  $: loginWindow = $windows.find(w => w.windowId === loginWindowId)

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

  $: if ($user?.isLoggedIn) {
  	playStartingAudio()
  	waitingCursor()
  	createWindow({
  		title: "1",
  		icon: "window",
  		initialWidth: 300,
  		initialHeight: 100,
  		top: 200,
  		left: 400,
  		isFocused: false,
  		canBeHidden: true,
  		canBeMaximizedOrMinimized: true
  	})
  	createWindow({
  		title: "2",
  		icon: "window",
  		initialWidth: 300,
  		initialHeight: 100,
  		top: 220,
  		left: 420,
  		isFocused: false,
  		canBeHidden: true,
  		canBeMaximizedOrMinimized: true
  	})
  	createWindow({
  		title: "3",
  		icon: "window",
  		initialWidth: 300,
  		initialHeight: 100,
  		top: 240,
  		left: 440,
  		isFocused: false,
  		canBeHidden: true,
  		canBeMaximizedOrMinimized: true
  	})
  	createWindow({
  		title: "4",
  		icon: "window",
  		initialWidth: 300,
  		initialHeight: 100,
  		top: 260,
  		left: 460,
  		isFocused: false,
  		canBeHidden: true,
  		canBeMaximizedOrMinimized: true
  	})
  	createInitialDesktopIcons()
  }
</script>

{#if $user?.isLoggedIn} <!-- HOME SCREEN! User can use Ventanas 95 -->
  {#each $windows as { body, ...window }}
    <Window {...window}>
      <svelte:component this={body} closeCallBack={window.closeCallBack} windowId={window.windowId} />
    </Window>
  {/each}
	{#each $desktopIcons as icon}
		<DesktopIcon {...icon} />
	{/each}
  <NavigationBar />
{:else}
  {#if loginWindow} <!-- INITIAL SCREEN! User has to log in -->
    <Window {...loginWindow}>
      <LoginBody windowId={loginWindow.windowId} />
    </Window>
  {:else} <!-- SUSPENDED SCREEN! User has to click or press a key -->
    <section class="w-full h-full bg-black absolute" use:wakeUp />
  {/if}
{/if}
