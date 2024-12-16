<script>
  import { onMount } from "svelte";




  /**
   * @typedef {Object} Props
   * @property {any} [languages]
   * @property {number} [width]
   * @property {number} [spacing]
   * @property {number} [currentAngulo]
   * @property {string} [bg]
   */

  /** @type {Props} */
  let {
    languages = ["c++","cS","go","post2"],
    width = 90,
    spacing = 400,
    currentAngulo = $bindable(0),
    bg = "none"
  } = $props();
    let circulo = $state();
    let language = $state([]);

    onMount(()=>{
    
    let angulo = 360/language.length
    const circuloInfo = circulo.getBoundingClientRect();

    for(let i in language){
        let radian = currentAngulo * (Math.PI / 180);
        let xPos = (circuloInfo.width / 2) + ((circuloInfo.width / 2) * Math.cos(radian)) - width/2;
        let yPos = (circuloInfo.height / 2) + ((circuloInfo.height / 2) * Math.sin(radian)) - width/2;
    
        language[i].style.left = xPos + "px";
        language[i].style.top = yPos + "px";
        
        currentAngulo+=angulo;

    } 


    })
    
</script>


<div class="absolute origin-center flex justify-center rounded-full items-center animationDiv" style="background:{bg};width:{spacing}px;height:{spacing}px;" bind:this={circulo}>

        {#each languages as lang,index}
            <div class="flex justify-center items-center rounded-full absolute flex-shrink-" style="width:{width}px;height:{width}px;" bind:this={language[index]}>
                <img class='w-5/6 object-contain' src="/icons/{lang}.svg" alt=""/>
            </div>
        {/each}
</div>

<style>

    .animationDiv{
        animation: rotation2 linear 12s infinite;
    }


    @keyframes rotation2{
        0%{
            transform: rotateZ(0deg);
        }
        100%{
            transform: rotateZ(360deg);
        }
    }
    @keyframes rotation{
        0%{
             transform: translate(0,0)
        }

        25%{
            transform: translate(50%,-150%);
        }
        50%{
            transform: translate(100%,-75%);
        }
        75%{
            transform: translate(50%,0);
        }

    }
</style>