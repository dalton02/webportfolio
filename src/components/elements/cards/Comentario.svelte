<script lang="ts">
    import WrapperShadow from "$components/assets/wrapper/WrapperShadow.svelte";
    import observer from "$lib/functions/observer/Observer.svelte";
    import handleDate from "$lib/functions/sanitizers/time";
    import type { ComentarioType } from "$lib/types/types";
    import { scale, slide } from "svelte/transition";
    import FilhoComentario from "./FilhoComentario.svelte";
    import { backIn, bounceIn, bounceInOut, bounceOut, elasticIn, expoIn, expoInOut, expoOut, quadIn, quadOut } from "svelte/easing";

    type Props = {
        comentario: ComentarioType
        idPost:number;
        key:number;
    }

    let {comentario,idPost,key}:Props = $props()

    let isDrop = $state<boolean>(false)
    let showLimit = $state<number>(2)

    function toggleDrop(){
        isDrop = !isDrop
    }
    function toggleComentar(){
        observer.sendSignal("abrirPopComentario",{
            comentario: comentario,
            idPost: idPost
        })
    }
</script>

{#key key}
    <div class="w-full" in:scale={{duration:600,easing:quadOut}}>
    <WrapperShadow className="flex flex-col gap-3 items-start pl-6 py-4 p-4 bg-white w-full duration-1000 ease-in-out border rounded-3xl shadow-xl">
        <div class="flex items-center gap-2">
            <img src="/images/ator.webp" class="w-8 rounded-full" alt=""/>
            <div class="flex flex-col">
                <span class="text-[12px]">{comentario.autor.nome}</span> 
                <span class="text-[10px]">{handleDate.tempoRelativo(comentario.criadoEm)}</span>
            </div>
        </div>
        <p class="font-normal text-black-200">
            {comentario.conteudo}
        </p>
        <div class="flex justify-between items-center w-full">
            <div class="flex items-center gap-[7px] text-[10px]">
                {comentario.filhos ? comentario.filhos.length : 0}
                <img src="/icons/comentario.svg" class="w-4" alt="">

                {#if comentario.filhos}
                    <button class="flex gap-2 items-center group" onclick={toggleDrop}>
                        <span class="text-[10px] group-hover:underline">{isDrop ? "Esconder respostas" : "Ver respostas"}</span>
                        <img src="/icons/arrow_curvy.svg" class="w-2 group-hover:translate-y-[2px] {isDrop ? "rotate-[90deg]" : ""} duration-500 ease-in-out" alt="">
                    </button>
                {/if}
            </div>  
            <button class="flex gap-2 items-center group" onclick={toggleComentar}>
                <span class="text-[10px] group-hover:underline">Responder</span>
            </button>
        </div>

        {#if isDrop}
            <div class="flex flex-col gap-0 w-full pl-12 mt-2" in:slide={{easing:quadIn,duration:400}} out:slide={{easing:quadOut,duration:400}}>
                {#each comentario.filhos.slice(0,showLimit) as filho,i}
                        <FilhoComentario comentario={filho}/>
                {/each}
            </div>

            <div class="flex justify-end w-full">
                <button class="flex gap-2 items-center group" onclick={()=>{
                    if(showLimit<comentario.filhos.length){
                        showLimit+=10;
                    }
                    else{
                        showLimit=10;
                        isDrop=false;
                    }
                }}>
                    <span class="text-[10px] group-hover:underline">{showLimit<comentario.filhos.length ? "Ver mais" : "Esconder"}</span>
                    <img src="/icons/arrow_curvy.svg" class="w-2 group-hover:translate-y-[2px] duration-500 ease-in-out" alt="">
                </button>
            </div>
        {/if}
    </WrapperShadow>
    </div>
{/key}