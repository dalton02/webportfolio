/**
 * Classe utilitária para manipulação e formatação de strings.
 */
class HandleText {

    /**
     * Converte uma string para maiúsculas.
     * 
     * @param {string} str - A string a ser convertida.
     * @returns {string} A string convertida para maiúsculas.
     */
    toUpperCase = (str: string) => {
        return str.toUpperCase();
    };


    /**
     * Converte em uma string de determinado tamanho, e concatena com "..."
     * 
     * @param {string} text - A string a ser convertida.
     * @param {number} max - O tamanho maximo
     * @returns {string} A string convertida.
     */
    cut(text:string,max:number){
        let tmp = text.slice(0,max)
        if(text.length>max){
            tmp = tmp + "..."
        }
        return tmp
    }

    /**
     * Converte uma string para minúsculas.
     * 
     * @param {string} str - A string a ser convertida.
     * @returns {string} A string convertida para minúsculas.
     */
    toLowerCase = (str: string) => {
        return str.toLowerCase();
    };

    /**
     * Capitaliza a primeira letra de cada palavra em uma string.
     * 
     * @param {string} str - A string a ser capitalizada.
     * @returns {string} A string com a primeira letra de cada palavra capitalizada.
     */
    capitalizeWords = (str: string) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    /**
     * Capitaliza apenas a primeira letra de uma frase.
     * 
     * @param {string} str - A frase a ser capitalizada.
     * @returns {string} A frase com a primeira letra capitalizada.
     */
    capitalizeFirstLetter = (str: string) => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    /**
     * Inverte uma string.
     * 
     * @param {string} str - A string a ser invertida.
     * @returns {string} A string invertida.
     */
    reverseString = (str: string) => {
        return str.split('').reverse().join('');
    };

    /**
     * Trunca uma string a um comprimento específico e adiciona reticências se necessário.
     * 
     * @param {string} str - A string a ser truncada.
     * @param {number} length - O comprimento máximo da string truncada.
     * @returns {string} A string truncada com reticências se o comprimento original for maior que o especificado.
     */
    truncateString = (str: string, length: number) => {
        if (str.length <= length) return str;
        return str.slice(0, length) + '...';
    };

    /**
     * Remove espaços extras de uma string.
     * 
     * @param {string} str - A string da qual os espaços extras serão removidos.
     * @returns {string} A string com espaços extras removidos.
     */
    removeExtraSpaces = (str: string) => {
        return str.trim().replace(/\s+/g, ' ');
    };

    /**
     * Substitui todas as ocorrências de uma substring por outra em uma string.
     * 
     * @param {string} str - A string original.
     * @param {string} search - A substring a ser substituída.
     * @param {string} replacement - A substring de substituição.
     * @returns {string} A string com todas as ocorrências da substring substituídas.
     */
    replaceAll = (str: string, search: string, replacement: string) => {
        return str.split(search).join(replacement);
    };

    /**
     * Conta o número de palavras em uma string.
     * 
     * @param {string} str - A string na qual o número de palavras será contado.
     * @returns {number} O número de palavras na string.
     */
    wordCount = (str: string) => {
        return str.trim().split(/\s+/).length;
    };
}

const handleText = new HandleText();
export default handleText;