/**
 * Classe para validação de diferentes tipos de entradas.
 */
class ValidateInputs {
    /**
     * Valida se o número é um CPF ou CNPJ.
     * @param cpf - O número a ser validado, como uma string.
     * @returns Retorna 'CPF' se o número tiver 11 dígitos, 'CNPJ' se tiver 14 dígitos, ou `false` se não corresponder a nenhum dos formatos.
     */
    cpf(cpf: string): 'CPF' | 'CNPJ' | false {
        let doc = cpf.replace(/[^0-9]/g, '');
        return doc.length === 11 ? 'CPF' : doc.length === 14 ? 'CNPJ' : false;
    }

    /**
     * Valida se o e-mail é válido com base em uma expressão regular.
     * @param email - O e-mail a ser validado, como uma string.
     * @returns `true` se o e-mail for válido, `false` caso contrário.
     */
    email(email: string): boolean {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexEmail.test(email);
    }

    /**
     * Valida se uma string possui um comprimento mínimo.
     * @param string - A string a ser validada.
     * @param tamanhoMinimo - O comprimento mínimo desejado.
     * @returns `true` se a string atender ao comprimento mínimo, `false` caso contrário.
     */
    string(string: string, tamanhoMinimo: number): boolean {
        if (string) return string.length >= tamanhoMinimo;
        return false;
    }

    /**
     * Compara duas strings para verificar se são iguais.
     * @param string - A primeira string.
     * @param string2 - A segunda string.
     * @returns `true` se as strings forem iguais, `false` caso contrário.
     */
    stringIgual(string: string, string2: string): boolean {
        return string === string2;
    }

    /**
     * Valida se o número de telefone possui 10 ou 11 dígitos.
     * @param telefone - O número de telefone a ser validado, como uma string.
     * @returns `true` se o telefone tiver 10 ou 11 dígitos, `false` caso contrário.
     */
    telefone(telefone: string): boolean {
        let tel = telefone.replace(/[^0-9]/g,'');
        return tel.length === 10 || tel.length === 11;
    }

    /**
     * Valida se a senha é forte com base em uma expressão regular.
     * Uma senha forte deve conter pelo menos uma letra maiúscula, uma letra minúscula, um dígito, um caractere especial e ter pelo menos 8 caracteres.
     * @param senha - A senha a ser validada, como uma string.
     * @returns `true` se a senha atender aos requisitos de força, `false` caso contrário.
     */
    senhaForte(senha: string): boolean {
        const regexSenhaForte = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
        return regexSenhaForte.test(senha);
    }

    /**
     * Valida se o comprimento do array é pelo menos o tamanho mínimo especificado.
     * @param array - O array a ser validado.
     * @param minimo - O comprimento mínimo desejado.
     * @returns `true` se o array tiver pelo menos o comprimento mínimo, `false` caso contrário.
     */
    tamanhoArray(array: [], minimo: number): boolean {
        return array.length >= minimo;
    }

    /**
     * Valida se o tipo de arquivo é uma imagem válida.
     * Tipos válidos: 'image/png', 'image/jpg', 'image/jpeg', 'image/webp'.
     * @param type - O tipo do arquivo a ser validado.
     * @returns `true` se o tipo for uma imagem válida, `false` caso contrário.
     */
    imagemValida(type: string): boolean {
        return type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg' || type === 'image/webp';
    }
}

const validateInputs = new ValidateInputs();
export default validateInputs;
    