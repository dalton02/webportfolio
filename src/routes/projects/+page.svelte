<script lang="ts">
  import Project from "$lib/comps/Project.svelte";
  import Title from "$lib/comps/Title.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import obj from "$lib/json/projects.json" with { type: "json" };
</script>

<div class="flex flex-col w-full gap-4 lg:gap-12 pt-10 h-full lg:items-center">
  <Title
    title={new Text({
      enUs: "Projects",
      ptBr: "Projetos",
    }).value}
  />
  <div class="relative">
    <div
      class=" w-full px-4 lg:px-30 flex flex-wrap justify-center items-start gap-7 py-6 scroll-bar"
    >
      {#each obj.projects as { desc, image, subtitle, tags, title, url }}
        <Project
          title={new Text(title).value}
          subtitle={new Text(subtitle).value}
          desc={new Text(desc).value}
          {url}
          {image}
          {tags}
        />
      {/each}
    </div>
  </div>
</div>

<style>
  .sh {
    opacity: 1;
    background: var(--color-background);
    background: linear-gradient(
      90deg,
      var(--color-background) 20%,
      rgba(237, 221, 83, 0) 100%
    );
  }
  .sh2 {
    opacity: 1;
    background: var(--color-background);
    background: linear-gradient(
      -90deg,
      var(--color-background) 20%,
      rgba(237, 221, 83, 0) 100%
    );
  }

  .scroll-bar::-webkit-scrollbar {
    width: 6px;
    height: 4px;
  }
  .scroll-bar::-webkit-scrollbar-track {
    background: transparent;
  }
  .scroll-bar::-webkit-scrollbar-thumb {
    background-color: var(--color-egg);
    border-radius: 10px;
  }
  .scroll-bar::-webkit-scrollbar-thumb:hover {
    background-color: #494849;
  }
</style>
