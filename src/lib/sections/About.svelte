<script lang="ts">
  import SectionHeading from "$lib/comps/SectionHeading.svelte";
  import PixelIcon from "$lib/pixel/PixelIcon.svelte";
  import PixelSprite from "$lib/pixel/PixelSprite.svelte";
  import { aws, bolt, book, git, gopher, react, server, shield, tux, type Sprite } from "$lib/pixel/sprites.js";
  import { Text } from "$lib/utils/lang.svelte";
  import { reveal } from "$lib/utils/reveal.js";
  import sfx from "$lib/utils/sfx.svelte";
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
      .filter(Boolean)
      .map((p) =>
        p.split(/(\[[^\]]+\]\([^)]+\))/).map((part) => {
          const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          return link ? { text: link[1], href: link[2] } : { text: part };
        }),
      ),
  );

  // one original pixel icon per "equipped" skill, in the order of about.json
  const skillArt: Sprite[] = [server, shield, bolt];
  const skills = aboutJSON.skills.map((s, i) => ({
    title: new Text(s.title),
    desc: new Text(s.desc),
    art: skillArt[i % skillArt.length],
  }));
  const education = aboutJSON.education.map((e) => ({
    title: new Text(e.title),
    subtitle: new Text(e.subtitle),
    desc: new Text(e.desc),
  }));

  const devicon = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";
  // hand-drawn stand-ins for logos the automatic pixel pass turns to mush
  const techArt: Record<string, Sprite> = { Go: gopher, React: react, AWS: aws, Linux: tux, Git: git };
  let hoveredTech = $state<string | null>(null);
</script>

<section id="about" class="relative py-24 sm:py-32">
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <SectionHeading title={t.heading.value} kicker={t.kicker.value} />

    <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
      <!-- status card -->
      <div class="flex flex-col gap-10 lg:col-span-5" use:reveal>
        <div class="px-box px-dialog flex flex-col gap-1 p-5">
          <span class="font-label text-[13px] text-mist uppercase">{hello.value}</span>
          <span class="font-title text-[18px] leading-snug text-gold-hi sm:text-[22px]">Dalton Gomes Lobato</span>
        </div>

        <div class="px-box px-parch flex flex-col gap-4 p-5">
          <span class="flex items-center gap-2.5 font-title text-[11px] uppercase">
            <PixelSprite sprite={book} scale={2} />
            {t.education.value}
          </span>
          {#each education as ed (ed.title)}
            <div class="flex flex-col gap-0.5 border-l-4 border-path pl-3">
              <span class="text-[18px] leading-snug font-semibold">{ed.subtitle.value}</span>
              <span class="text-[16px] leading-snug">{ed.title.value}</span>
              <span class="font-label text-[12px] text-path-lo">{ed.desc.value}</span>
            </div>
          {/each}
        </div>

        <div class="px-box px-parch flex flex-col gap-1.5 p-5">
          <span class="font-title text-[11px] uppercase">{t.languages.value}</span>
          <span class="text-[17px]">{languages.value}</span>
        </div>
      </div>

      <!-- the story itself, on a parchment page -->
      <div class="px-box px-parch flex flex-col gap-5 p-6 text-[19px] leading-[1.6] sm:p-8 lg:col-span-7" use:reveal={1}>
        {#each paragraphs as p, i (i)}
          <p>
            {#each p as part, j (j)}
              {#if part.href}
                <a
                  href={part.href}
                  target="_blank"
                  rel="noopener"
                  class="font-semibold text-water-lo underline decoration-2 underline-offset-4 hover:bg-gold-hi hover:text-bark"
                  >{part.text}</a
                >
              {:else}
                {part.text}
              {/if}
            {/each}
          </p>
        {/each}
      </div>
    </div>

    <!-- equipped items -->
    <div class="mt-24">
      <h3 class="mb-8 font-title text-[13px] text-snow uppercase px-outline-sm" use:reveal>{t.focus.value}</h3>
      <ul class="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
        {#each skills as s, i (s.title.value)}
          <li class="group px-box px-dialog flex flex-col gap-4 p-5" use:reveal={i} onmouseenter={() => sfx.cursor()}>
            <div class="flex items-center gap-4">
              <!-- hover: the slot frame turns gold, like a selected inventory slot -->
              <span
                class="px-box px-slot-dark grid h-16 w-16 shrink-0 place-items-center group-hover:[--c1:var(--color-gold-hi)]"
              >
                <span class="group-hover:hop"><PixelSprite sprite={s.art} scale={3} /></span>
              </span>
              <h4 class="font-title text-[12px] leading-relaxed text-balance text-gold-hi uppercase">{s.title.value}</h4>
            </div>
            <p class="text-[17px] leading-relaxed text-snow/90">{s.desc.value}</p>
          </li>
        {/each}
      </ul>
    </div>

    <!-- inventory -->
    <div class="mt-24">
      <h3 class="mb-8 font-title text-[13px] text-snow uppercase px-outline-sm" use:reveal>{t.stack.value}</h3>
      <div class="px-box px-menu p-3 sm:p-6" use:reveal={1}>
        <ul class="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-x-3 gap-y-4 sm:grid-cols-[repeat(auto-fill,minmax(76px,1fr))] sm:gap-4">
          {#each aboutJSON.techs as tech (tech.name)}
            <li
              class="group flex flex-col items-center gap-2"
              onmouseenter={() => {
                hoveredTech = tech.name;
                sfx.cursor();
              }}
              onmouseleave={() => (hoveredTech = null)}
            >
              <span class="px-box px-slot grid h-14 w-14 place-items-center sm:h-16 sm:w-16 group-hover:-translate-y-1">
                {#if techArt[tech.name]}
                  <PixelSprite sprite={techArt[tech.name]} scale={2} />
                {:else}
                  <PixelIcon src={devicon + tech.url} />
                {/if}
              </span>
              <span
                class="text-center font-label text-[11px] leading-tight uppercase {hoveredTech === tech.name
                  ? 'text-gold-hi'
                  : 'text-snow'}">{tech.name}</span
              >
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>
