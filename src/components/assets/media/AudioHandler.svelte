
<!-- svelte-ignore a11y-no-static-element-interactions -->

<!-- Como usar -->
<!-- Use esse componente de forma absoluta e defina a div que ele está dentro como relative -->
<!-- Ele vai cobrir todo o conteudo desssa div: Exemplo um botao play de audio, e assim ira realizar todas as operações necessarias -->

<script lang="ts">
    export let sideEffect: () => void = () => {};
    export let url: string = '';
    export let isPlaying: boolean = false;
    export let audio: HTMLAudioElement;
    export let currentTime: number = 0;
    export let duration: number = 0;

    // Função para lidar com a lógica play||pause
    const play = async (): Promise<void> => { 
        sideEffect();
        if (isPlaying) {
            audio.pause();
            audio.currentTime = 0;
            return;
        }
        audio.src = url; 
        await audio.play();
        isPlaying = true;
    }

    // Função para atualizar o progresso (currentTime e duração)
    const updateProgress = (): void => {
        currentTime = audio.currentTime;
        duration = audio.duration;
    }

    // Lidar com o estado de reprodução
    const handlePlay = (): void => {
        isPlaying = true;
    }

    // Lidar com estado de pausa
    const handlePause = (): void => {
        isPlaying = false;
    }
</script>

<button class="container" on:click={play}>
    <audio class="audio" 
        on:play={handlePlay} 
        on:timeupdate={updateProgress}  
        on:pause={handlePause} 
        on:ended={handlePause} 
        bind:this={audio} 
        controls>
    </audio>
</button>


<style>
    .container{
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: all;
        cursor: pointer;
        z-index: 99999999999;
    }
    .audio{
        position: relative;
        cursor: pointer;
        visibility: hidden;
        pointer-events: all;
    }
</style> 