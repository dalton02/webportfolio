<script>
  import mouseState from "$lib/localData/mouse.svelte";

  let svgCursor = $state()
  let rectWidth = $state(50);
  let textX = $state(150);

  $effect(() => {
    rectWidth = (mouseState.state.nameCursor.length*18 > 50) ? mouseState.state.nameCursor.length*18 : 200 ;
    textX = (rectWidth/2)+50
  });

  let x = $state(0),y = $state(0);
  
  function movement(event){
    x = event.clientX;
    y  = event.clientY;
    if(svgCursor){
      svgCursor.style.left = `${x}px`;
      svgCursor.style.top = `${y}px`;
    }
  }



</script>

<svelte:window onmousemove={movement}/>

{#if mouseState.state.haveCustomCursor} 
    <div class="fixed duration-0 transition-none pointer-events-none z-50"  bind:this={svgCursor}>
          <svg width="26" height="26" viewBox="0 0 267 267" class="-translate-x-3" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_21_727)">
            <path d="M266.494 116.459C266.494 116.723 266.488 116.976 266.476 117.251C266.139 123.353 262.002 128.583 256.129 130.297L167.102 156.364L148.235 251.567C147.041 257.581 142.176 262.181 136.112 263.043C130.05 263.901 124.096 260.842 121.28 255.393L1.61701 24.352C-1.17499 18.995 -0.28999 12.438 3.80001 7.97701C7.90101 3.50301 14.35 2.09201 19.946 4.41501L257.601 103.158C263.018 105.398 266.494 110.659 266.494 116.459Z"
             fill="white" stroke="black" stroke-width="8"/>
            </g>
            <defs>
            <clipPath id="clip0_21_727">
            <rect width="266.495" height="266.494" fill="white" transform="matrix(0 -1 1 0 0 266.495)"/>
            </clipPath>
            </defs>
          </svg>
        
          <span class="bg-slate-200 p-1 rounded-xl">
            {mouseState.state.nameCursor}    
          </span>
    </div>
{/if}
