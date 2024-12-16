<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    interface CustomFile extends File {
        imageUrl?: string;
    }
    
    const dispatch = createEventDispatcher();

    export let accept: string = "image/*";
    export let getBase64: boolean = true;

    let inputImage: HTMLInputElement | null = null;

    function handleFileClick(): void {
        inputImage?.click();
    }

    function handleFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] as CustomFile;

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (getBase64 && e.target) {
                    file.imageUrl = e.target.result as string; 
                }
                dispatch('fileChangeEvent', file);
            };
            reader.readAsDataURL(file);
        }

        input.value = '';
    }

</script>

<button class="flex overflow-hidden absolute w-full h-full top-0 left-0 z-30" on:click={handleFileClick}>
    <input class="hidden" bind:this={inputImage} type="file" accept={accept} on:change={handleFileChange}/>
</button>
