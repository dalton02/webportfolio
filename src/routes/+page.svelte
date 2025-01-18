<script lang="ts">
  import Asteroids from "$components/sections/animations/Asteroids.svelte";
  import Item from "$components/sections/list/Item.svelte";
  import infoPortfolio from "$lib/localData/portifolio.svelte";
  import About from "$components/sections/About.svelte";
  import Empresas from "$components/sections/Empresas.svelte";
  import mouseState from "$lib/localData/mouse.svelte";
  import ButtonCursor from "$components/assets/lego/ButtonCursor.svelte";
  import asteroidsHandle from "$lib/localData/asteroids.svelte";
  import { browser } from "$app/environment";
  import SelectInfo from "$components/assets/select/SelectInfo.svelte";
  import Projeto from "$components/elements/cards/Projeto.svelte";
  import Projects from "$components/sections/Projects.svelte";
  import { base } from "$app/paths";
  import Side from "$components/sections/Side.svelte";
  import TextSublime from "$components/sections/animations/TextSublime.svelte";
  import Skills from "$components/sections/Skills.svelte";
  import WrapperDefault from "$components/assets/wrapper/WrapperDefault.svelte";
  import Titulo from "$components/assets/text/Titulo.svelte";

  let containerAbout = $state<HTMLDivElement>();
  let containerEmpresas = $state<HTMLDivElement>()
  let containerProjects= $state<HTMLDivElement>();
  let containerSkills = $state<HTMLDivElement>()

  
</script>

<Side  containerAbout={containerAbout} containerEmpresas={containerEmpresas} containerSkills={containerSkills} containerProjects={containerProjects}/>
{#if browser}
  <div class="absolute overflow-hidden w-full h-full z-0">
    <Asteroids/>
  </div>
{/if}






<div class="relative left-0 flex items-center justify-center w-screen text-white h-svh ">
  <TextSublime/>
</div>
<div class="flex flex-col w-full lg:gap-0 gap-20">
<About bind:containerDiv={containerAbout}/>
<Skills bind:containerDiv={containerSkills}/>
<Empresas bind:containerDiv={containerEmpresas}/>
<Projects bind:containerDiv={containerProjects}/>
<!-- <WrapperDefault>
  <Titulo titulo="Contato"/>
  
</WrapperDefault> -->
</div>