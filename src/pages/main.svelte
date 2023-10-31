<script lang="ts">
  import LoginBody from "@/components/LoginBody.svelte"
  import NavigationBar from "@/components/NavigationBar.svelte"
  import Window from "@/components/Window.svelte"
  import { user, windowsHidden } from "@/stores"

  const playStartingAudio = () => {
  	// eslint-disable-next-line no-undef
  	const audio = new Audio("/sounds/starting.mp3")
  	void audio.play()
  }

  $: if ($user?.isLoggedIn) playStartingAudio()
</script>

<Window title="login.title" hasQuestionButton isLogin initialWidth={530}>
  <LoginBody />
</Window>
{#if $user?.isLoggedIn}
  <NavigationBar />
{/if}
<!-- {JSON.stringify($windowsHidden)} -->
