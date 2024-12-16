<script lang="ts">

    type Props = {
        value:string,
        placeholder:string
    }
    let {value = $bindable(),placeholder="Escreva"}:Props = $props()

</script>


<textarea class="w-full resize-none outline-none bg-none  bg-transparent
rounded-lg p-4 placeholder:text-black-500 h-20 scroll-padrao" 
placeholder={placeholder} bind:value={value}></textarea>