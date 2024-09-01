<script lang="ts">
  import Tetris from "@/games/tetris/Tetris.svelte"
  import { t } from "@/i18n"

  import Button from "../Button.svelte"

  let level = 1
  let isPlaying = true
  let isMuted = false
  let showLevelDropdown = false

  const changeLevel = (newLevel: number) => { level = newLevel; showLevelDropdown = false }
</script>

<div class="small-border-bottom flex h-6 px-1 py-1">
  <div class="border-color-soft-up"/>
  <Button className="mx-2" removeButtonStyles on:click={() => showLevelDropdown = !showLevelDropdown}>{$t("tetrisGame.level")}</Button>
  <Button className="mx-2" removeButtonStyles on:click={() => isPlaying = !isPlaying}>{$t(isPlaying ? "tetrisGame.pause" : "tetrisGame.resume")}</Button>
  <Button className="mx-2" removeButtonStyles on:click={() => isMuted = !isMuted}>{$t(isMuted ? "tetrisGame.unmute" : "tetrisGame.mute")}</Button>
  {#if showLevelDropdown}
    <div class="levels-dropdown border-color-up">
      <Button className="p-1 w-16" removeButtonStyles on:click={() => changeLevel(1)}>{$t("tetrisGame.level")} 1</Button>
      <Button className="p-1 w-16" removeButtonStyles on:click={() => changeLevel(2)}>{$t("tetrisGame.level")} 2</Button>
      <Button className="p-1 w-16" removeButtonStyles on:click={() => changeLevel(3)}>{$t("tetrisGame.level")} 3</Button>
      <Button className="p-1 w-16" removeButtonStyles on:click={() => changeLevel(4)}>{$t("tetrisGame.level")} 4</Button>
      <Button className="p-1 w-16" removeButtonStyles on:click={() => changeLevel(5)}>{$t("tetrisGame.level")} 5</Button>
      <Button className="p-1 w-16" removeButtonStyles on:click={() => changeLevel(6)}>{$t("tetrisGame.level")} 6</Button>
      <Button className="p-1 w-16" removeButtonStyles on:click={() => changeLevel(7)}>{$t("tetrisGame.level")} 7</Button>
      <Button className="p-1 w-16" removeButtonStyles on:click={() => changeLevel(8)}>{$t("tetrisGame.level")} 8</Button>
      <Button className="p-1 w-16" removeButtonStyles on:click={() => changeLevel(9)}>{$t("tetrisGame.level")} 9</Button>
      <Button className="p-1 w-16" removeButtonStyles on:click={() => changeLevel(10)}>{$t("tetrisGame.level")} 10</Button>
    </div>
  {/if}
</div>
<section class="tetris-container">
  <Tetris {level} {isPlaying} {isMuted} />
</section>

<style>
  .tetris-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("/icons/tetris-game-background.png");
  }

  .small-border-bottom {
    border-bottom: 1px solid #888888;
    box-shadow: 0px 3px 0px -2px #f5f5f5c5;
  }

  .levels-dropdown {
    position: absolute;
    margin-top: 20px;
  }
</style>
