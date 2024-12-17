<script lang="ts">

    import Titulo from "$components/assets/text/Titulo.svelte";
  import WrapperDefault from "$components/assets/wrapper/WrapperDefault.svelte";
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

<WrapperDefault  bind:container={containerDiv}>

  <Titulo titulo="Carreira"/>
  <div class="flex lg:flex-row flex-col justify-start items-center relative p-8 w-full flex-grow lg:p-24 gap-4 ">

    <div class="flex justify-center items-center h-[550px]  relative lg:h-full w-full lg:w-[40vw]">
      <EmpresaBack bind:this={containerInfo}/>
    </div>
    <div class="flex lg:flex-col xl:flex-row lg:justify-center lg:items-center gap-4  overflow-x-auto overflow-y-hidden 
    lg:overflow-visible  lg:h-full lg:w-[40vw] w-full
    p-4 lg:p-0">
          {#each infoPortfolio.jobs as company,index}
                <EmpresaCard on:ativado={()=>swip(index)} index={index+1} 
                ativo={index==currentCompany ? true : false} src={company.icon} companyName={company.name} bgFull="#ED0C32"/>
          {/each}
    </div>

</div>
</WrapperDefault>



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