<script lang="ts">
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

  <div class="flex flex-col gap-0 justify-center np:w-full items-center duration-300 w-full absolute p-4 np:p-6 text-[#FEFEFE] 
  {visible ? "scale-100" : "scale-0"}" bind:this={logoCompany} >
          <img class="w-[300px] np:w-[180px]" src={infoPortfolio.jobs[companyIndex].icon} alt=""/>
          <h1 class="text-32 m-0 mt-6 np:text-24">{infoPortfolio.jobs[companyIndex].name}</h1>
          <h2 class="text-24 m-0 np:text-18">{infoPortfolio.jobs[companyIndex].role}</h2>
          <p class="text-18 mt-6 text-center np:text-14"> {infoPortfolio.jobs[companyIndex].about} </p>
  </div>

