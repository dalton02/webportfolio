<script lang="ts">
  import SelectInfo from "$components/assets/select/SelectInfo.svelte";
  import Titulo from "$components/assets/text/Titulo.svelte";
  import WrapperDefault from "$components/assets/wrapper/WrapperDefault.svelte";
  import { inview } from "svelte-inview";

  let { containerDiv = $bindable() } = $props();
  let isView = $state<boolean>(false)
</script>

<WrapperDefault bind:container={containerDiv}>
  <Titulo titulo="Sobre"/>
  <div class="flex flex-col w-full xl:w-[80%] justify-start items-start">
  <!-- <div class="w-full flex justify-end z-20">
    <SelectInfo bind:selectedOption={selectedOption} options={[{value:"sobre",label:"Sobre"},{value:"conhecimentos",label:"Conhecimentos"}]}/>
  </div> -->
  <div class="w-full rounded-xl flex relative p-5 py-8 xl:p-16 xl:py-12  neon border-2 border-orange-500 duration-700 ease-out
   bg-[rgba(27,32,54,.14)] backdrop-blur-[1px] font-semibold text-gray-50 text-[14px] lg:text-[18px] text-justify
   {isView ? "" : "translate-x-[-50%]"}"
   use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    oninview_change={(event) => {
        const { inView, entry, scrollDirection, observer, node} = event.detail;
        isView = inView;
    }}>

   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin tortor purus platea sit eu id nisi litora libero. Neque vulputate consequat ac amet augue blandit maximus aliquet congue. Pharetra vestibulum posuere ornare faucibus fusce dictumst orci aenean eu facilisis ut volutpat commodo senectus purus himenaeos fames primis convallis nisi.
   <br/>
   <br/>


   Phasellus fermentum malesuada phasellus netus dictum aenean placerat egestas amet. Ornare taciti semper dolor tristique morbi. Sem leo tincidunt aliquet semper eu lectus scelerisque quis. Sagittis vivamus mollis nisi mollis enim fermentum laoreet.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin tortor purus platea sit eu id nisi litora libero. Neque vulputate consequat ac amet augue blandit maximus aliquet congue. Pharetra vestibulum posuere ornare faucibus fusce dictumst orci aenean eu facilisis ut volutpat commodo senectus purus himenaeos fames primis convallis nisi.
    <br/>

   Phasellus fermentum malesuada phasellus netus dictum aenean placerat egestas amet. Ornare taciti semper dolor tristique morbi. Sem leo tincidunt aliquet semper eu lectus scelerisque quis. Sagittis vivamus mollis nisi mollis enim fermentum laoreet.
  </div>
  </div>

</WrapperDefault>


<style>
  .neon{
    box-shadow: 0 0 20px rgba(240, 192, 57, .2);
  }
</style>