<script lang="ts">
  let { title }: { title: string } = $props();
</script>

<div class="relative flex justify-center">
  <h1 class="text-2xl lg:text-4xl font-bold">{title.toUpperCase()}</h1>
  <div class="absolute w-[50px] h-[3px] bottom-[-6px] bg-primary"></div>
</div>
