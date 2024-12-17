<script>
  import SelectInfo from "$components/assets/select/SelectInfo.svelte";
  import Titulo from "$components/assets/text/Titulo.svelte";
  import WrapperDefault from "$components/assets/wrapper/WrapperDefault.svelte";


  import TextSublime from "./animations/TextSublime.svelte";

  let { containerDiv = $bindable() } = $props();

  let selectedOption = $state({value:"sobre",label:"Sobre"})

</script>

<WrapperDefault bind:container={containerDiv}>
  <Titulo titulo="Sobre"/>
  <div class="flex flex-col w-full justify-start items-start">
  <!-- <div class="w-full flex justify-end z-20">
    <SelectInfo bind:selectedOption={selectedOption} options={[{value:"sobre",label:"Sobre"},{value:"conhecimentos",label:"Conhecimentos"}]}/>
  </div> -->

  <div class="w-full rounded-3xl flex relative p-12 font-semibold text-gray-50 h-[40%] min-h-[40%] text-[18px]">

    Seja bem vindo ao meu portifolio, me chamo Dalton Gomes Lobato, sou um desenvolvedor Full-Stack com anos de experiência no mercado, especializado nas mais diversas tecnologias,
    comecei a programar desde criança produzindo jogos na ferramente GameMaker e logo após comecei a pegar na minha primeira linguagem sólida do mercado, o Java, desde então passei a ter como hobby
    fazer pequenas ferramentas e programas com SFX e Applet, passei a conhecer o mundo do desenvolvimento web com PHP e a partir dai comecei a levar os estudos mais a sério estudando 
    Design Patterns e afins.

  </div>
  </div>

</WrapperDefault>