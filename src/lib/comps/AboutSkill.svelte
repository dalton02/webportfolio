<script lang="ts">
  let { children, title, subtitle, desc } = $props();
</script>

<div
  class="bg-secondary relative rounded-lg px-6 py-5 transition-all duration-300 ease-in-out hover:z-10 hover:scale-[102%] hover:shadow-xl"
>
  <div class="absolute right-8">
    {@render children()}
  </div>
  <div class="w-11/12 md:w-10/12">
    <h4 class="text-primary text-xl leading-tight tracking-wide">
      {title}
    </h4>
    {#if subtitle}
      <p class="text-xs font-medium text-white/40">{subtitle}</p>
    {/if}
    <p class="mt-2 text-sm">
      {desc}
    </p>
  </div>
</div>
