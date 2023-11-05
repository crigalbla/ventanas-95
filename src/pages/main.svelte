<script lang="ts">
  import LoginBody from "@/components/LoginBody.svelte"
  import NavigationBar from "@/components/NavigationBar.svelte"
  import Window from "@/components/Window.svelte"
  import { createWindow, user, windows } from "@/stores"
  import { waitingCursor } from "@/utils"

  const playStartingAudio = () => {
  	// eslint-disable-next-line no-undef
  	const audio = new Audio("/sounds/starting.mp3")
  	void audio.play()
  }

  $: if ($user?.isLoggedIn) {
  	playStartingAudio()
  	waitingCursor()
  	// Why this need a setTimeout?
  	setTimeout(() => createWindow({
  		title: "hola",
  		windowId: Math.random().toString().replace("0.", ""),
  		initialWidth: 200,
  		canBeHidden: true,
  		canBeMaximizedOrMinimized: true
  	}), 1)
  }

  createWindow({
  	title: "login.title",
  	windowId: Math.random().toString().replace("0.", ""),
  	hasQuestionButton: true,
  	isLogin: true,
  	initialWidth: 530
  })
</script>

{#each $windows as window}
  <Window {...window}>
    {#if window.isLogin}
      <LoginBody windowId={window.windowId} />
    {:else}
      Bienvenido!
    {/if}
  </Window>
{/each}
{#if $user?.isLoggedIn}
  <NavigationBar />
{/if}
