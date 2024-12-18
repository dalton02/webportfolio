<script lang="ts">

  import { base } from '$app/paths';
    import ButtonCursor from '$components/assets/lego/ButtonCursor.svelte';
    import LinkCursor from '$components/assets/lego/LinkCursor.svelte';
    import SvgIcon from '$components/assets/media/SvgIcon.svelte';
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
        <SvgIcon src="{base}/icons/git.svg" fill="white" cssStyle="w-5" />
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