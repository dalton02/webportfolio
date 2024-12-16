<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { expoOut } from "svelte/easing";
  import { scale } from "svelte/transition";


    type Props = {
        className:string,
        children:Snippet
    }

    let {className,children}:Props = $props()

    let isInView = $state<boolean>(false);
    let container = $state<HTMLDivElement>();

    const intersectionCallback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                isInView=true;
            }
        });
    };


    const options = {
        root: document.querySelector("#scrollArea"),
        rootMargin: "0px",
        threshold:0,
    };

    onMount(()=>{
        const observer = new IntersectionObserver(intersectionCallback, options);
        observer.observe(container)
        return()=>{
            observer.disconnect()
        }
    })

</script>
 <div 
 class="rounded-3xl border shadow-lg  p-4 ease-out duration-500 {isInView ? "" : "scale-[0.2]"} {className}" bind:this={container}>
     {@render children?.()}
 </div>
