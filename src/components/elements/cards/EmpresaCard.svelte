<script>
  import { base } from "$app/paths";


  import ButtonCursor from "$components/assets/lego/ButtonCursor.svelte";
import { createEventDispatcher, onMount } from "svelte";


  let {
    index,
    src,
    ativo = $bindable(),
    companyName,
    bgFull
  } = $props();
    let isVisible = $state();

    const dispatch = createEventDispatcher();

    function toggleAtivo(){
        ativo=true;
        dispatch("ativado",{companyName});
    }


    onMount(() => {
    const observer = new IntersectionObserver((entries) => {entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
    });
      },
      { threshold: 0.1 } 
    );
    observer.observe(cardContainer);
    
    return () => {
      if (cardContainer) {
        observer.unobserve(cardContainer);
      }
    };
    });

    let cardContainer = $state()
   
</script>

<ButtonCursor onClick={toggleAtivo} className="flex flex-col items-center justify-center flex-shrink-0 
lg:w-[240px] lg:h-[150px] w-[150px] h-[100px] 
rounded-lg  hover:-translate-y-2 hover:rotate-6 {isVisible ? "scale-100 rotate-0" : "scale-0 rotate-45"}" 
style="background:white;transition:all {800+(index*200)}ms" title={companyName}>
    <img class="w-[40px] lg:w-[50px]" src={base+src} alt=""  bind:this={cardContainer} />
</ButtonCursor>



<style>
</style>