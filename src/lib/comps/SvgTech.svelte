<script lang="ts">
  let { url, name }: { url: string; name: string } = $props();

  const prefix = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";
</script>

<li
  class="group flex items-center gap-3 rounded-full border border-line bg-surface/60 py-1.5 pr-4 pl-1.5
  text-[13px] text-dust transition-colors duration-300 select-none hover:border-clay/40 hover:text-sand"
>
  <span class="grid h-7 w-7 place-items-center rounded-full bg-ink/80">
    <img
      src={prefix + url}
      class="h-4 w-4 opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
      alt=""
      loading="lazy"
    />
  </span>
  {name}
</li>
