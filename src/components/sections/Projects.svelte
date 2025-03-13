<script lang="ts">
  import { base } from "$app/paths";


    import ButtonCursor from "$components/assets/lego/ButtonCursor.svelte";
    import Titulo from "$components/assets/text/Titulo.svelte";
    import WrapperDefault from "$components/assets/wrapper/WrapperDefault.svelte";
    import Projeto from "$components/elements/cards/Projeto.svelte";
    import infoPortfolio from "$lib/localData/portifolio.svelte";
    import { quadIn, quadOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    
    let {containerDiv = $bindable()} = $props()

    let currentProject = $state<number>(0)
    
    let visibleText = $state<boolean>(true)
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

    let tituloLang = $derived.by(()=>{
      switch(infoPortfolio.language){
        case "PT-BR":
          return "Projetos";
        case "EN-US":
          return "Projects";
        case "IT-IT":
          return ".."
      }
    })




</script>

<WrapperDefault bind:container={containerDiv} >

  <Titulo titulo={tituloLang}/>

  <div class="flex text-white text-[14px] lg:text-[18px] flex-row gap-2 lg:gap-3 justify-center w-full items-center duration-[600ms] {visibleText ? "scale-100" : "scale-[.1]"}">
    <ButtonCursor disabled={shakeLeft} className="rotate-[90deg] flex p-2 hover:-translate-x-1 ease-in-out" onClick={prev}>
        <img src="{base}/icons/arrow.svg" alt=""  class="w-4 lg:w-8" class:shake={shakeLeft}/>
    </ButtonCursor>
    {infoPortfolio.PTUSAIT("Visualize os projetos","Search between projects","")}
    <ButtonCursor disabled={shakeRight} className="rotate-[-90deg] p-2 flex hover:translate-x-1 ease-in-out" onClick={next}>
        <img src="{base}/icons/arrow.svg" alt="" class="w-4 lg:w-8" class:shake={shakeRight}/>
    </ButtonCursor>
  </div>

  <div class="h-[620px] xl:h-[500px] flex items-center  justify-center w-screen duration-[600ms] {visibleCards ? "scale-100" : "scale-[1]"}" bind:this={containerCards}>        
    {#key currentProject}
      <div class="flex absolute" in:fly={{x:2500*direction,duration:600,easing:quadOut}} out:fly={{x:2500*-direction,duration:900,easing:quadIn}}>
        <Projeto about={infoPortfolio.projects[currentProject]}/>
      </div>
    {/key}
  </div>
</WrapperDefault>



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