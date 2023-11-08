<script lang="ts">
  export let show = false
</script>

<section class:show={show} class="curtain w-full h-full"/>

<style>
  .curtain {
    position: absolute;
    z-index: 99;
    top: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect x="0" y="0" width="5" height="5" fill="rgba(0, 0, 0, 0.2)" /><line x1="1" y1="5" x2="5" y2="0" stroke="rgba(0, 0, 0, 0.2)" stroke-width="1" /></svg>');;
  }

  .show {
    transition: top 0.5s linear;
    top: 0;
  }
</style>
