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

  let containerAbout = $state<HTMLDivElement>();
  let containerEmpresas = $state<HTMLDivElement>()
  let containerProjects= $state<HTMLDivElement>();
  

  
</script>

<Side  containerAbout={containerAbout} containerEmpresas={containerEmpresas} containerProjects={containerProjects}/>
{#if browser}
  <div class="absolute overflow-hidden w-full h-full z-0">
    <Asteroids/>
  </div>
{/if}




<div class="lg:hidden flex"></div>

<About bind:containerDiv={containerAbout}/>
<Empresas bind:containerDiv={containerEmpresas}/>
<Projects bind:containerDiv={containerProjects}/>