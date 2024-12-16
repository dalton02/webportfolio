import CryptoJS from 'crypto-js';

import { PUBLIC_SECRET_KEY } from "$env/static/public";
import { consoleDev } from '$lib/functions/utils';

class StorageService {
  private secretKey: string;

  /**
   * Construtor da classe StorageService
   * @param secretKey - Chave secreta utilizada para criptografar e descriptografar os dados
   */
  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  /**
   * Criptografa os dados utilizando AES.
   * @param data - Os dados que serão criptografados.
   * @returns A string criptografada dos dados.
   */
  private encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  }

  /**
   * Descriptografa os dados utilizando AES.
   * @param ciphertext - A string criptografada.
   * @returns Os dados descriptografados.
   */
  private decryptData(ciphertext: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  /**
   * Armazena dados criptografados no localStorage.
   * @param key - A chave sob a qual os dados serão armazenados.
   * @param dataToStore - Os dados a serem armazenados.
   * @returns Retorna true se os dados forem armazenados com sucesso, false em caso de erro.
   */
  public storeData(key: string, dataToStore: any): boolean {
    try {
      const encryptedData = this.encryptData(dataToStore);
      localStorage.setItem(key, encryptedData);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Recupera e descriptografa os dados armazenados no localStorage.
   * @param dataToRecover - A chave para recuperar os dados armazenados.
   * @returns Retorna os dados descriptografados ou null em caso de erro ou se os dados não existirem.
   */
  public getStoredData(dataToRecover: string): any | null {
    try {
      let decryptedData: any = null;
      const storedData = localStorage.getItem(dataToRecover);
      if (storedData) decryptedData = this.decryptData(storedData);
      return decryptedData;
    } catch (error) {
      consoleDev(error);
      return null;
    }
  }
}

const storageService = new StorageService(PUBLIC_SECRET_KEY);
export default storageService;

