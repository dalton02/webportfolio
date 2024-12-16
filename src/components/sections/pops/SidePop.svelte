<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
    let isVisible=$state(true);
    export async function pop(){
        isVisible=true;
    }
    export async function drop(){
        isVisible=false;
    }

</script>

<div class="w-screen flex justify-start items-center h-screen top-0 left-0 fixed">
    <div class="rounded-xl text-[rgb(26, 26, 26)] flex flex-col items-center gap-2 justify-center p-6 px-12 bg-[#F2F2F2] {isVisible ? "translate-y-0" : "translate-y-[50vw]" }" class:popAnim={isVisible}>
        {@render children?.()}
    </div>
</div>

<style>
    .container{
        width: 100vw;
        height: 100vh;
        top:0;
        left: 0;
        position: fixed;
        display: flex;
        visibility: hidden;
        justify-content: center;
        align-items: center;
        z-index: 9999999;
        background-color: rgba(0,0,0,0);
        padding: 0 16px;
    }
    .pop{
        border-radius: 24px;
        color: #F2F2F2;
        background: #030A05;
        padding: 40px;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        gap:24px;
        transform: translateY(300%);
    }
    .visible{
        visibility:visible;
    }
    .popAnim{
        transform: translateY(0); 
    }

    @media (width <= 767px){
        .pop {
            width: 360px;
            padding: 24px 16px 32px 16px;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: 70vh;
        }
        .container{
            align-items: center;
        }
        
        .visible{
            background-color: rgba(0,0,0,.8);
        }

    }   

</style>