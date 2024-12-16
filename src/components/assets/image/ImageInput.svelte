<script>
    import MediaHandler from "$src/components/ui/media/MediaHandler.svelte";

    async function fileUpload(event){
        console.log(event.detail)
        icon = event.detail.imageUrl;
    }

    /**
     * @typedef {Object} Props
     * @property {string} [icon]
     */

    /** @type {Props} */
    let { icon = $bindable("/icons/camera.svg") } = $props();
</script>

<div class="flex flex-row justify-center items-center hover:bg-blue-500 hover:bg-opacity-40 duration-500 relative w-12 h-12 rounded-full overflow-hidden">
    <img class="object-cover {icon!="/icons/camera.svg" ? 'w-full' : 'w-3/5'}" src={icon}/>
    <MediaHandler getBase64={true} on:fileChangeEvent={fileUpload}/>
</div>

