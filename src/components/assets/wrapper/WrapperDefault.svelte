
<script lang="ts">

    let {className="",children,container = $bindable()} = $props()

</script>   



<div class="flex flex-col flex-grow justify-center items-center w-full relative p-4 lg:p-24 lg:min-h-lvh np:gap-4 {className}"
bind:this={container}>
    {@render children?.()}
</div>