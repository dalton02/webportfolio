<script>
  import { goto } from "$app/navigation";
  import Button from "$lib/comps/Button.svelte";
  import Waves from "$lib/comps/Waves.svelte";
  import globalState from "$lib/utils/global.svelte";
  import { Text } from "$lib/utils/lang.svelte";

  const presentation = new Text({
    enUs: "Ideias são o ponto de partida.<br /> Código é o que entrega valor.",
    ptBr: "Ideias são o ponto de partida.<br /> Código é o que entrega valor.",
  });
  const doing = new Text({
    enUs: "Eu projeto e construo sistemas que escalam,<br /> com código limpo e propósito.",
    ptBr: "Eu projeto e construo sistemas que escalam,<br /> com código limpo e propósito.",
  });
</script>

<div class="flex justify-center items-center h-full w-full flex-col">
  <div class="h-40 rounded-full overflow-hidden aspect-square shrink-0 mb-8">
    <img src="{globalState.basePath}/photo.png" alt="profile pic" />
  </div>
  <div class="p-1 bg-secondary px-4 border text-sm border-white/20 rounded-2xl">
    {new Text({
      enUs: "FullStack Developer",
      ptBr: "Desenvolvedor FullStack",
    }).value}
  </div>
  <h2 class="text-xl plg:text-3xl font-light text-center p-3">
    {@html presentation.value}
  </h2>
  <p class="text-egg/70 text-sm font-light text-center">
    {@html doing.value}
  </p>
  <div class="flex gap-4 mt-10 items-center">
    <Button theme="primary" action={() => {}}>
      {new Text({ enUs: "Download CV", ptBr: "Baixar Currículo" }).value}
    </Button>
    <Button
      theme="secondary"
      action={() => {
        goto("/projects");
      }}
    >
      {new Text({ enUs: "My Projects", ptBr: "Meus Projetos" }).value}
    </Button>
  </div>

  <div class="absolute bottom-0 left-0 w-full z-20">
    <Waves />
  </div>
</div>
