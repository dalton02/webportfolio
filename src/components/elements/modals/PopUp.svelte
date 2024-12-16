<script lang="ts">
  import type { Snippet } from "svelte";
    import { quadIn, quadOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";

    type Props={
        isVisible:boolean,
        children:Snippet
    }
    let {isVisible = $bindable(),children}:Props = $props();

</script>


{#if isVisible}

    <div class="fixed w-screen h-svh top-0 left-0 bg-[rgba(0,0,0,.2)] flex justify-center items-center z-40"
    in:fade
    out:fade
    
    >

        <div class="flex flex-col justify-start items-start p-6 min-w-[300px]  bg-white rounded-lg z-20"   
        in:fly={{y:3000,opacity:1,duration:600,easing:quadOut}}
        out:fly={{y:3000,opacity:1,duration:600,easing:quadIn}}>
            {@render children?.()}
        </div>
        <button class="absolute top-0 left-0 w-screen h-svh z-10 cursor-default" onclick={()=>isVisible=false}>
            .
        </button>
    </div>


{/if}