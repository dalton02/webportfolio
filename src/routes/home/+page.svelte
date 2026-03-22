<script>
  import Button from "$lib/comps/Button.svelte";
  import Waves from "$lib/comps/Waves.svelte";
  import { Text } from "$lib/utils/lang.svelte";
</script>

<div class="flex justify-center items-center h-full w-full flex-col">
  <div class="h-40 rounded-full overflow-hidden aspect-square shrink-0 mb-8">
    <img src="/photo.png" alt="my photo" />
  </div>
  <div class="p-1 bg-secondary px-4 border text-sm border-white/20 rounded-2xl">
    {new Text({
      enUs: "FullStack Developer",
      ptBr: "Desenvolvedor FullStack",
    }).value}
  </div>
  <h2 class="text-[32px] font-light text-center p-3">
    Talk is cheap. <br /> Show me the code.
  </h2>
  <p class="text-egg/70 text-sm font-light text-center">
    I design and code beautifully simple things,<br /> and i love what i do
  </p>
  <div class="flex gap-4 mt-10 items-center">
    <Button theme="primary" action={() => {}}>
      {new Text({ enUs: "Download CV", ptBr: "Baixar Currículo" }).value}
    </Button>
    <Button theme="secondary" action={() => {}}>
      {new Text({ enUs: "My Projects", ptBr: "Meus Projetos" }).value}
    </Button>
  </div>

  <div class="absolute bottom-0 left-0 w-full z-20">
    <Waves />
  </div>
</div>
