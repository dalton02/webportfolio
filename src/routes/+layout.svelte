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
  <!-- Meta tags e ícones específicos para dispositivos Apple -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="Pináculo Digital">
  <link rel="apple-touch-icon" href="{base}/images/icon-192x192.png">
  <link rel="apple-touch-icon" sizes="144x144" href="{base}/images/icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="{base}/images/icon-152x152.png">
  <link rel="apple-touch-icon" sizes="192x192" href="{base}/images/icon-192x192.png">
  <link rel="apple-touch-icon" sizes="512x512" href="{base}/images/icon-512x512.png">
  <!-- Splash screens para diferentes dispositivos Apple -->
  <link href="{base}/images/screenshot-320x480.png" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)" rel="apple-touch-startup-image">
  <link href="{base}/images/screenshot-480x320.png" media="(device-width: 480px) and (device-height: 320px) and (-webkit-device-pixel-ratio: 1)" rel="apple-touch-startup-image">
  <link href="{base}/images/screenshot-720x1280.png" media="(device-width: 720px) and (device-height: 1280px) and (-webkit-device-pixel-ratio: 1)" rel="apple-touch-startup-image">
  <link href="{base}/images/screenshot-1280x720.png" media="(device-width: 1280px) and (device-height: 720px) and (-webkit-device-pixel-ratio: 1)" rel="apple-touch-startup-image">
  <link href="{base}/images/screenshot-1080x1920.png" media="(device-width: 1080px) and (device-height: 1920px) and (-webkit-device-pixel-ratio: 1)" rel="apple-touch-startup-image">

</svelte:head>



<div class="fixed flex w-screen justify-center h-screen top-0 left-0 z-50 pointer-events-none">
  <LayoutToast/>
</div>
<PopMouse/>
<div class="relative bg-[#090A15] {mouseState.state.haveCustomCursor ? "cursor-none" : ""}">

  <slot/>
  <Mouse/>
</div>

