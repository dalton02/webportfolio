<script lang="ts">
    import { fly } from "svelte/transition";
    import SvgIcon from "../media/SvgIcon.svelte";
    import { expoOut } from "svelte/easing";


    let {value = $bindable(),container = $bindable(),onFocus = $bindable()} = $props()

    let isFocus= $state<boolean>(false)

    function focus(event){
        isFocus=true;
        event.target.focus();
        onFocus();
    }
    function blur(event){
        if(value.length===0){
            isFocus=false
        }
    }

    $effect(()=>{
        if(value.length>0){
            isFocus=true
        }
        else{
            isFocus=false
        }
    })

</script>

<div class="flex gap-1 rounded-md w-full p-2 px-4 relative duration-1000 {isFocus ? "-translate-y-1" : ""} overflow-hidden">
    {#if isFocus}
        <div in:fly={{x:1000,duration:1000,easing:expoOut}}  
        class="h-[1px] w-full bg-black-900 absolute left-0 bottom-0"></div>
    {/if}

    <input type="text" bind:value={value} placeholder="Pesquisa..."  
    class="text-black-200 bg-transparent placeholder:text-black-400 text-[14px] w-full outline-none duration-500"
    bind:this={container} onfocus={focus} onblur={blur}>
   
    <button>
        <SvgIcon src="/icons/search.svg" stroke="rgb(51,51,51)" cssStyle="w-6"/>
    </button>
</div>
