import { Query } from "./querys";
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import dev from "../../settings/dev";
import storageService from "$lib/functions/storageService";
import { consoleDev } from "../utils";
import { browser } from "$app/environment";

class Api {

    private readonly URL: string;
   
    private static excludeAuthToken: string[] = [
        "/auth/login",
        "/auth/login-admin",
        "/auth/recuperar-senha",
        "/postagens/listar",
        "/postagens/"
    ];
    
    private tokenRoutes(endpoint:string){
        if(endpoint.includes("postagens/") && endpoint.split("/").length>1){
            return true;
        }
        return false
    }

    private axiosInstance: AxiosInstance;
    
    /**
    * Uma classe utilitária para gerenciar parâmetros de consulta na URL.
    * Fornece métodos para obter, definir e modificar parâmetros de consulta.
    */
    public readonly querys: Query;
    
    constructor(){
        this.URL = dev.keys.backend ? dev.keys.backend : "";
        this.querys  = new Query();
        this.axiosInstance = axios.create({
            baseURL: this.URL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.axiosInstance.interceptors.request.use(
            this.handleRequest,
        );
    }

    
    private handleRequest( config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> {
       
        const endpoint = config.url?.split("?")[0] || "";
        if (Api.excludeAuthToken.some(url => endpoint === url)) {
            return config
        }

        //Para rotas de titulo
        if(endpoint.includes("/postagens/") && endpoint.split("/").length===3){

        }
        else{
            return config   
        }
        if(!browser){
            throw new Error("Componente não renderizado ao lado do cliente para pegar o localstorage")
        }
        
        const token = window.localStorage.getItem("token")
        
        if (!token) {
            throw new Error("Token não encontrado");
        }
    
        config.headers["Authorization"] = `Bearer ${storageService.getStoredData("token")}`;
        return config;
    }
    
    private async makeRequest(method:string,endpoint:string,body?:any,extraHeaders?:Record<string,any>):Promise<[any,any]>{
        try{
            const response = await this.axiosInstance.request({
                method: method,
                url:endpoint,
                data:body,
                headers: extraHeaders ? extraHeaders : {}
            })
            return [response.data,null]
        }
        catch(error){
            // consoleDev(error?.response?.data)
            if(!error?.response){
                return[null,{message:"Servidor fora do ar",error:error}]
            }
            return [null, error?.response?.data];
        }
    }

    /**
     * Envia uma requisição POST para o endpoint especificado com o corpo fornecido.
     * @param {string} endpoint - O endpoint da API para onde a requisição será enviada.
     * @param {any} body - O corpo da requisição POST.
     * @returns {Promise<[any, any]>} Uma promise que resolve para um array com os dados da resposta ou um erro.
     */

    async post(
        endpoint: string,
        body?: Record<string, any>
    ): Promise<[any, any]> {
        
       return this.makeRequest("POST",endpoint,body)
    }

    
    /**
     * Envia uma requisição GET para o endpoint especificado.
     * @param {string} endpoint - O endpoint da API para onde a requisição será enviada.
     * @returns {Promise<[any, any]>} Uma promise que resolve para um array com os dados da resposta ou um erro.
     */
    async get(endpoint: string): Promise<[any, any]> {
       return this.makeRequest("GET",endpoint)
    }

    /**
     * Envia uma requisição PUT para o endpoint especificado com o corpo fornecido.
     * @param {string} endpoint - O endpoint da API para onde a requisição será enviada.
     * @param {any} body - O corpo da requisição PUT.
     * @returns {Promise<[any, any]>} Uma promise que resolve para um array com os dados da resposta ou um erro.
     */
    async put(
        endpoint: string,
        body?: Record<string, any>
    ): Promise<[any, any]> {
        return this.makeRequest("PUT",endpoint,body)
    }

    /**
     * Envia uma requisição DELETE para o endpoint especificado.
     * @param {string} endpoint - O endpoint da API para onde a requisição será enviada.
     * @returns {Promise<[any, any]>} Uma promise que resolve para um array com os dados da resposta ou um erro.
     */
    async delete(endpoint: string): Promise<[any, any]> {
        return this.makeRequest("DELETE",endpoint)
    }

    /**
     * Envia uma requisição PUT do tipo FormData com dados de formulário e arquivos para o endpoint especificado.
     * @param {string} endpoint - O endpoint da API para onde a requisição será enviada.
     * @param {any} body - Os dados do formulário a serem enviados.
     * @returns {Promise<[any, any]>} Uma promise que resolve para um array com os dados da resposta ou um erro.
     */
    async formData(endpoint: string,body: Record<string, any>, method  : string = 'PUT'): Promise<[any, any]> {
        const formData = new FormData();
        for (const key in body) {
            formData.append(key, body[key]);
        }
        return this.makeRequest(method,endpoint,body,{"Content-Type": "multipart/form-data"})
    }

}

const api = new Api();
export default api;