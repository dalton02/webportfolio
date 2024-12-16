<script>
  import "../app.css";
  import LayoutToast from "$components/assets/toast/LayoutToast.svelte";
  import Mouse from "$components/elements/window/Mouse.svelte";
  import PopMouse from "$components/sections/pops/PopMouse.svelte";
  import mouseState from "$lib/localData/mouse.svelte";
  import { base } from "$app/paths";
   
</script>

<svelte:head>
  <title>Portfolio</title>
  <link rel="manifest" href="{base}/manifest.json">
</svelte:head>

<div class="fixed flex w-screen justify-center h-screen top-0 left-0 z-50 pointer-events-none">
  <LayoutToast/>
</div>
<PopMouse/>
<div class="relative overflow-x-hidden bg-[#090A15] {mouseState.state.haveCustomCursor ? "cursor-none" : ""}">

  <slot/>
  <Mouse/>
</div>

