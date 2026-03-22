<script lang="ts">
  let { id, children } = $props();
</script>

<div class="w-screen relative h-svh shrink-0" {id}>
  {@render children()}
</div>
