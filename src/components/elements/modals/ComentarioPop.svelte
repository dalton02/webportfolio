<script lang="ts">
    import TextArea from "$components/assets/input/TextArea.svelte";
    import api from "$lib/functions/api/api";
  import observer from "$lib/functions/observer/Observer.svelte";
  import handleDate from "$lib/functions/sanitizers/time";
    import toast from "$lib/functions/toast/Toast.svelte";
    import type { ComentarioType } from "$lib/types/types";
    import PopUp from "./PopUp.svelte";

    let isVisible = $state<boolean>()
    let seuComentario = $state("")
    let comentario = $state<ComentarioType>()
    let idPost = $state<number>();


    $effect(()=>{
        if(observer.signal.tipo==="abrirPopComentario"){
            abrirPop(observer.getData())
        }
    })

    function abrirPop(data){
        comentario= data.comentario ?? null;
        idPost = data.idPost
        isVisible=true;
    }

    async function comentar(){
            if(seuComentario.length===0)
                return;
            const [response,error] = await api.post(`/postagens/${idPost}/comentar`,{
                conteudo: seuComentario,
                parenteId:comentario.id
            });
            if(error){
                return toast.error(error.message)
            }
            const novoComentario  = {
                autor:{
                    nome:"Seu nome",
                    login:"Login",
                    id:2,
                    contexto:""
                },
                conteudo: seuComentario,
                criadoEm: new Date().toISOString(),
                filhos: null,
                id:response.data.id,
            };

            seuComentario="";
            if(comentario!==null){

                observer.sendSignal("enviarComentarioFilho",{
                    comentario: novoComentario,
                    idParente: comentario.id 
                })

            }
            isVisible=false;
    }
</script>


<PopUp bind:isVisible>
    <div class="flex flex-col items-end justify-start w-[500px]">

        {#if comentario}
            <h1 class="text-[20px]  mb-3 font-medium text-black-200 w-full text-left">Responder Comentário</h1>
            <div class="flex flex-col gap-2 w-full bg-gray-200 rounded-lg p-4">
                <div class="flex items-center gap-2 w-full">
                    <img src="/images/ator.webp" class="w-8 rounded-full" alt=""/>
                    <div class="flex flex-col">
                        <span class="text-[12px]">{comentario.autor.nome}</span> 
                        <span class="text-[10px]">{handleDate.tempoRelativo(comentario.criadoEm)}</span>
                    </div>
                </div>
                <p class="font-normal text-black-200">
                    {comentario.conteudo}
                </p>
            </div>
        {/if}
        <TextArea placeholder="Escreva seus pensamentos...." bind:value={seuComentario}/>
        <button class="flex justify-center items-center rounded-lg p-2 border font-medium text-[12px] 
        bg-blue-600 text-white hover:bg-blue-900 duration-500 ease-in-out" onclick={comentar}>
            Comentar
        </button>
    </div>
</PopUp>