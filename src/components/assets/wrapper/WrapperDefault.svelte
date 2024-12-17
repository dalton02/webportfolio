
<script lang="ts">

    let {className="",children,container = $bindable()} = $props()

</script>   



<div class="flex flex-col justify-center items-center w-full relative p-8 lg:p-24 h-lvh np:gap-4 {className}"
bind:this={container}>
    {@render children?.()}
</div>