<script lang="ts">
  import SelectInfo from "$components/assets/select/SelectInfo.svelte";
  import Titulo from "$components/assets/text/Titulo.svelte";
  import WrapperDefault from "$components/assets/wrapper/WrapperDefault.svelte";
  import infoPortfolio from "$lib/localData/portifolio.svelte";
  import { inview } from "svelte-inview";

  let { containerDiv = $bindable() } = $props();
  let isView = $state<boolean>(false)
</script>

<WrapperDefault bind:container={containerDiv}>
  <Titulo titulo="Sobre"/>
  <div class="flex flex-col w-full xl:w-[80%] justify-start items-start">
  <!-- <div class="w-full flex justify-end z-20">
    <SelectInfo bind:selectedOption={selectedOption} options={[{value:"sobre",label:"Sobre"},{value:"conhecimentos",label:"Conhecimentos"}]}/>
  </div> -->
  <div class="w-full rounded-xl flex relative  duration-700 ease-out
   font-semibold text-white text-[14px] lg:text-[18px] text-center
   {isView ? "" : "translate-x-[-50%]"}"
   use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    oninview_change={(event) => {
        const { inView, entry, scrollDirection, observer, node} = event.detail;
        isView = inView;
    }}>
    {#if infoPortfolio.language==="PT-BR"}
    Olá! Sou um desenvolvedor Full-Stack com especialização em tecnologias Java e JavaScript e uso de frameworks reativos como React. Além disso, possuo conhecimento abrangente em diversas outras linguagens, como Golang PHP e Ruby. Minha trajetória é marcada por uma sólida experiência na construção de aplicações web e no desenvolvimento de sistemas backend. Estou sempre motivado para enfrentar novos desafios e contribuir com soluções inovadoras. Estou ansioso para explorar oportunidades e colaborar em projetos empolgantes.
    {:else}
    Hello! I am a Full-Stack developer with a specialization in Java and JavaScript technologies and use of reactive frameworks like React. In addition, I have extensive knowledge in several other languages, such as Golang PHP and Ruby. My trajectory is marked by a solid experience in the construction of web applications and in the development of backend systems.I am always motivated to face new challenges and contribute with innovative solutions. I look forward to exploring opportunities and collaborating on exciting projects.
    {/if}

   </div>
  </div>

</WrapperDefault>


<style>
  .neon{
    box-shadow: 0 0 20px rgba(240, 192, 57, .2);
  }
</style>