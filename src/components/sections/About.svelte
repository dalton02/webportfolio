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
    <p>
    {#if infoPortfolio.language==="PT-BR"}
      Olá e seja bem-vindo, sou um desenvolvedor full-stack, me especializo na criação de sistemas seguros e de alta performance em golang, tenho experiência
      em peso trabalhando com os frameworks mais populares do mercado front-end, assim como também não perco as origens ao saber lidar com Jquery e o famoso PHP.
      <br/><br/>
      Tenho domínio em paradigmas de POO e PF(Programação Funcional), e sigo as boas práticas para manter um código limpo, bem organizado e de fácil manutenção.

    {:else}
    Hello and welcome, I am a full-stack developer, I specialize in creating safe and high-performance systems in golang, I have experience working with the most popular frameworks in the front-end market, as well as not lose the origins to know how to deal with Jquery and the famous PHP.
    <br/><br/>
    I have mastery in OOP and FP(Functional Programming) paradigms, and follow good practices to maintain a clean, well organized and easy to maintain code.
    {/if}
    </p>
   </div>
  </div>

</WrapperDefault>


<style>
  .neon{
    box-shadow: 0 0 20px rgba(240, 192, 57, .2);
  }
</style>