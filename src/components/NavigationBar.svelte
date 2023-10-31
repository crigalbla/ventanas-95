<script lang="ts">
  import { user } from "@/stores"
</script>

<section class="background-silver w-full h-10 bg-red-900 absolute bottom-0">
  Hola {$user.userName || "desconocido"}
</section>

<style>

</style>
