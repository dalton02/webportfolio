<script lang="ts">
    import handleDate from "$lib/functions/sanitizers/time";
    import type { ComentarioType } from "$lib/types/types";
  import { expoOut, quadIn, quadOut } from "svelte/easing";
  import { fly, scale, slide } from "svelte/transition";
  
      type Props = {
          comentario: ComentarioType
      }
  
      let {comentario}:Props = $props()
  
  </script>
  
  
<div class="flex flex-col gap-3 items-start pl-6 py-4 p-4 w-full border-b" in:slide={{easing:quadIn,duration:400}} out:slide={{easing:quadOut,duration:400}}>
    <div class="flex items-center gap-2">
        <img src="/images/ator.webp" class="w-8 rounded-full" alt=""/>
        <div class="flex flex-col">
            <span class="text-[12px]">{comentario.autor.nome}</span> 
            <span class="text-[10px]">Em {handleDate.formatISODate(comentario.criadoEm,"dd 'de' MMMM, yyyy")}</span>
        </div>
    </div>
    <p>
        {comentario.conteudo}
    </p>
    
</div>
