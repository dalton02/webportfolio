<script>
    import { quadIn, quadOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";
    
    let { children } = $props();
    let isVisible=$state(false);

    export async function pop(){
        isVisible=true;
    }
    
    export async function drop(){
        isVisible=false;
    }

</script>

{#if isVisible}
<div class="w-screen flex justify-center items-center h-screen top-0 left-0 fixed bg-[rgba(0,0,0,.5)] z-[99999]" in:fade out:fade>
    <div class="rounded-xl text-[rgb(26, 26, 26)] flex flex-col items-center gap-2 z-30 justify-center p-6 px-12 bg-[#F2F2F2]"
    in:fly={{y:1200,duration:700,easing:quadOut}}
    out:fly={{y:3200,duration:700,easing:quadIn}}>
        {@render children?.()}
    </div>
    <button class="absolute top-0 left-0 w-full h-full z-10" onclick={()=>{drop()}}>.</button>
</div>
{/if}