
<script>
  import { browser } from "$app/environment";
  import mouseState from "$lib/localData/mouse.svelte";


  let {
    label,
    bg,
    color,
    onClick = () => {}
  } = $props();
</script>


<button class="rounded-full p-2 px-4 hover:shadow-[rgba(0,0,0,.3)] shadow-xl
{mouseState.state.haveCustomCursor ? "hover:cursor-none" : ""}" onclick={onClick} 
style="background:{bg};color:{color};">
  {label}
</button>
