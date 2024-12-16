<script lang="ts">
    import ButtonCursor from '$components/assets/lego/ButtonCursor.svelte';
    import LinkCursor from '$components/assets/lego/LinkCursor.svelte';
    import SvgIcon from '$components/assets/media/SvgIcon.svelte';
    import infoPortfolio from '$lib/localData/portifolio.svelte';
  import { onMount } from 'svelte';

    type Props = {
        about:{
            name:string,
            status:string,
            tags:string[],
            features:string[],
            link:string
        }
    }
    let {about}:Props = $props()

    let container = $state<HTMLDivElement>()



</script>

{#snippet tag(label)}
<div class="px-2 py-1 m-0.5 bg-white/10 rounded-full text-xs font-medium text-white/70 shadow-sm 
border border-white/20 transition-all duration-300 hover:bg-white/20">
    {label}
</div>
{/snippet}

{#snippet check(label)}
    <li class="flex items-center">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        class="w-3 h-3 mr-1 text-white/70"
        >
        <path
            d="M5 13l4 4L19 7"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
        ></path>
        </svg>
        <span title="Dark Mode" class="truncate">{label}</span>
    </li>
{/snippet}


<div class="card w-80 h-auto bg-[#35363F] rounded-2xl overflow-hidden relative transition-all duration-300" bind:this={container}>
  <div class="card-content p-4 relative z-10">
    <div class="flex items-center mb-4">
      <div
        class="w-12 h-12 rounded-xl shadow-lg mr-3 border-2 border-white/20 bg-blue-500 flex items-center justify-center text-white font-bold text-[0.6rem] leading-tight"
      >
        <div class="text-center">UI<br />VERSE</div>
      </div>
      <div>
        <h2 title="SuperApp" class="text-lg font-bold text-white/90 truncate">
          {about.name}
        </h2>
        <span
          class="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block bg-green-500/20 text-green-300/90"
        >
            {about.status}
        </span>
      </div>
    </div>

    <div class="mb-4 mt-3">
      <h3 class="text-xs font-semibold text-white/80 mb-2">
        {infoPortfolio.language==="PT-BR" ? "Linguagens" : "Languages"}
      </h3>
      <div class="flex flex-wrap -mx-1">
        {#each about.tags as tag2}
            {@render tag(tag2)}
        {/each}
      </div>
    </div>

    <div class="mb-4 mt-3">
      <h3 class="text-xs font-semibold text-white/80 mb-2">
        {infoPortfolio.language==="PT-BR" ? "Destaques" : "Features"}
      </h3>
      <ul class="text-xs text-white/60 grid grid-cols-1 gap-1">
        {#each about.features as feature}
            {@render check(feature)}
        {/each}
      </ul>
    </div>

    <div class="flex justify-between items-center space-x-2 mt-3">
      <ButtonCursor className="flex-1 bg-white/10 text-white/90 rounded-lg px-3 py-2 text-xs font-medium transition 
      duration-300 ease-in-out hover:bg-white/20 flex items-center justify-center border border-white/20 h-9 max-h-9"
      onClick={()=>{}}>
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          class="h-4 w-4 mr-1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
          ></path>
        </svg>
        Help
      </ButtonCursor>
      <LinkCursor className="flex-1 bg-white/20 text-white rounded-lg px-3 py-2 text-xs font-medium transition duration-300 gap-2
        ease-in-out hover:bg-white/30 flex items-center justify-center h-9 max-h-9"
        href={about.link} target="_blank">
        <SvgIcon src="/icons/git.svg" fill="white" cssStyle="w-5" />
        Github
      </LinkCursor>
    </div>
  </div>
</div>
