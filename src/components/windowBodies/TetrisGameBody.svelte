<script lang="ts">
  import Tetris from "@/games/tetris/Tetris.svelte"
</script>

<section class="tetris-container">
  <Tetris />
</section>

<style>
  .tetris-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-image: url("/icons/tetris-game-background.png");
  }
</style>
