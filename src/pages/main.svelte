<script lang="ts">
  import LoginBody from "@/components/LoginBody.svelte"
  import NavigationBar from "@/components/NavigationBar.svelte"
  import Window from "@/components/Window.svelte"
  import { user, windowsHidden } from "@/stores"
  import { waitingCursor } from "@/utils"

  const windowId = Math.random().toString().replace("0.", "")

  const playStartingAudio = () => {
  	// eslint-disable-next-line no-undef
  	const audio = new Audio("/sounds/starting.mp3")
  	void audio.play()
  }

  $: if ($user?.isLoggedIn) {
  	playStartingAudio()
  	waitingCursor()
  }
</script>

<Window title="login.title" hasQuestionButton isLogin initialWidth={530} {windowId}>
  <LoginBody {windowId} />
</Window>
{#if $user?.isLoggedIn}
  <Window title="hola" initialWidth={200} canBeHidden canBeMaximizedOrMinimized>
    Bienvenido!
  </Window>
  <NavigationBar />
{/if}
<!-- {JSON.stringify($windowsHidden)} -->
