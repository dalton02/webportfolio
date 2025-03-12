<script lang="ts">
    import { base } from "$app/paths";


    import ButtonCursor from "$components/assets/lego/ButtonCursor.svelte";
    import Titulo from "$components/assets/text/Titulo.svelte";
    import WrapperDefault from "$components/assets/wrapper/WrapperDefault.svelte";
  import mouseState from "$lib/localData/mouse.svelte";
    import infoPortfolio from "$lib/localData/portifolio.svelte";
    import { inview } from "svelte-inview";
    import { expoInOut, expoOut } from "svelte/easing";
    import { fly, scale, slide } from "svelte/transition";

    let currentIcon = $state<string>("svelte")
    let {containerDiv = $bindable()} = $props()
    let giantView = $state<boolean>(false)
    let blockView =  $state<boolean[]>([false,false,false,false,false,false])


    let tituloLang = $derived.by(()=>{
      switch(infoPortfolio.language){
        case "PT-BR":
          return "Habilidades";
        case "EN-US":
          return "Skills";
        case "IT-IT":
          return ".."
      }
    })
        
</script>



<WrapperDefault bind:container={containerDiv} className=""> 
    <Titulo titulo={tituloLang}/>

    <div class="flex justify-start relative items-center  flex-col">
    
      <div class="flex gap-6 w-full px-2 lg:px-24 justify-start lg:justify-center  overflow-x-auto">
              {#each infoPortfolio.programming as programa,i (i)}
                      {@render item(programa,i)}
              {/each}
      </div>
      
      {#key currentIcon}
      {#if currentIcon.length>0}
        <img  use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }} transition:scale|global={{duration:500,easing:expoInOut}} 
        oninview_change={(event) => {
          const { inView, entry, scrollDirection, observer, node} = event.detail;
          giantView = inView;
      }} src="{base}/icons/{currentIcon}-plain.svg" class="{giantView ? "" : "scale-[0.3]"}  duration-500 ease-in-out mt-36 absolute w-[240px] lg:w-[400px]" alt="">
      {/if}
      {/key}
    </div>


</WrapperDefault>





{#snippet item(item,i)}
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="flex justify-center items-center flex-shrink-0 p-3 xl:p-4 border-2 border-dashed 
    hover:border-transparent hover:bg-white  cursor-none
    duration-300 ease-out hover:rounded-md group {mouseState.state.haveCustomCursor ? "lg:cursor-none" : ""}
    {blockView[i] ? "scale-100" : "scale-[0.1]"}" 
    title={item} 
    use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    oninview_change={(event) => {
        const { inView, entry, scrollDirection, observer, node} = event.detail;
        blockView[i] = inView;
    }}
    onmouseenter={(event)=>{
      currentIcon=item;
    }}
    onmouseleave={(event)=>{
      currentIcon=""
    }}
    role="button"
    tabindex="-1"
    >
        <img src="{base}/icons/{item}-plain.svg" class="w-9 xl:w-12" alt="">

  </div>
{/snippet}


