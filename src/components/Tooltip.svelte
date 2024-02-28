<script lang="ts">
  import { onMount } from "svelte"
  import { t } from "@/i18n"

	export let top: number
  export let left: number

  let isTooltipReady = false
  let tooltioRef: HTMLElement
  let shadowWidth = 0
  let shadowHeight = 0

  onMount(() => {
  	const checkIfTooltipFitsOnScreen = () => {
  		const rect = tooltioRef.getBoundingClientRect()
  		const isOutsideX = rect.right > window.innerWidth
  		const isOutsideY = rect.bottom > window.innerHeight
  		shadowWidth = rect.width
  		shadowHeight = rect.height

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
<div
  class="shadow"
  class:not-ready={!isTooltipReady}
  style="--top:{top + 20}; --left:{left + 20}; --shadowWidth:{shadowWidth}; --shadowHeight:{shadowHeight};"
/>

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
    max-width: 440px;
    margin: 10px;
    background: rgb(255, 255, 245);
    border: 1px solid black;
    z-index: 501;
  }

  .shadow {
    position: absolute;
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    width: calc(var(--shadowWidth) * 1px);
    height: calc(var(--shadowHeight) * 1px);
    z-index: 500;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect x="0" y="0" width="5" height="5" fill="rgba(0, 0, 0, 0.2)" /><line x1="1" y1="5" x2="5" y2="0" stroke="rgba(0, 0, 0, 0.2)" stroke-width="1" /></svg>');
  }
</style>
