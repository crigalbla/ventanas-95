<script lang="ts">
  import Tetris from "@/games/tetris/Tetris.svelte"

  export let windowId: string
</script>

<section class="tetris-container">
  <Tetris windowId={windowId} />
</section>

<style>
  .tetris-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("/icons/tetris-game-background.png");
  }
</style>
