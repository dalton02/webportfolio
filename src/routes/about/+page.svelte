<script lang="ts">
  import AboutSkill from "$lib/comps/AboutSkill.svelte";
  import SvgTech from "$lib/comps/SvgTech.svelte";
  import TimeLine from "$lib/comps/TimeLine.svelte";
  import Title from "$lib/comps/Title.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import aboutJSON from "$lib/json/about.json" with { type: "json" };

  const titles = {
    intro: new Text({
      enUs: "Introduction",
      ptBr: "Introdução",
    }),
    tech: new Text({
      enUs: "Technologies",
      ptBr: "Tecnologias",
    }),

    skills: new Text({
      enUs: "Skills",
      ptBr: "Habilidades primárias",
    }),

    timeline: new Text({
      enUs: "Work timeline",
      ptBr: "Experiência",
    }),

    education: new Text({
      enUs: "Education",
      ptBr: "Educação",
    }),
  };
</script>

<div class="flex flex-col w-full gap-12 pt-10 h-full items-center">
  <Title
    title={new Text({
      enUs: "About me",
      ptBr: "Sobre mim",
    }).value}
  />
  <div
    class="max-w-[1102px] flex flex-col not-lg:px-5 lg:grid w-full grid-cols-10 gap-10 grow"
  >
    <div class="flex flex-col gap-5 h-full z-10 col-span-5">
      {@render title(titles.intro.value)}
      <div class="relative flex flex-col pl-5 border-l border-primary/25">
        <span
          class="absolute left-[-3px] top-0 h-10 w-[5px] rounded-full bg-primary"
          aria-hidden="true"
        ></span>
        <h2 class="text-2xl leading-tight font-light text-egg md:text-4xl">
          {new Text(aboutJSON.hello).value}
          <br />
          <b class="text-primary">Dalton Gomes Lobato</b>
        </h2>

        <h3 class="py-5 text-lg leading-relaxed font-light text-egg/85 italic md:text-xl">
          {new Text(aboutJSON.catchPhrase).value}
        </h3>
        <p
          class="text-sm leading-relaxed font-light tracking-wide text-white/55"
        >
          {@html new Text(aboutJSON.paragraph).value}
        </p>
      </div>
      {@render title(titles.skills.value)}
      <div class="flex flex-col gap-5">
        {#each aboutJSON.skills as skill, i}
          <AboutSkill
            desc={new Text(skill.desc).value}
            title={new Text(skill.title).value}
            subtitle=""
          >
            <img src={skill.icon} class={i == 0 ? "w-8" : "w-6"} alt="" />
          </AboutSkill>
        {/each}
      </div>

      {@render title(titles.education.value)}
      <div class="flex flex-col gap-5">
        {#each aboutJSON.education as education}
          <AboutSkill
            desc={new Text(education.desc).value}
            title={new Text(education.title).value}
            subtitle={new Text(education.subtitle).value}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              class="fill-primary"
              viewBox="0 0 256 256"
              ><path
                d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z"
              ></path></svg
            >
          </AboutSkill>
        {/each}
      </div>
    </div>
    <div class="flex flex-col h-full z-10 col-span-5 gap-1">
      {@render title(titles.tech.value)}
      <div class="grid grid-cols-4 lg:grid-cols-6 gap-3 mt-4 mb-8">
        {#each aboutJSON.techs as tech}
          <SvgTech url={tech.url} name={tech.name} />
        {/each}
      </div>
      {@render title(titles.timeline.value)}
      <div class="mt-4">
        <TimeLine
          timeline={aboutJSON.timeline.map((obj) => {
            return {
              desc: new Text(obj.desc).value,
              highlights: obj.highlights
                ? new Text(obj.highlights).value
                : undefined,
              from: new Date(obj.from),
              to: obj.to ? new Date(obj.to) : null,
              title: obj.title,
            };
          })}
        />
      </div>
    </div>
    <div class="h-10 w-full"></div>
  </div>
</div>

{#snippet title(text: string)}
  <div class="flex items-center gap-2">
    <span class="h-px w-6 bg-primary" aria-hidden="true"></span>
    <span
      class="text-[11px] font-medium uppercase tracking-[0.2em] text-primary"
    >
      {text}
    </span>
  </div>
{/snippet}
