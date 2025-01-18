
<script lang="ts">

    let {className="",children,container = $bindable()} = $props()

</script>   



<div class="flex flex-col flex-grow justify-center items-center w-full relative p-4 px-6 lg:px-24 lg:p-24 h-lvh np:gap-4 {className}"
bind:this={container}>
    {@render children?.()}
</div>