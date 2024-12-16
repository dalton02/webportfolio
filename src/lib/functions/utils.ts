import { page } from "$app/stores";
import { get } from "svelte/store";

/**
 * Executa uma ação com base na tecla pressionada.
 * 
 * @param {string} key - A tecla que deve ser pressionada para executar a ação.
 * @param {Function} action - A função a ser executada quando a tecla for pressionada.
 * @param {KeyboardEvent} event - O evento de teclado que contém as informações sobre a tecla pressionada.
 */
export function action(key: string, action: () => void, event: KeyboardEvent) {
    if (event.key === key) {
        action();
    }
}

/**
 * Copia o texto fornecido para a área de transferência.
 * 
 * @param {string} text - O texto a ser copiado para a área de transferência.
 */
export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}

/**
 * Exibe mensagens no console apenas em ambiente de desenvolvimento (localhost).
 * 
 * @param {string} text - A mensagem a ser exibida no console.
 */
export function consoleDev(text: string) {
    const url = get(page).url.origin;
    if(url.includes('http://localhost')) console.log(text);
}
