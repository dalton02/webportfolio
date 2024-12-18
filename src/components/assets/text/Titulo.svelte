
<script lang="ts">
    import { inview } from "svelte-inview";


    let {titulo} = $props();
    let isView = $state<boolean>(false)
</script>


<h2 class="text-[24px] xl:text-[32px] text-white mb-8 duration-700 ease-in-out {isView ? "" : "translate-x-[50vw]"}"
use:inview={{ unobserveOnEnter: false, rootMargin: '0%' }}
oninview_change={(event) => {
    const { inView, entry, scrollDirection, observer, node} = event.detail;
    isView = inView;
}}>
{titulo}
</h2>