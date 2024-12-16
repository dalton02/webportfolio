
<script lang="ts">
  import toast from "$lib/functions/toast/Toast.svelte";
  import { fly } from "svelte/transition";
  import SvgIcon from "../media/SvgIcon.svelte";
  import { expoIn, expoOut } from "svelte/easing";

</script>


<div class="fixed pointer-events-none z-50 top-0 left-0 w-screen h-screen p-12 flex flex-col items-center gap-4">
    {#each toast.toast as t}
        <div class="flex flex-row items-center gap-1 text-body-large font-semibold text-[#555] p-5 py-3 rounded-md shadow-lg border border-[rgba(0,0,0,.05)] bg-[#ffffff]"
        in:fly={{ y: 20, duration: 1000,easing:expoOut }}
        out:fly={{ y: -20, duration: 100,easing:expoIn }}>

          {#if t.status==="error"}
            <SvgIcon src="/icons/x2.svg" width="10px" height="10px" fill="red"/>
          {:else if t.status==="sucess"}
            <SvgIcon src="/icons/check.svg" width="15px" height="20px" fill="green"/>
          {/if}

          {@html t.conteudo}
        
        </div> 
     {/each}
</div>
