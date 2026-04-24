<script lang="ts">
  let { children, title, subtitle, desc } = $props();
</script>

<div
  class="group relative flex gap-4 rounded-xl border border-white/5 bg-secondary/70 px-5 py-5
  transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/30
  hover:bg-secondary hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
>
  <span
    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg
    border border-primary/20 bg-primary/5 transition-colors duration-300
    group-hover:border-primary/40 group-hover:bg-primary/10"
  >
    {@render children()}
  </span>
  <div class="min-w-0 flex-1">
    <h4 class="text-primary text-lg leading-tight font-medium tracking-wide">
      {title}
    </h4>
    {#if subtitle}
      <p class="mt-0.5 text-xs font-medium tracking-wide text-white/45">
        {subtitle}
      </p>
    {/if}
    <p class="mt-2 text-sm leading-relaxed text-egg/70">
      {desc}
    </p>
  </div>
</div>
