<script lang="ts">

    import { base } from '$app/paths';
    import ButtonCursor from '$components/assets/lego/ButtonCursor.svelte';
    import LinkCursor from '$components/assets/lego/LinkCursor.svelte';

    import infoPortfolio from '$lib/localData/portifolio.svelte';
    import { onMount } from 'svelte';
    import { inview } from 'svelte-inview';

    type Props = {
        about:{
            name:string,
            tags:string[],
            about:string,
            link:string,
            img:string,
        }
    }
    let {about}:Props = $props()

    let container = $state<HTMLDivElement>()
    let isView = $state<boolean>()
    

</script>

<div class="flex flex-col duration-500 ease-in-out w-[300px] lg:w-[500px] rounded-lg bg-[rgba(27,32,54,.3)] backdrop-blur-[1px]  customShadow relative
{isView ? "" : "scale-[.3] opacity-50"}" bind:this={container}
    use:inview={{ unobserveOnEnter: false, rootMargin: '-10%' }}
    oninview_change={(event) => {
        const { inView, entry, scrollDirection, observer, node} = event.detail;
        isView = inView;
    }}>

    <div class="w-full h-[140px] lg:h-[200px] flex-grow-0 group  rounded-t-lg  overflow-hidden">
        <div class="h-full w-full overflow-hidden">
          <img src={about.img} class="w-full group-hover:scale-110 duration-500 border-e-slate-50 object-cover" alt="">
        </div>
        <img src={about.img} 
        class="opacity-0 pointer-events-none duration-100 delay-0 group-hover:delay-1000 group-hover:lg:opacity-100 absolute overflow-hidden 
        rounded-md top-[0%] border left-[70%] object-contain w-[600px]" alt="">
    </div>
    <div class="flex flex-col text-white p-4 text-[14px] mt-2">
      <h3 class="text-[18px]">{about.name}</h3>
      <p>
      {about.about}
      <LinkCursor className="text-teal-300 hover:underline" target="_blank" href={about.link}>
        {infoPortfolio.PTUSAIT("Veja mais","See more","")}
      </LinkCursor>
      </p>
      <div class="flex flex-wrap gap-2 mt-3 items-center">
          
          <b class="text-slate-50 font-semibold w-full lg:w-auto">
            {infoPortfolio.PTUSAIT("Tecnologias:","Tech Stack:","")}
          </b>
          {#each about.tags as tag}
            <div class="border rounded-lg p-1 px-2 text-[12px]">
                {tag}
            </div>
          {/each}
      </div>
    </div>
    <div class="flex justify-end items-center space-x-2 mt-3 p-2">
      <LinkCursor className="w-1/2 bg-white/20 text-white rounded-lg px-3 py-2 text-xs font-medium transition duration-300 gap-2
        ease-in-out hover:bg-white/30 flex items-center justify-center h-9 max-h-9"
        href={about.link} target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="w-5" fill="white" viewBox="0 0 256 256"><path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z"></path></svg>

        Github
      </LinkCursor>
    </div>
</div>
  
<style>
  .customShadow{
    box-shadow: 0px 0px 30px 0px rgba(255,255,255,.04),
    0px 0px 60px 0px rgba(255,255,255,.02),
    0px 0px 1px 1px rgba(255,255,255,.3)
    ;
  }
</style>