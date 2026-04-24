<script lang="ts">
  let { title }: { title: string } = $props();
</script>

<div class="relative flex flex-col items-center">
  <span
    class="pointer-events-none absolute -top-3 text-[11px] font-medium uppercase tracking-[0.4em] text-primary/60 select-none"
    aria-hidden="true"
  >
    //
  </span>
  <h1
    class="text-2xl lg:text-4xl font-bold tracking-[0.08em] text-egg select-none"
  >
    {title.toUpperCase()}
  </h1>
  <div class="mt-2 flex items-center gap-1.5" aria-hidden="true">
    <span class="h-[2px] w-6 bg-primary/40 rounded-full"></span>
    <span class="h-[3px] w-10 bg-primary rounded-full"></span>
    <span class="h-[2px] w-2 bg-primary/40 rounded-full"></span>
  </div>
</div>
