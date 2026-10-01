<script lang="ts">
  import Icon from "$lib/comps/Icon.svelte";
  import SectionHeading from "$lib/comps/SectionHeading.svelte";
  import SvgTech from "$lib/comps/SvgTech.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import { reveal } from "$lib/utils/reveal.js";
  import aboutJSON from "$lib/json/about.json" with { type: "json" };
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = {
    heading: new Text(ui.about.heading),
    kicker: new Text(ui.about.kicker),
    focus: new Text(ui.about.focus),
    stack: new Text(ui.about.stack),
    education: new Text(ui.about.education),
    languages: new Text(ui.about.languages),
  };
  const languages = new Text(aboutJSON.languages);

  const hello = new Text(aboutJSON.hello);
  const paragraph = new Text(aboutJSON.paragraph);
  let paragraphs = $derived(
    paragraph.value
      .split(/<br\s*\/?>/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter(Boolean),
  );

  const skills = aboutJSON.skills.map((s) => ({ title: new Text(s.title), desc: new Text(s.desc), icon: s.icon }));
  const education = aboutJSON.education.map((e) => ({
    title: new Text(e.title),
    subtitle: new Text(e.subtitle),
    desc: new Text(e.desc),
  }));
</script>

<section id="about" class="relative py-28 sm:py-36">
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <SectionHeading index={1} title={t.heading.value} kicker={t.kicker.value} />

    <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
      <div class="flex flex-col gap-8 lg:col-span-5" use:reveal>
        <p class="font-display text-3xl leading-tight font-light text-sand sm:text-4xl">
          <span class="text-dust">{hello.value}</span><br />
          Dalton Gomes <span class="italic text-clay">Lobato</span>.
        </p>

        <div class="flex flex-col gap-4 border-l border-clay/50 pl-5">
          <span class="font-mono text-[11px] tracking-[0.16em] text-dust uppercase">{t.education.value}</span>
          {#each education as ed (ed.title)}
            <div class="flex flex-col gap-0.5">
              <span class="text-[15px] text-sand">{ed.subtitle.value}</span>
              <span class="text-[14px] text-dust">{ed.title.value}</span>
              <span class="font-mono text-[11px] text-dust/70">{ed.desc.value}</span>
            </div>
          {/each}
        </div>

        <div class="flex flex-col gap-1.5 border-l border-line pl-5">
          <span class="font-mono text-[11px] tracking-[0.16em] text-dust uppercase">{t.languages.value}</span>
          <span class="text-[14px] text-dust">{languages.value}</span>
        </div>
      </div>

      <div class="flex flex-col gap-6 text-[17px] leading-[1.75] text-dust lg:col-span-7" use:reveal={1}>
        {#each paragraphs as p, i (i)}
          <p class={i === 0 ? "text-sand/90" : ""}>{p}</p>
        {/each}
      </div>
    </div>

    <div class="mt-24">
      <h3 class="mb-8 font-mono text-[12px] tracking-[0.16em] text-dust uppercase" use:reveal>{t.focus.value}</h3>
      <ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
        {#each skills as s, i (s.icon)}
          <li
            class="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur-sm
            transition-[border-color,transform] duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-clay/40"
            use:reveal={i}
          >
            <div
              class="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-clay/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden="true"
            ></div>
            <div class="flex items-center justify-between">
              <span class="grid h-11 w-11 place-items-center rounded-xl border border-line bg-ink/70">
                {#if s.icon.startsWith("http")}
                  <img
                    src={s.icon}
                    alt=""
                    class="h-6 w-6 opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                    loading="lazy"
                  />
                {:else}
                  <Icon name="lock" class="h-5 w-5 text-dust transition-colors duration-500 group-hover:text-clay" />
                {/if}
              </span>
              <span class="font-mono text-[11px] text-dust/70">0{i + 1}</span>
            </div>
            <h4 class="font-display text-xl leading-snug text-sand">{s.title.value}</h4>
            <p class="text-[14px] leading-relaxed text-dust">{s.desc.value}</p>
          </li>
        {/each}
      </ul>
    </div>

    <div class="mt-20">
      <h3 class="mb-8 font-mono text-[12px] tracking-[0.16em] text-dust uppercase" use:reveal>{t.stack.value}</h3>
      <ul class="flex flex-wrap gap-2.5" use:reveal={1}>
        {#each aboutJSON.techs as tech (tech.name)}
          <SvgTech url={tech.url} name={tech.name} />
        {/each}
      </ul>
    </div>
  </div>
</section>
