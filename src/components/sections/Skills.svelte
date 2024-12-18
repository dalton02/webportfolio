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
            buttons:["Criação","Ferramentas","Estrangeiras"],
            aboutEach:[
            `Na busca por desenvolver sistemas eficientes, não só da linguagem e do framework á de se prover qualidade de software,
            com isso em mente, em todos os projetos sigo as boas práticas de desenvolvimento e padrões de arquitetura que trazem estabilidade,
            rápido desenvolvimento e de facil manutenção. Alguns dos quais utilizo com frequência e já tive o prazer de fazer uma leitura aprofundada sobre:`
            ,
            `Uma parte mais curiosa sobre quais ferramentas eu utilizo,seja de teste ou de terceiros, para testes no backend principalmente usando typescript
            ,utilizo do vitest para as aplicações frontend, quanto ao backend gosto do pacote utilitario da linguagem Golang (a favorita do autor), em meus 
            projetos typescript utilizo o bom e velho jester.`
            ,
            `Desde criança sempre estudei e pratiquei a conversação do meu inglês, ultimamente tenho lido o livro "Italiano para Leigos" e ando
            pondo em práticas conversações rotineiras e simples para aprimorar meu vocabulario, por hora está indo bem`]
          };
        case "EN-US":
          return {
            buttons:["Creation","WorkTools","Foreign Languages"],
            aboutEach:[`In the quest to develop efficient systems, it's not just about the language and framework, it's about providing software quality,
            With this in mind, in all projects I follow good development practices and architecture patterns that bring stability,
            rapid development and easy maintenance. Some of these I use frequently and have had the pleasure of reading about in depth:`,
            `I'm more curious about which tools I use, whether testing or third-party, for backend testing mainly using typescript
            I use vitest for frontend applications, for the backend I like the Golang language utility package (the author's favorite), for my 
            typescript projects I use the good old jester.`,
            `Since I was a child I've always studied and practiced conversational English. Lately I've been reading the book “Italian for Dummies” and I've been
            practicing routine and simple conversations to improve my vocabulary.`]
          };
        case "IT-IT":
          return {
            buttons:["Creation","WorkTools","Foreign Languages"],
            aboutEach:["","",""]
          }
      }
    })
</script>



<WrapperDefault bind:container={containerDiv} className="mt-12"> 
    <Titulo titulo={tituloLang}/>

    <div class="flex justify-start items-center flex-col">
    <div class="flex  gap-4 justify-center mb-12 flex-wrap">
        {#each text.buttons as op,index}
            {@render botao(op,index)}
        {/each}
    </div>    
    <div class="flex gap-6 w-[80%] xl:w-[60%] justify-center  flex-wrap {estado===2 ? "flex-col" : ""}">
        {#if estado===0}
            {#each infoPortfolio.programming as programa,i (i)}
                    {@render item(programa,i)}
            {/each}
            
        {:else if estado===1}
                {#each infoPortfolio.tools as programa,i (i)}
                    {@render item(programa,i)}
                {/each}
        {:else}

                {#each infoPortfolio.countrys as pais,i (i)}
                    {@render itemLanguage(pais,i)}
                {/each}
        {/if}
    </div>
    {#key estado}
    <div class="flex flex-col text-white duration-500 ease-out justify-center text-center items-center  mt-12 lg:px-56 text-[12px] xl:text-[16px] 
    {viewText ? "" : "translate-x-[-50%]"}"
    in:slide={{duration:1000}}
    use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    oninview_change={(event) => {
        const { inView, entry, scrollDirection, observer, node} = event.detail;
        viewText = inView;
    }}>

            {text.aboutEach[estado]}        
            
            {#if estado===0}
                <ul class="list-item list-disc my-3 text-left">
                    <li>
                        DDD(Domain Drive Design)
                    </li>

                    <li>
                        Hexagonal Architeture
                    </li>
                    <li>
                        Clean Architeture
                    </li>
                </ul> 
            {/if}

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
    use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    oninview_change={(event) => {
        const { inView, entry, scrollDirection, observer, node} = event.detail;
        blockView[i] = inView;
    }}
    >
        <img src="{base}/icons/{item}-plain.svg" title={item} class="w-9 xl:w-12" alt="">
    </div>
{/snippet}



{#snippet itemLanguage(pais,i)}
<!-- svelte-ignore event_directive_deprecated -->
    <div class="flex justify-center items-center p-2 px-4
    duration-300 ease-out hover:rounded-md gap-5 w-full
    {blockView[i] ? "scale-100" : "scale-[0.1]"}" 
    use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    oninview_change={(event) => {
        const { inView, entry, scrollDirection, observer, node} = event.detail;
        blockView[i] = inView;
    }}
    >
        <img src="{base}/icons/{pais.icon}.svg" title={pais} class="w-12" alt="">
        <div class="flex flex-col text-white text-[14px] gap-1 -translate-y-1 w-full">
            {pais.status}
            <div class="flex h-[10px] w-full rounded-2xl bg-yellow-50 relative overflow-hidden">
                <div class="bg-blue-700"  style="width:{pais.value}%;"></div>
            </div>

        </div>
    </div>
{/snippet}