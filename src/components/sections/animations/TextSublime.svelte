<script>
    import infoPortfolio from "$lib/localData/portifolio.svelte";
    import { onMount } from "svelte";

    let isVisible = $state();  

    onMount(() => {
    const observer = new IntersectionObserver((entries) => {entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
    });
      },
      { threshold: 0 } 
    );
    observer.observe(container);
    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
    });
    let container = $state();
</script>

<div class="flex justify-center flex-col w-full h-full items-center overflow-hidden" bind:this={container}>
  <h1 class="text-[48px] duration-[1.5s] p-2 w-full text-center textName {isVisible ? "":"translate-x-[100%]"}">Dalton Gomes Lobato</h1>
  <h2 class="text-20 duration-[2s] delay-100 h-full textName {isVisible ? "":"translate-y-[100%]"}">{infoPortfolio.about.role}</h2>
</div>


<style>
  .textName{
    text-shadow:  0px 0px 10px rgba(255,255,255,.2);
  }
</style>