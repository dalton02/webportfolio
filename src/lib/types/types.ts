

export type markdownType={
    conteudo:string,
    tipo:string,
    placeholder:string
}

export type Option = {
    value:any,
    label:string,
}

export type ComentarioType = {
  conteudo:string;
  criadoEm:string;
  id:number;
  filhos: ComentarioType[];
  autor: Usuario;
}
export type Usuario = {
    login: string;
    nome: string;
    contexto: string;
    id: number;
    avatar:string;
  };
  
export type Reacoes = {
  AMEI?: number;
  LIKE?: number;
  ODIEI?: number;
  FOGUINHO?: number;
};

export const ReacoesMock:Reacoes = {
  AMEI:1,
  LIKE:2,
  ODIEI:3,
  FOGUINHO:4,
  
}

export type Postagem = {
  titulo: string;
  tipo: string;
  conteudo: string;
  tags: string[];
  autor: Usuario;
  id: number;
  criado_em:string;
  comentarios: number;
  reacoes: Reacoes;
};
  
export type PostagemCompleta = {
  titulo: string;
  tipo: string;
  conteudo: any[];
  tags: string[];
  autor: Usuario;
  id: number;
  criado_em:string;
  comentarios: ComentarioType[];
  reacoes: Reacoes;
  reacao_autor: string
};
  