<script lang="ts">
    import { base } from "$app/paths";


    import ButtonCursor from "$components/assets/lego/ButtonCursor.svelte";
    import Titulo from "$components/assets/text/Titulo.svelte";
    import WrapperDefault from "$components/assets/wrapper/WrapperDefault.svelte";
    import infoPortfolio from "$lib/localData/portifolio.svelte";
    import { inview } from "svelte-inview";
    import { expoInOut, expoOut } from "svelte/easing";
    import { fly, slide } from "svelte/transition";

    let estado = $state<number>(0)
    let {containerDiv = $bindable()} = $props()
    
    let blockView =  $state<boolean[]>([false,false,false,false,false,false])
    let viewButtons = $state<boolean>(false)
    let viewText = $state<boolean>() 
    
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
        
    let text = $derived.by(()=>{
      switch(infoPortfolio.language){
        case "PT-BR":
          return {
            buttons:["Desenvolvimento","Ferramentas"],
            aboutEach:[
            `Desenvolvimento de sistemas altamente otimizados, seguros e escaláveis, projetados para atender às necessidades específicas do seu negócio. Trabalho com uma ampla variedade de paradigmas de programação e arquiteturas de software, garantindo soluções eficientes, robustas e flexíveis.`
            ]
          };
        case "EN-US":
          return {
            buttons:["Programming","WorkTools"],
            aboutEach:[`Development of highly optimized, secure and scalable systems, designed to meet the specific needs of your business. I work with a wide variety of programming paradigms and software architectures, ensuring efficient, robust and flexible solutions.`,
            `I'm more curious about which tools I use, whether testing or third-party, for backend testing mainly using typescript
            I use vitest for frontend applications, for the backend I like the Golang language utility package (the author's favorite), for my 
            typescript projects I use the good old jester.`]
          };
        case "IT-IT":
          return {
            buttons:["Creation","WorkTools"],
            aboutEach:[""]
          }
      }
    })
</script>



<WrapperDefault bind:container={containerDiv} className="mt-12"> 
    <Titulo titulo={tituloLang}/>

    <div class="flex justify-start items-center flex-col">
   
    <div class="flex gap-6 w-[80%] xl:w-[60%] justify-center  flex-wrap {estado===2 ? "flex-col" : ""}">
        {#if estado===0}
            {#each infoPortfolio.programming as programa,i (i)}
                    {@render item(programa,i)}
            {/each}
            
        {:else if estado===1}
                {#each infoPortfolio.tools as programa,i (i)}
                    {@render item(programa,i)}
                {/each}
        {/if}
    </div>
    {#key estado}
    <div class="flex flex-col text-white duration-500 ease-out justify-center text-center items-center  mt-10 lg:px-56 text-[12px] xl:text-[16px] 
    {viewText ? "" : "translate-x-[-50%]"}"
    in:slide={{duration:1000}}
    use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    oninview_change={(event) => {
        const { inView, entry, scrollDirection, observer, node} = event.detail;
        viewText = inView;
    }}>

            {@html text.aboutEach[estado]}        
            
    </div>
    {/key}
    </div>


</WrapperDefault>





{#snippet botao(label,index)}
    <div class="flex"
    use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    oninview_change={(event) => {
        const { inView, entry, scrollDirection, observer, node} = event.detail;
        viewButtons = inView;
    }}>
        <ButtonCursor className=" font-semibold p-6 py-2 text-[14px] xl:text-[18px] duration-500 ease-in-out rounded-3xl
        {index===estado ? "bg-white text-black-100" : "text-white hover:bg-white hover:text-black-100 "}
        {viewButtons ? "" : "scale-[.2]"}"
        onClick={()=>{
            if(estado===index)  return
            estado=index
            blockView=[]    
        }}
        >
            {label}
        </ButtonCursor>      

    </div>
{/snippet}


{#snippet item(item,i)}
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="flex justify-center items-center p-3 xl:p-4 border-2 border-dashed 
    hover:border-transparent hover:bg-white 
    duration-300 ease-out hover:rounded-md 
    {blockView[i] ? "scale-100" : "scale-[0.1]"}" 
    title={item} 
    use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    oninview_change={(event) => {
        const { inView, entry, scrollDirection, observer, node} = event.detail;
        blockView[i] = inView;
    }}
    >
        <img src="{base}/icons/{item}-plain.svg" class="w-9 xl:w-12" alt="">
    </div>
{/snippet}


