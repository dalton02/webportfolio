<script lang="ts">
  import { base } from "$app/paths";
  import ButtonCursor from "$components/assets/lego/ButtonCursor.svelte";



  import DropBlock from "$components/assets/lego/DropBlock.svelte";
import FocusBlock from "$components/assets/lego/FocusBlock.svelte";
  import asteroidsHandle from "$lib/localData/asteroids.svelte";
  import mouseState from "$lib/localData/mouse.svelte";
  import infoPortfolio from "$lib/localData/portifolio.svelte";
  import Item from "./list/Item.svelte";

    let showSide = $state<boolean>()
    let {containerAbout,containerEmpresas,containerProjects} = $props();
    function redirect(index){
        showSide=false;
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

</script>

<div class="lg:hidden flex fixed top-0 left-0 justify-start p-2  w-full z-30">
<FocusBlock className="relative " containersWithinFocus={[]} bind:viewObject={showSide}>

    <button onclick={()=>showSide=true} class="top-0 left-0 z-10 p-1">
        <img src="/icons/ham.svg" alt="">
    </button>
    <DropBlock isDrop={showSide} className="top-[40px] flex flex-col overflow-hidden absolute left-[10%] bg-black-200 text-white border border-[white] rounded-xl">
        {#each infoPortfolio.menuList as list,i}
            <button class="p-4 px-8 w-full hover:bg-slate-800" onclick={()=>{redirect(i)}}>
                {list.label}
            </button>
        {/each}
    </DropBlock>
</FocusBlock>
</div>




<header class="fixed top-0 left-0 h-[200] p-8 pl-20 pr-20 justify-between items-center gap-4 w-screen text-black z-50 hidden lg:flex ">

    <ul class="gap-8 text-white items-center justify-around flex">
      {#each infoPortfolio.menuList as list,i}
        <Item redirect={()=>{redirect(i)}} info={list}/>
      {/each}
      <ButtonCursor className="hover:rotate-45 ease-in-out p-3 px-3 duration-500" onClick={()=>asteroidsHandle.randomFigure()}>
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
</header> 
