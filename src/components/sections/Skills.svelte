<script lang="ts">
    import { base } from "$app/paths";


    import ButtonCursor from "$components/assets/lego/ButtonCursor.svelte";
    import Titulo from "$components/assets/text/Titulo.svelte";
    import WrapperDefault from "$components/assets/wrapper/WrapperDefault.svelte";
    import infoPortfolio from "$lib/localData/portifolio.svelte";
    import { inview } from "svelte-inview";

    let estado = $state<string>("Criação")
    let {containerDiv = $bindable()} = $props()
    
    let blockView =  $state<boolean[]>([false,false,false,false,false,false])
    $effect(()=>{
        console.log(blockView)
    })
</script>



<WrapperDefault bind:container={containerDiv}>
    <Titulo titulo="Linguagens"/>
    <div class="flex  gap-4 justify-center mb-12">
        {#each ["Criação","Ferramentas","Estrangeira"] as op}
            {@render botao(op)}
        {/each}
    </div>    
    <div class="flex gap-6 w-[40%] justify-center  flex-wrap {estado==="Estrangeira" ? "flex-col" : ""}">
        {#if estado==="Criação"}
            {#each infoPortfolio.programming as programa,i (i)}
                    {@render item(programa,i)}
            {/each}
            
        {:else if estado==="Ferramentas"}
                {#each infoPortfolio.tools as programa,i (i)}
                    {@render item(programa,i)}
                {/each}
        {:else}

                {#each infoPortfolio.countrys as pais,i (i)}
                    {@render itemLanguage(pais,i)}
                {/each}
        {/if}
    </div>

    <div class="flex flex-col text-white  mt-12 px-56">

        {#if estado==="Criação"}
        Procuro eficiência ao desenvolver seu sistema, tenho experiência e especialização como:
        <ul class="list-item list-disc ml-12 my-3">
            <li>
                DDD(Domain Drive Design)
            </li>

            <li>
                Arquitetura Hexagonal
            </li>
            <li>
                Arquitetura Limpa (Clean Architeture)
            </li>
        </ul> 
        Além disso possuo um conjunto de componentes e bibliotecas próprias para agilizar o desenvolvimento tanto para front-end
        como back-end  
        {:else if estado==="Ferramentas"}      
            Das ferramentas utilizadas, focam em testes unitarios e de integração para garantir a qualidade de software.
        {:else}
            Falar algo sobre proeficiencia da lingua depois
        {/if}
    </div>


</WrapperDefault>





{#snippet botao(label)}
    <ButtonCursor className=" font-semibold p-6 py-2 duration-300 ease-in-out rounded-3xl
    {label===estado ? "bg-white text-black-100" : "text-white hover:bg-white hover:text-black-100 "}"
    onClick={()=>{
        if(estado===label)  return
        estado=label
        blockView=[]    
    }}>
        {label}
    </ButtonCursor>      
{/snippet}


{#snippet item(item,i)}
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="flex justify-center items-center p-4 border-2 border-dashed 
    hover:border-transparent hover:bg-white 
    duration-300 ease-out hover:rounded-md 
    {blockView[i] ? "scale-100" : "scale-[0.1]"}" 
    use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    on:change={({ detail }) => {
        blockView[i] = detail.inView;
    }}
    >
        <img src="{base}/icons/{item}-plain.svg" title={item} class="w-12" alt="">
    </div>
{/snippet}



{#snippet itemLanguage(pais,i)}
<!-- svelte-ignore event_directive_deprecated -->
    <div class="flex justify-center items-center p-2 px-4
    duration-300 ease-out hover:rounded-md gap-5 w-full
    {blockView[i] ? "scale-100" : "scale-[0.1]"}" 
    use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    on:change={({ detail }) => {
        blockView[i] = detail.inView;
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