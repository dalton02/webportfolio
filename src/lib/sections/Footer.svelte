<script lang="ts">
  import Icon from "$lib/comps/Icon.svelte";
  import { headerSections } from "$lib/utils/global.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import homeJSON from "$lib/json/home.json" with { type: "json" };
  import ui from "$lib/json/ui.json" with { type: "json" };

  const presentation = new Text(homeJSON.presentation);
  const made = new Text(ui.footer.made);
  const top = new Text(ui.footer.top);
  const year = new Date().getFullYear();
</script>

<footer class="relative border-t border-line">
  <div class="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 md:flex-row md:items-end md:justify-between">
    <div class="flex flex-col gap-4">
      <a href="#home" class="font-display text-3xl text-sand">
        Dalton <span class="italic text-clay">Gomes</span><span class="text-sun">.</span>
      </a>
      <p class="max-w-sm text-[14px] leading-relaxed text-dust">
        {@html presentation.value}
      </p>
    </div>

    <nav aria-label="Footer" class="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-dust">
      {#each headerSections as sec (sec.id)}
        <a href="#{sec.id}" class="transition-colors hover:text-sand">{sec.label.value}</a>
      {/each}
    </nav>
  </div>

  <div class="mx-auto flex max-w-6xl flex-col gap-4 border-t border-line/60 px-5 py-6 font-mono text-[11px] tracking-[0.06em] text-dust/70 sm:flex-row sm:items-center sm:justify-between sm:px-8">
    <span>© {year} Dalton Gomes Lobato · {made.value}</span>
    <div class="flex items-center gap-5">
      <a href={ui.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="transition-colors hover:text-clay">
        <Icon name="github" class="h-4 w-4" />
      </a>
      <a href={ui.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="transition-colors hover:text-clay">
        <Icon name="linkedin" class="h-3.5 w-3.5" />
      </a>
      <a href="#home" class="group flex items-center gap-1.5 transition-colors hover:text-sand">
        {top.value}
        <Icon name="arrowUp" class="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </a>
    </div>
  </div>
</footer>
