<script>
  import mouseState from "$lib/localData/mouse.svelte";


  let { info, redirect = () => {} } = $props();
</script>



<button onclick={redirect} class="text-18 relative group {mouseState.state.haveCustomCursor ? "hover:cursor-none" : ""} overflow-hidden">
    {info.label}
    <div class="h-[1px] w-full absolute bottom-0 left-0 bg-white group-hover:scale-x-100 scale-x-0"></div>
</button>