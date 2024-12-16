<script lang="ts">

    import { onMount } from "svelte";
  
  
    let {src,fill=null,stroke=null,width=null,height=null,cssStyle=""} = $props();

    let svg = $state<string>("");
    let loading = $state<boolean>(true)

    onMount(async()=>{
      loadSrc();
    })

    async function loadSrc(){
          loading=true
          const data = await fetch(src);
          svg = await data.text();
          styleSvg();
          svg = svg.replace(/<svg([^>]*?)>/, `<svg$1 class="${cssStyle}">`);
          loading=false;
      
    }

    function styleSvg(){
      if(fill) svg = svg.replace(/fill="[^"]*"/g, `fill="${fill}"`);
      if(stroke) svg = svg.replace(/stroke="[^"]*"/g, `stroke="${stroke}"`);
      if(width) svg = svg.replace(/width="[^"]*"/g, `width="${width}"`);
      if(height) svg = svg.replace(/height="[^"]*"/g, `height="${height}"`);
    }
 
    $effect(()=>{
      if(svg) {
        if(fill || stroke || width || height)
          styleSvg();
      }
    })
 
    $effect(()=>{
        if(src){
          loadSrc()
        }
    })
      
  
  </script>
  
  {#if !loading}
      {@html svg}
  {/if}
  
  <style>
  
  </style>