<script>
  let { title } = $props();
</script>

<div class="relative flex justify-center">
  <h1 class="text-5xl font-bold">{title}</h1>
  <div class="absolute w-[50px] h-[3px] bottom-[-6px] bg-primary"></div>
</div>
