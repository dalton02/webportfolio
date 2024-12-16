<script lang="ts">
  import dev from "$lib/settings/dev";


    let {width,arquivo} = $props()

</script>



<img src={dev.keys.backend+"/resources/avatar/"+arquivo} class="aspect-square overflow-hidden flex-grow-0 flex-shrink-0 rounded-full"  
style="width:{width};height:{width};" alt=""/>