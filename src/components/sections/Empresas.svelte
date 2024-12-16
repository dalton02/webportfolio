<script lang="ts">

    import EmpresaBack from "$components/elements/cards/EmpresaBack.svelte";
    import EmpresaCard from "$components/elements/cards/EmpresaCard.svelte";
    import infoPortfolio from "$lib/localData/portifolio.svelte";
  
    let currentCompany=$state(0);
    let containerInfo = $state<any>()

    let { containerDiv = $bindable() } = $props();


    function swip(index:number){
      containerInfo.startEndAnimation(index)
    }

</script>


<div class="flex flex-row np:justify-center np:flex-col relative p-24 min-h-screen np:gap-4 z-40" bind:this={containerDiv}>
    
      <div class="flex justify-center items-center relative w-1/2">
        <EmpresaBack bind:this={containerInfo}/>
      </div>
      <div class="flex gap-8 flex-wrap z-10 w-1/2 np:w-full np:pt-5 np:overflow-x-auto np:flex-nowrap np:justify-start np:pb-5 
      items-center justify-center content-center">
            {#each infoPortfolio.jobs as company,index}
                  <EmpresaCard on:ativado={()=>swip(index)} index={index+1} 
                  ativo={index==currentCompany ? true : false} src={company.icon} companyName={company.name} bgFull="#ED0C32"/>
            {/each}
      </div>

</div>



<style>

*::-webkit-scrollbar {
  height: 6px;
}
*::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: none;
}

*::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #464646;
}

</style>