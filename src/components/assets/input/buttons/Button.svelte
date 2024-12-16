
<script>
  import { browser } from "$app/environment";
  import mouseState from "$lib/localData/mouse.svelte";
  import { getCurrentCursor } from "$utils/utils";


  let {
    label,
    bg,
    color,
    onClick = () => {}
  } = $props();
</script>

{#if browser}

<button class="rounded-full p-2 px-4 hover:shadow-[rgba(0,0,0,.3)] shadow-xl  
{mouseState.state.haveCustomCursor ? "cursor-none" : ""}" onclick={onClick} 
style="background:{bg};color:{color};cursor:{getCurrentCursor()}">
  {label}
</button>
{/if}