<script>
  import { browser } from "$app/environment";
  import Glass from "$components/cards/Glass.svelte";
  import { onMount } from "svelte";

  let funnyCodes = $state([
  "~a~while/a/ ~b~(/b/~d~true/d/~b~)/b/~b~{/b/~c~party/c/~a~()/a/~b~}/b/",
  "~a~for/a/ ~b~(/b/~d~let happiness = 100/d/~b~; happiness > 0; happiness--)/b/~b~{/b/~c~enjoy/c/~a~()/a/~b~}/b/",
  "~a~switch/a/~b~(/b/~d~mood/d/~b~)/b/~b~{/b/~c~case/c/~a~'happy'/a/~b~:~b~ break; ~c~default/c/~b~:~b~ smile;/b/",
  "~a~try/a/~b~{/b/~c~beAwesome/c/~a~()/a/~b~}~b~catch/b/~b~(/b/~d~error/d/~b~)~b~{/b/~c~console.log/c/~a~('Keep trying!')/a/~b~}/b/",
  "~a~do/a/~b~{/b/~c~code/c/~a~()/a/~b~}~b~while/b/~b~(/b/~d~!tired/d/~b~)/b/;",
]);

  function markdownToCode() {
    const mappings = {
      "~a~": "<b class='text-rose-600'>",
      "/a/": "</b>",
      "~b~": "<b class='text-rose-600'>",
      "/b/": "</b>",
      "~c~": "<b class='text-green-600'>",
      "/c/": "</b>",
      "~d~": "<b class='text-blue-600'>",
      "/d/": "</b>",
    };
    for (let i in funnyCodes) {
      for (let key in mappings) {
        funnyCodes[i] = funnyCodes[i].replace(new RegExp(key, 'g'), mappings[key]);
      }
    }
  }

  const normalHeight=170;
    

  let positions = $state([]);
  onMount(()=>{

    const width = window.innerWidth-200;
    const height = window.innerHeight+600;

    for(let i in funnyCodes){
        const tamanho = funnyCodes[i].length;
        let x,y 
        if(i==0){
            x = Math.random()*(tamanho);
            y = Math.random()*(height/funnyCodes.length)+200;
        }
        else{
            x = Math.random()*(tamanho*i)+positions[i-1].x;
            y = Math.random()*((height/funnyCodes.length)*i)+positions[i-1].y;    
        }
        const scale = Math.random()*1+0.5;
        positions.push({x:((x/window.innerWidth)*100),y:((y/window.innerHeight)*100),scale:scale});
    }
    positions=positions
  })


  markdownToCode()


  function passMouseMovement(event){
    for(let i in containersFunny){
      containersFunny[i].runAway(event);
    }
  }

  function parallax(event){
    yLax = window.scrollY/5;
    console.log(yLax)
  }

  let containersFunny=$state([]);
  let xLax=0,yLax=$state(0);
</script>

<svelte:document onmousemove={passMouseMovement} onwheel={parallax}/>
{#if positions.length>0}
<div class="absolute w-full h-full top-0 left-0 duration-750" style="transform: translate({xLax}px,{yLax}px);">
    {#each funnyCodes as funny,index}
        <div class="absolute w-full h-full top-0 left-0 animationGlass">
          <Glass bind:this={containersFunny[index]} scale={positions[index].scale} x={positions[index].x} y={positions[index].y}>
                  {@html (funny)}
          </Glass>
        </div>
    
    {/each}
</div>
{/if}

<style>

  .animationGlass{
    animation: animationGlass 4s infinite linear;
  }
  @keyframes animationGlass{
    0%{
      transform: scale(1);
    }
    50%{
      transform: scale(1.1);
    }
    100%{
      transform: scale(1);
    }
  }
</style>