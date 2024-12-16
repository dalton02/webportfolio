<script>    

    let { value = $bindable("") } = $props();

</script>



<input placeholder="Your name here" 
class="block w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 text-gray-500 focus:text-gray-700" type="text" bind:value={value}/>
