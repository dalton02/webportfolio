import { defaultStatusError, defaultStatusOk } from "$lib/types/inputs";

class StatusGen{

    generateError(message:string){
        return {
            ...defaultStatusError,
            message
        }
    }

    generateSuccess(message:string){
        return {
            ...defaultStatusOk,
            message
        }
    }

    generateInvalidEmail(){
        return {
            ...defaultStatusError,
            message:"Insira um email valido"
        }
    }
    generateInvalidCpf(){
        return {
            ...defaultStatusError,
            message:"Insira um cpf valido"
        }
    }
    generateInvalidCnpj(){
        return {
            ...defaultStatusError,
            message:"Insira um cnpj valido"
        }
    }


}
const statusGen = new StatusGen();
export default statusGen

