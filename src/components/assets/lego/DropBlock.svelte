<script lang="ts">
    import type { Snippet } from "svelte";
    import { slide } from "svelte/transition";
    
    type Props = {
        isDrop:boolean,
        className:string,
        children:Snippet,
    }

    let {isDrop,className,children}:Props= $props()

</script>


{#if isDrop}
    <div class="{className}" in:slide out:slide>
        {@render children?.()}
    </div>
{/if}