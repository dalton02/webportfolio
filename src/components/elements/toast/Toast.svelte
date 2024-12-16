<script lang="ts">
    export let title:string="Toast"
</script>

<div class="flex items-center justify-center p-2 bg-white rounded-3xl customShadow text-black-100">
            {title}
</div>

<style>
    .customShadow{
        box-shadow: 0px 0px 2px 1px black;
    }
</style>
