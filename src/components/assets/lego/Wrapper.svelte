<script lang="ts">
  import { expoOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  export let header:string;

    let time:number=600
</script>


<div class="flex flex-col w-full">
    {#key header}
        <div class="bg-white h-full flex lg:flex-row flex-col w-full"
        in:fly={{delay:time,duration:time,x:1600,opacity:1, easing:expoOut}}
        out:fly={{duration:time,x:-1600,opacity:1}}>
            <slot/>
        </div>
    {/key}
</div>