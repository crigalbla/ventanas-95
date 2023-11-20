<script lang="ts">
  import LoginBody from "@/components/windowBodies/LoginBody.svelte"
  import NavigationBar from "@/components/NavigationBar.svelte"
  import Window from "@/components/Window.svelte"
  import { createWindow, user, windows } from "@/stores"
  import { createLoginWindow, waitingCursor } from "@/utils"

  $: loginWindow = $windows.find(w => w.windowId === "login")

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
  	// Why this need a setTimeout?
  	setTimeout(() => {
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
  	}, 1)
  }
</script>

{#if $user?.isLoggedIn} <!-- HOME SCREEN! User can use Ventanas 95 -->
  {#each $windows as window}
    <Window {...window}>
      <svelte:component this={window.body} closeCallBack={window.closeCallBack} windowId={window.windowId} />
    </Window>
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
