<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Option } from "$lib/types/types";
  import DropBlock from "../lego/DropBlock.svelte";
  import FocusBlock from "../lego/FocusBlock.svelte";
  import SvgIcon from "../media/SvgIcon.svelte";

  let isDrop = $state<boolean>(false)

  let options = [
    {
      label:"Perfil",
      function:()=>{goto("/perfil")},
      icon:"/icons/user.svg"
    },
    {
      label:"Salvos",
      function:()=>{},
      icon:"/icons/bookmark.svg"
    },
    {
      label:"Configurações",
      function:()=>{},
    },
    {
      label:"Sobre",
      function:()=>{goto("/sobre")},
    }
  ]

  function toggleDrop(){
    isDrop = !isDrop
  }

</script>



<FocusBlock className="relative" bind:viewObject={isDrop} containersWithinFocus={[]}>

    <button class="rounded-full aspect-square w-12 p-0 overflow-hidden group relative" onclick={toggleDrop}>
        <div class="absolute top-0 left-0 w-full h-full group-hover:bg-[rgba(0,0,0,.1)] duration-300">
        </div>
        <img src="/images/ator.webp"  alt="">
    </button>
    <DropBlock isDrop={isDrop} className="absolute top-[105%] right-0 flex flex-col items-start justify-start bg-white rounded-md shadow-lg border">
            {#each options as op,i}
                    {#if i===2}
                      <div class="h-[1px] my-1 w-full bg-[rgba(0,0,0,.1)]"></div>
                    {/if}
                    {#if op.icon}
                      <button class="text-[14px] pl-5 p-3 pr-12 text-left duration-300 flex items-center justify-start gap-2 hover:text-black-500"
                      onclick={op.function}>
                        <SvgIcon src={op.icon} width="12" cssStyle="w-6"/>
                        {op.label}
                      </button>
                    {:else}
                      <button class="text-[14px] pl-5 p-3 pr-12 text-left duration-300 hover:text-black-500"
                      onclick={op.function}>
                        {op.label}
                      </button>
                    {/if}

            {/each}
    </DropBlock>


</FocusBlock>