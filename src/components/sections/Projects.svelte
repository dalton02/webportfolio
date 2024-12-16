<script lang="ts">

    import ButtonCursor from "$components/assets/lego/ButtonCursor.svelte";
    import SelectInfo from "$components/assets/select/SelectInfo.svelte";
    import Projeto from "$components/elements/cards/Projeto.svelte";
    import infoPortfolio from "$lib/localData/portifolio.svelte";
    import type { Option } from "$lib/types/types";
  import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    
    let {containerDiv = $bindable()} = $props()

    let currentProject = $state<number>(0)
    
    let visibleText = $state<boolean>(false)
    let visibleCards = $state<boolean>(false)
    let containerCards = $state<HTMLDivElement>()

    let direction= $state<number>(1);

    let shakeLeft = $state<boolean>(false)

    let shakeRight = $state<boolean>(false)

    function prev(){
        shakeLeft=true
        setTimeout(()=>{
            shakeLeft=false
        },100)
        direction=1
        if(currentProject===0){
            currentProject=infoPortfolio.projects.length-1;
            return;
        }
        currentProject--
    }
    function next(){ 
        shakeRight=true
        setTimeout(()=>{
            shakeRight=false
        },100)
        direction=-1

        if(currentProject>=infoPortfolio.projects.length-1){
            currentProject=0;
            return
        }
        currentProject++        
    }


    onMount(() => {
        const observer = new IntersectionObserver((entries) => {entries.forEach((entry) => {
            if(entry.target===containerDiv){
                visibleText=entry.isIntersecting
            }
            if(entry.target===containerCards){
                visibleCards=entry.isIntersecting
            }
        });
        },
        { threshold: 0 } 
        );
        observer.observe(containerDiv);
        observer.observe(containerCards);
        
        return () => {
        if (containerDiv) {
            observer.unobserve(containerDiv);
        }
        if (containerCards) {
            observer.unobserve(containerCards);
        }
        };
    });

</script>

<div class="flex flex-col items-center justify-start p-24 h-screen" bind:this={containerDiv}>
    <div class="flex gap-3 justify-center w-full items-center {visibleText ? "scale-100" : "scale-[.3]"}">
        <ButtonCursor className="rotate-[90deg] p-2 hover:-translate-x-1 ease-in-out" onClick={prev}>
            <img src="/icons/arrow.svg" alt="" class:shake={shakeLeft}/>
        </ButtonCursor>
        <b class="text-[24px] text-white">Visualize um projeto</b>
        <ButtonCursor className="rotate-[-90deg] p-2 hover:translate-x-1 ease-in-out" onClick={next}>
            <img src="/icons/arrow.svg" alt="" class:shake={shakeRight}/>
        </ButtonCursor>
    
    </div>
    <div class="h-full flex items-center justify-center w-screen {visibleCards ? "scale-100" : "scale-[.2]"}" bind:this={containerCards}>        
      {#key currentProject}
        <div class="flex absolute" in:fly={{x:2000*direction,duration:600}} out:fly={{x:2000*-direction,duration:600}}>
          <Projeto about={infoPortfolio.projects[currentProject]}/>
        </div>
      {/key}
    </div>
</div>


<style>
    .shake{
    animation: shake 0.32s ease-out both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }
  
    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }
  
    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>