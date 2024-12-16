

<script lang="ts">
  import asteroidsHandle from "$lib/localData/asteroids.svelte";
  import Asteroids from "$lib/localData/asteroids.svelte";


  animationCycle()
  function animationCycle(){
      const speed = 4;
      for(let i in asteroidsHandle.asteroids){
          asteroidsHandle.asteroids[i].x+=asteroidsHandle.asteroids[i].vX;  
      }
      requestAnimationFrame(animationCycle);
  }

  $effect(()=>{
    for(let i in asteroidsHandle.asteroids){
      if(asteroidsHandle.asteroids[i].x>window.innerWidth){
        asteroidsHandle.resetPosition(parseInt(i) )
      }
    }
  })

</script>


{#each asteroidsHandle.asteroids as asteroid,i}
    <div class="absolute z-20  transition-none" style="opacity:{asteroid.opacity};top:{asteroid.y}px;left:{asteroid.x}px;">

      {#if asteroidsHandle.type ===""}

      <div class="aspect-square rounded-full bg-slate-100 flex-shrink-0 asteroid"
      style="width:{asteroid.width}px;">

      </div>

      {/if}

      {#if asteroidsHandle.type !==""}

        <img class="object-contain w-12" src={asteroidsHandle.type} alt=""/>

      {/if}
    </div>
{/each}
<style>
    .asteroid{
        box-shadow: 0px 0px 10px rgba(255,255,255,.7);
    }
</style>
