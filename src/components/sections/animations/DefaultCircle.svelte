<script>
  import HabilityButton from "$components/icons/HabilityButton.svelte";
import { isCursor } from "$stores/store";
  import { getCenter } from "$utils/utils";
    import { onMount } from "svelte";
  
    let circulo = $state();
    let myComponent  = $state([]);

    let isVisible = $state([]);
  /**
   * @typedef {Object} Props
   * @property {any} components
   * @property {number} [width]
   * @property {number} [spacing]
   * @property {number} [currentIndex]
   * @property {any} [componentSelected]
   */

  /** @type {Props} */
  let {
    components,
    width = 180,
    spacing = 550,
    currentIndex = $bindable(0),
    componentSelected = $bindable(components[0])
  } = $props();
    

    const gap = 20;

    onMount(()=>{

         mountCircle();
        
         //Ative o observer para uma array de container
        const observer = new IntersectionObserver((entries,index) => {entries.forEach((entry) => {
            const index = myComponent.indexOf(entry.target); // Encontra o índice do elemento observado
            if (index !== -1) isVisible[index] = entry.isIntersecting;
            
        });
        },
        { threshold: 0 } 
        );
        
        myComponent.forEach((element) => {
        observer.observe(element);
        });
        
        return () => {
          myComponent.forEach((element) => {
            observer.unobserve(element);
          });
        }

    })


    function mountCircle(){
        let currentAngulo=0;
        let angulo = 360/myComponent.length
        const circuloInfo = circulo.getBoundingClientRect();
    
        for(let i in myComponent){
            let radian = currentAngulo * (Math.PI / 180);
            let xPos = (circuloInfo.width / 2) + ((circuloInfo.width / 2) * Math.cos(radian)) - width/2;
            let yPos = (circuloInfo.height / 2) + ((circuloInfo.height / 2) * Math.sin(radian)) - width/2;
            myComponent[i].anguloAtual = currentAngulo
            myComponent[i].style.left = xPos + "px";
            myComponent[i].style.top = yPos + "px";
            currentAngulo+=angulo;
    
        }
    }

    function move(index){
        currentIndex = index;
        componentSelected = components[index]
        const anguloRetao=0;
        const diferenciar = (360/myComponent.length) * index;
        const gaiato = (anguloRetao+diferenciar)*-1;
        circulo.style.transform = `rotate(${gaiato}deg)`;
        normalizarImagens(index,gaiato)

    }

    function normalizarImagens(index,gaiato){
        for(let i in imagens){
            if(index==i)   imagens[i].style.transform = `rotate(${gaiato*-1}deg)`;
            else    imagens[i].style.transform = `rotate(0deg)`;
    
        }
    }

    let imagens=$state([])
    
</script>
  
  
  <div class="absolute origin-center flex justify-center rounded-full items-center animationDiv" style="width:{spacing}px;height:{spacing}px;" bind:this={circulo}>
  
          {#each components as comp,index}
            <HabilityButton comp={comp.icon} onClick={()=>{move(index)}} bind:containerButton={myComponent[index]} bind:imagemContainer={imagens[index]} width={width} isVisible={isVisible[index]}/>
          {/each}
  </div>
  
 