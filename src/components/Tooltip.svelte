<script lang="ts">
  import { onMount } from "svelte"
  import { t } from "@/i18n"

	export let top: number
  export let left: number

  let isTooltipReady = false
  let tooltioRef: HTMLElement

  onMount(() => {
  	const checkIfTooltipFitsOnScreen = () => {
  		const rect = tooltioRef.getBoundingClientRect()
  		const isOutsideX = rect.right > window.innerWidth
  		const isOutsideY = rect.bottom > window.innerHeight

  		if (isOutsideX) left = left - rect.width
  		if (isOutsideY) top = window.innerHeight - rect.height

  		isTooltipReady = true
  	}

  	checkIfTooltipFitsOnScreen()
  })
</script>

<section
  class="tooltip"
  class:not-ready={!isTooltipReady}
  style="--top:{top}; --left:{left};"
  bind:this={tooltioRef}
>
  {$t("tooltip.text")}
</section>

<style>
  .not-ready {
    opacity: 0;
  }

  .tooltip {
    position: absolute;
    white-space: pre-line;
    font-size: 14px;
    padding: 5px 10px;
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    min-width: 150px;
    margin: 10px;
    background: rgb(255, 255, 245);
    border: 1px solid black;
    z-index: 500;
  }
</style>
