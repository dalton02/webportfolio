<script lang="ts">
  import { base } from "$app/paths";
  import type { Option } from "$lib/types/types";
  import ButtonCursor from "../lego/ButtonCursor.svelte";
  import DropBlock from "../lego/DropBlock.svelte";
  import FocusBlock from "../lego/FocusBlock.svelte";

  type Options = {
    label:string,
    value:string
  }

  let {options,selectedOption = $bindable()}:{options:Options[],selectedOption:Option} = $props()
  
  let isDrop = $state<boolean>()


  function select(op:Option){
    selectedOption = op;
    isDrop=false
  }
  function toggleDrop(){  
    isDrop=!isDrop
  }





</script>

<FocusBlock className="rounded-lg relative" bind:viewObject={isDrop} containersWithinFocus={[]}>

    <ButtonCursor className="flex gap-4 items-center relative w-full p-12 py-1 text-white hover:bg-slate-500 duration-500 ease-in-out rounded-md group" onClick={toggleDrop}>
      {selectedOption ? selectedOption.label : "Selecione"}
      <img src="{base}/icons/icon-btn-notificacao.svg" class="{isDrop ? "rotate-90" : "rotate-[-90deg]"} duration-500" alt="">
    </ButtonCursor>
 
    <DropBlock isDrop={isDrop} className="absolute top-[105%] right-0 w-full max-h-[300px] flex flex-col items-start justify-start bg-white rounded-md shadow-lg border">
            {#each options as op,i}

                      <ButtonCursor className="text-[14px] pl-5 p-3 pr-12 text-left text-black-400 hover:bg-slate-300 w-full duration-300 hover:text-black-500"
                      onClick={()=>select(op)}>
                        {op.label}
                      </ButtonCursor>

            {/each}
    </DropBlock>


</FocusBlock>