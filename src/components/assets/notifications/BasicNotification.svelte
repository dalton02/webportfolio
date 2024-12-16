<script lang="ts">
    import { fade } from "svelte/transition";

    export let notificationMessages: string[] = [];
    export let triggerType: boolean | string = undefined;

    let trigger: boolean = false;

    let notificationStyle: string = ''
    let message: string = ''
    let notificationIcon: string = ''

    $: trigger = triggerType != undefined ? true : false, showNotification();

    function showNotification(): void {
        if(triggerType != null) {
            trigger = true
            classController()
            setTimeout(()=>{
                triggerType = undefined
                trigger = false
            }, 3000) 
        }
    }

    function classController(): void {
        if(triggerType === true) {
            notificationStyle = 'sucesso'
            notificationIcon = '/icons/sucess-notification.svg'
            message = notificationMessages[0]
        } else if(triggerType === 'pendente') {
            notificationStyle = 'indefinido'
            notificationIcon = '/icons/pending-notification.svg'
            message = notificationMessages[1]
        } else {
            notificationStyle = 'erro'
            notificationIcon = '/icons/error-notification.svg'
            message = notificationMessages[2]
        }
    }
</script>

{#if trigger}
    <div class="alert-message {notificationStyle}" transition:fade={{ duration: 500 }}>
        <img src={notificationIcon} alt="" />
        <p class={notificationStyle}>{message}</p>
    </div>
{/if}

<style>
    .alert-message{
        display: flex;
        align-items: center;
        justify-content: start;
        width: 100%;
        padding: 8px 12px;
        border-radius: 4px;
        gap: 8px;
    }

    .sucesso {
        background-color: #41CC4F;
    }

    .erro {
        background-color: #F64747;
    }

    .indefinido {
        background-color: #4160CC;
    }

    p{
        font-size: 14px;
        font-weight: 500;
        text-align: left;
        color: #FFF;
        pointer-events: none;
    }
    
    p.true{
        animation: slideDown 0.5s ease-out forwards;
    }
    p.false:not(.firstRender){
        animation: slideUp 0.5s ease-out forwards;
        margin-top: var(--mt);
    }
    p.firstRender{
        background-color: transparent;
        margin-top: var(--mt);
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-30%);
        }
        to {
            opacity: 1;
            height: fit-content;
            transform: translateY(0);
        }
    }
    @keyframes slideUp {
        from {
            opacity: 1;
            height: fit-content;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            height: 0;
            transform: translateY(-30%);
        }
    }
</style>