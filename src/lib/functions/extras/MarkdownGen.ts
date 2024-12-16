import type { markdownType } from "$lib/types/types";

class MarkDownGen{

    classMark(mark:markdownType){
        switch(mark.tipo){
            case "paragrafo":
                return "text-[21px] h-[40px] font-medium"
            case "subTitulo":
                return "text-[38px] h-[55px] font-semibold"
        }
    }



    generateSubTitulo(text?:string) : markdownType{
        return {
            conteudo:text ? text : "",
            tipo:"subTitulo",
            placeholder:"Subtitulo"
        }
    }

    generateParagrafo(text?:string) :markdownType{
        return {
            conteudo:text ? text : "",
            tipo:"paragrafo",
            placeholder:"Insira seu texto"
        }
    }
    generateImagem(url?:string):markdownType{
        return{
            conteudo:"https://imgs.search.brave.com/fB8Noo8qJn4bnoa_LemOBmv5aOwwqFSTOUo8SopxHPQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aXN0b2NrcGhvdG8u/Y29tL3Jlc291cmNl/cy9pbWFnZXMvUGhv/dG9GVExQL0JSL0M1/LTcwMHg1MzMtMTQx/MzQ3MzgzNy5qcGc",
            tipo:"imagem",
            placeholder:"Legenda da imagem"
        }
    }

    autoResizeTextArea(event) {
        if (event.target.classList.contains('paragrafo')) {
            event.target.style.height = "40px";  
        } else {
            event.target.style.height = "55px";  
        }
        event.target.style.height = event.target.scrollHeight + 'px';
    }
    toNegrito(conteudo:string,initString:number,endString:number):string{
        const start = conteudo.slice(0, initString);
        const bold = conteudo.slice(initString, endString);
        const end = conteudo.slice(endString);
        return `${start}**${bold}**${end}`;
    }
    toitalico(conteudo:string,initString:number,endString:number):string{
        const start = conteudo.slice(0, initString);
        const italic = conteudo.slice(initString, endString);
        const end = conteudo.slice(endString);
        return `${start}*${italic}*${end}`;
    }

    getNextTextArea(whole: HTMLDivElement, target: HTMLTextAreaElement): HTMLTextAreaElement | null {
        let sibling = target.parentElement;
    
        while (sibling) {
            sibling = sibling.nextSibling as HTMLElement;
            if (sibling && sibling instanceof HTMLElement) {
                if (sibling.classList && sibling.classList.contains('markdownTexto')) {
                    const textAreaGrandchild = sibling.querySelector('textarea');
                    if (textAreaGrandchild) {
                        return textAreaGrandchild as HTMLTextAreaElement;
                    }
                }
            }
        }
    
        return null;
    }
    
    getPreviousTextArea(whole: HTMLDivElement, target: HTMLTextAreaElement): HTMLTextAreaElement | null {
        let sibling = target.parentElement;
    
        while (sibling) {
            sibling = sibling.previousSibling as HTMLElement;
    
            if (sibling && sibling instanceof HTMLElement) {
                if (sibling.classList && sibling.classList.contains('markdownTexto')) {
                    const textAreaGrandchild = sibling.querySelector('textarea');
                    if (textAreaGrandchild) {
                        return textAreaGrandchild as HTMLTextAreaElement;
                    }
                }
            }
        }
    
        return null;
    }
    

}

const markdownGen = new MarkDownGen()
export default markdownGen