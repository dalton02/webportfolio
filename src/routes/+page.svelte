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

  let containerAbout = $state<HTMLDivElement>();
  let containerEmpresas = $state<HTMLDivElement>()
  let containerHabilitys = $state<HTMLDivElement>();
  let containerProjects= $state<HTMLDivElement>();
  
  function redirect(index){
      switch(index){
        case 0:
          containerAbout.scrollIntoView({ behavior: 'smooth' });
          break;
        case 1:
          containerEmpresas.scrollIntoView({ behavior: 'smooth' });
          break;
        case 2:
          containerProjects.scrollIntoView({ behavior: 'smooth' });
          break;
          
        default:
          break;

      }
  }


  function randomAsteroid(){  

      asteroidsHandle.randomFigure()
    
  }
  
</script>

{#if browser}
  <div class="absolute overflow-hidden w-full h-full z-0">
    <Asteroids/>
  </div>
{/if}


<div class="fixed top-0 left-0 h-[200] p-8 pl-20 pr-20 flex justify-between items-center gap-4 w-screen text-black z-50">

    <ul class="flex gap-8 text-white items-center justify-around">
      {#each infoPortfolio.menuList as list,i}
        <Item redirect={()=>{redirect(i)}} info={list}/>
      {/each}
      <ButtonCursor className="hover:rotate-45 ease-in-out p-3 px-1 duration-500" onClick={randomAsteroid}>
        ?
      </ButtonCursor>
    </ul>
    
    <div class="flex items-center gap-8">

      <button onclick={()=>{infoPortfolio.language = "PT-BR";}} 
        class="{mouseState.state.haveCustomCursor ? "hover:cursor-none" : ""} hover:scale-105">
        <img class="h-[30px]" src="{base}/icons/brasil.svg" alt=""/>
      </button>
      
      <button onclick={()=>{infoPortfolio.language = "EN-US";}} class="{mouseState.state.haveCustomCursor ? "hover:cursor-none" : ""} hover:scale-105">
        <img class="h-[30px]" src="{base}/icons/usa.svg" alt=""/>
      </button>
    
    </div>
</div> 


<About bind:containerDiv={containerAbout}/>
<Empresas bind:containerDiv={containerEmpresas}/>
<Projects bind:containerDiv={containerProjects}/>