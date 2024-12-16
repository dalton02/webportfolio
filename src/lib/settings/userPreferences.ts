import { writable } from 'svelte/store';

/**
 * Armazena o tema atual da aplicação.
 * @type {Writable<string>}
 * @default 'dark' - O tema inicial é definido como 'dark'.
 * A função `writable` cria uma store reativa que pode ser lida e atualizada.
 * Exemplos de uso:
 * - Para ler o tema atual: `$theme`
 * - Para mudar o tema: `theme.set('light')`
 */
export const theme = writable('light');