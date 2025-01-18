<script>
  import "../app.css";
  import LayoutToast from "$components/assets/toast/LayoutToast.svelte";
  import Mouse from "$components/elements/window/Mouse.svelte";
  import PopMouse from "$components/sections/pops/PopMouse.svelte";
  import mouseState from "$lib/localData/mouse.svelte";
  import { base } from "$app/paths";
  import infoPortfolio from "$lib/localData/portifolio.svelte";
  import { onMount } from "svelte";
  
  onMount(()=>{
    
    console.log(localStorage.getItem("language"))
    if(localStorage.getItem("language")){
      infoPortfolio.language = localStorage.getItem("language")
      return
    }

    let language = document.documentElement.lang;
    if(language==="en"){
      infoPortfolio.language==="EN-US"
    }

  })


</script>

<svelte:head>
  <title>Portfolio</title>
</svelte:head>

<div class="fixed flex w-screen justify-center h-screen top-0 left-0 z-50 pointer-events-none">
  <LayoutToast/>
</div>
<PopMouse/>
<div class="relative overflow-clip max-w-svw bg-[#090A15] {mouseState.state.haveCustomCursor ? "lg:cursor-none" : ""}">
  <slot/>
  <Mouse/>
</div>
