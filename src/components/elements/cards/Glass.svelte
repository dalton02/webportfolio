<script>
  import { hexToRgb } from "$utils/utils";

    bg = hexToRgb(bg);
    bg = `rgba(${bg.r},${bg.g},${bg.b}`
  /**
   * @typedef {Object} Props
   * @property {string} [bg]
   * @property {string} [opacity]
   * @property {number} [x]
   * @property {number} [y]
   * @property {number} [scale]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let {
    bg = $bindable("#E9EFFF"),
    opacity = "1",
    x = 0,
    y = 0,
    scale = 1,
    children
  } = $props();

    let container = $state();
    let forceX=$state(0);
    let forceY=$state(0);

    export function runAway(event){ 
        const containerPos = container.getBoundingClientRect();
        const eX = containerPos.left + containerPos.width / 2;
        const eY = containerPos.top + containerPos.height / 2;
        const max= 2030;
        const force = 1000;

        let dX = event.clientX - eX;
        let dY = event.clientY - eY;

        const directionX = dX<0 ? -1 : 1;
        const directionY = dY<0 ? -1 : 1;

        if(directionX==1){

            if(force/dX>=max){
                dX=max;
            }
            else{
                dX = force/dX;
            }
        
        }
        else{
            if(force/dX<=(max*-1)){
                dX=max*-1;
            }
            else{
                dX = force/dX;
            }   
        }

        if(directionY==1){

            if(force/dY>=max){
                dY=max;
            }
            else{
                dY = force/dY;
            }
            
            }
            else{
            if(force/dY<=(max*-1)){
                dY=max*-1;
            }
            else{
                dY = force/dY;
            }   
        }



        dX = dX*-1;      
        dY = dY*-1;
        
        // console.log(dX)

        forceX = dX;
        forceY = dY;
    }   


</script>


<div class="rounded-full origin-center transition-all duration-1000 flex absolute z-0" style="top:{y}%;left:{x}%;transform:translate({forceX}px,{forceY}px) scale({scale}) " bind:this={container}>
    
    <div class="overflow-hidden absolute top-0 left-0 w-full h-full z-0 rounded-xl" 
    style="opacity:{opacity};border: 1px solid {bg};box-shadow: 0px 0px 10px 0px {bg},.4);background:{bg})"></div>
    <div class="z-30 flex-col items-center justify-start w-full  p-1 text-gray-900 font-normal text-[6px] select-none">
        {@render children?.()}    
    </div>
   
</div>
 

<style>


</style>