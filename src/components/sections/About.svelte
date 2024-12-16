<script>

  import TextSublime from "./animations/TextSublime.svelte";

  let { containerDiv = $bindable() } = $props();

</script>


<div class="relative overflow-hidden left-0 flex items-center justify-center w-full text-white min-h-screen" bind:this={containerDiv}>

    <TextSublime/>

</div>
