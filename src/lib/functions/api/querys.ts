import { goto } from "$app/navigation";

/**
 * Uma classe utilitária para gerenciar parâmetros de consulta na URL.
 * Fornece métodos para obter, definir e modificar parâmetros de consulta.
 */
export class Query {

  /**
   * Recupera todos os parâmetros de consulta da URL atual como um objeto.
   * 
   * @returns {Record<string, string>} Um objeto que representa todos os parâmetros de consulta.
   * Cada chave é o nome de um parâmetro de consulta, e cada valor é o valor correspondente ao parâmetro.
   * Retorna um objeto vazio se executado em um ambiente fora do navegador.
   */
  getQueryParams(): Record<string, string> {
      if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          let params: Record<string, string> = {};
          urlParams.forEach((value, key) => {
              params[key] = value;
          });
          return params;
      } else {
          return {};
      }
  }

  /**
   * Recupera o valor de um parâmetro de consulta específico pelo seu nome.
   * 
   * @param {string} key - O nome do parâmetro de consulta a ser recuperado.
   * @returns {string | null} O valor do parâmetro de consulta, ou null se o parâmetro não existir.
   */
  getQueryKey(key: string): string | null {
      if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          return urlParams.get(key);
      } else {
          return null;
      }
  }

  /**
   * Constrói uma string de consulta com base em um array de nomes de parâmetros de consulta.
   * Opcionalmente, pode iniciar com um valor padrão especificado para o primeiro parâmetro se ele não for contíguo.
   * 
   * @param {string[]} arrayQuerys - Um array de nomes de parâmetros de consulta para incluir na string de consulta.
   * @param {string} defaultNullFirst - O valor padrão para o primeiro parâmetro se ele não for contíguo.
   * @param {boolean} isContiguous - Se os parâmetros de consulta devem ser contíguos ou não.
   * @returns {string} Uma string representando a consulta construída, começando com `?` e unida por `&`.
   */
  searchQuerys(arrayQuerys: string[], defaultNullFirst?: string, isContiguous?: boolean): string {

    if (typeof window == 'undefined') {
      return ""
    }
    const params = new URLSearchParams(window.location.search);
    if (!arrayQuerys) return '';
    let query = '';
    arrayQuerys.forEach((queryKey, index) => {
        const currentQueryValue = params.get(queryKey);
        if(query=='' && currentQueryValue && !isContiguous){
            query += `?${queryKey}=${currentQueryValue ? currentQueryValue : defaultNullFirst}`;
        }else if (currentQueryValue) {
            query += `&${queryKey}=${currentQueryValue}`;
        }
    });

    return query;
  }


    searchInMemoryQuerys(params:any, isContiguous?: boolean){
    let query = '';
    const keys = Object.keys(params)
    keys.forEach((queryKey) => {
        
        const currentQueryValue = params[queryKey];
        if(query=='' && currentQueryValue!==null && currentQueryValue!==undefined && currentQueryValue!=="" && !isContiguous){
            query += `?${queryKey}=${currentQueryValue}`;
        }
        else if (currentQueryValue && currentQueryValue!==null && currentQueryValue!=="") {
            query += `&${queryKey}=${currentQueryValue}`;
        }
    });
  
      return query;
}
  /**
   * Define os parâmetros de consulta especificados e, opcionalmente, recarrega a página para carregar os novos parâmetros.
   * 
   * @param {Array<{ name: string, value: string }>} params - Um array de objetos contendo pares de `name` e `value` para definir como parâmetros de consulta.
   * @param {boolean} forceRefresh - Se verdadeiro, força um recarregamento completo da página para aplicar os novos parâmetros.
   */
  async setParamAndRefresh(params: { name: string, value: string }[], forceRefresh?: boolean): Promise<void> {

    if (typeof window == 'undefined') {
        return
    }
    const urlParams = new URLSearchParams(window.location.search);

      params.forEach(param => {
          if (param.value == null || param.value.length == 0) {
              urlParams.delete(param.name);
          } else if (param.name != null && param.name.length !== 0) {
              urlParams.set(param.name, param.value);
          }
      });

      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      await this.replaceHistory(forceRefresh,newUrl)
    
  }

  /**
   * Limpa todos os parâmetros de consulta da URL atual.
   * 
   * @param {boolean} forceRefresh - Se verdadeiro, força um recarregamento completo da página para aplicar os parâmetros limpos.
   */
  async cleanAllParams(forceRefresh: boolean): Promise<void> {

    if (typeof window == 'undefined') {
        return
    }
      const urlParams = new URLSearchParams(window.location.search);

      urlParams.forEach((value, key) => {
          urlParams.delete(key);
      });

      const newUrl = `${window.location.origin}${window.location.pathname}`;
      await this.replaceHistory(forceRefresh,newUrl)
  }

  private async replaceHistory(forceRefresh:boolean,newUrl:string){
    if (!forceRefresh) {
        const scrollPosition = window.scrollY;
        await goto(newUrl, { replaceState: true }); 
        window.scrollTo(0, scrollPosition);
      } else {
          window.location.href = newUrl;
      }
  }
}
