<script lang="ts">
    
    import { browser } from "$app/environment";
    import type { Snippet } from "svelte";
    
    type Props = {
        viewObject:boolean,
        containersWithinFocus:HTMLElement[],
        className:string,
        children:Snippet
    }

    let {viewObject = $bindable(),containersWithinFocus=[],className,children}:Props= $props()

    let container:HTMLDivElement = $state();


    $effect(()=>{
        if(container && viewObject===true){
             container.focus();
        }
    })


    $effect(()=>{
        if(container && containersWithinFocus.length>0 && browser){
            for(let i in containersWithinFocus){
                containersWithinFocus[i].addEventListener("blur",(event)=>lostFocus(event));
            }
        }
    })
    
    function lostFocus(event){        
        const elemento = event.relatedTarget;
        if(!container.contains(elemento)){
            viewObject=false;
        }
        else if(containersWithinFocus.some((obj)=> obj===elemento)){
        }
        else{
            container.focus();
        }
    }


</script>


<div class={className} bind:this={container} onblur={lostFocus} tabindex="-1">
   {@render children?.()}
</div>