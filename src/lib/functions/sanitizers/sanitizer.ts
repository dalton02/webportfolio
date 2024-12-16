/**
 * Classe para sanitização e formatação de diversos tipos de documentos e números de telefone.
 */
class Sanitizer {
    /**
     * Formata um número de CPF.
     * @param cpf - O número de CPF a ser formatado, como uma string.
     * @returns O número de CPF formatado.
     */
    cpf(cpf: string): string {
        let doc = cpf.replace(/[^0-9]/g, '');
        if (doc.length > 14) {
            doc = doc.substring(0, 14);
        }
        if (doc.length <= 11) {
            doc = doc.replace(/(\d{3})(\d)/, '$1.$2');
            doc = doc.replace(/(\d{3})(\d)/, '$1.$2');
            doc = doc.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else if (doc.length <= 14) {
            doc = doc.replace(/^(\d{2})(\d)/, '$1.$2');
            doc = doc.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            doc = doc.replace(/\.(\d{3})(\d)/, '.$1/$2');
            doc = doc.replace(/(\d{4})(\d)/, '$1-$2');
        }
        return doc;
    }

    /**
     * Formata um número de CNPJ.
     * @param inputValue - O número de CNPJ a ser formatado, como uma string.
     * @returns O número de CNPJ formatado.
     */
    cnpj(inputValue: string): string {
        inputValue = inputValue.replace(/\D/g, '');

        if (inputValue.length > 14) {
            inputValue = inputValue.slice(0, 14);
        }
        if (inputValue.length > 2) {
            inputValue = inputValue.replace(/^(\d{2})(\d)/, '$1.$2');
        }
        if (inputValue.length > 5) {
            inputValue = inputValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        }
        if (inputValue.length > 8) {
            inputValue = inputValue.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
        }
        if (inputValue.length > 12) {
            inputValue = inputValue.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
        }

        return inputValue;
    }

    /**
     * Formata um número de RG (Registro Geral).
     * @param inputValue - O número de RG a ser formatado, como uma string.
     * @returns O número de RG formatado.
     */
    rg(inputValue: string): string {
        inputValue = inputValue.replace(/\D/g, '');

        if (inputValue.length > 10) {
            inputValue = inputValue.slice(0, 10);
        }

        if (inputValue.length > 9) {
            inputValue = inputValue.replace(/^(\d{10})(\d)/, '$1-$2');
        }

        return inputValue;
    }

    /**
     * Formata um número de telefone.
     * @param input - O número de telefone a ser formatado, como uma string.
     * @param countryCode - Um booleano indicando se deve incluir o código do país na formatação.
     * @returns O número de telefone formatado.
     */
    telefone(input: string, countryCode: boolean): string {
        input = input.replace(/[^0-9]/g, '');
        let telefone = input.replace(/\D/g, '');

        telefone = telefone.substring(0, countryCode ? 13 : 11);
        if (telefone.length === 11) {
            telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (telefone.length === 10) {
            telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (telefone.length === 13 && countryCode) {
            telefone = telefone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
        } else {
            return input;
        }
        return telefone;
    }
}

const sanitizar = new Sanitizer();
export default sanitizar;