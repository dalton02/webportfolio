<script lang="ts">
  import { base } from "$app/paths";
  import infoPortfolio from "$lib/localData/portifolio.svelte";
  import { onMount } from "svelte";
  

  const timeout = 300;

  let companyIndex = $state(0);  
  let logoCompany = $state<HTMLDivElement>();    
  let visible=$state(false);
  
  export function startEndAnimation(index:number){
      if(index===companyIndex)  return;
      visible=false;
      setTimeout(() => {
          companyIndex=index;
          visible=true;
      }, timeout); 
  }

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {entries.forEach((entry) => {
        visible = entry.isIntersecting;
    });
      },
      { threshold: 0 } 
    );
    observer.observe(logoCompany);
    
    return () => {
      if (logoCompany) {
        observer.unobserve(logoCompany);
      }
    };
  });

</script>

  <div class="flex flex-col gap-0 justify-center np:w-full items-center duration-300 w-full absolute p-2 lg:p-6 text-[#FEFEFE] 
  {visible ? "scale-100" : "scale-0"}" bind:this={logoCompany} >
          <img class="lg:h-[200px] h-[100px] object-contain" src={infoPortfolio.jobs[companyIndex].icon} alt=""/>
          <h1 class="text-[16px] m-0 mt-6 text-center">{infoPortfolio.jobs[companyIndex].name}</h1>
          <h2 class="text-[12px] text-center">{infoPortfolio.jobs[companyIndex].role}</h2>
          <p class="text-[14px]font-medium mt-3 lg:mt-5 text-center np:text-14"> {infoPortfolio.jobs[companyIndex].about} </p>
  </div>

