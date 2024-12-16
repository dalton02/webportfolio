<script>
    import MediaHandler from "$src/components/ui/media/MediaHandler.svelte";

    async function fileUpload(event){
        console.log(event.detail)
        file = event.detail.imageUrl;
    }

    let file = $state();
</script>
   
{#if file}
<embed src={file}/>
{/if}

<div class="flex flex-col justify-center items-center relative w-96 overflow-hidden border-solid border border-black">
    Insira um arquivo PDF DOCS
    <MediaHandler accept=".doc, .docx, .pdf" getBase64={true} on:fileChangeEvent={fileUpload}/>
</div>

