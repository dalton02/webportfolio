
import ShortUniqueId from "short-unique-id";

class Toast{

    private uuid = new ShortUniqueId({length:20});
    public toast = $state<{conteudo:any,id:string,status:string}[]>([])

    push(conteudo:string,propriedades?:any){
        const id = this.uuid.rnd();

        if(!propriedades)
            propriedades = {};

        const props = { 
            status: propriedades.status ?? "neutral",
            timeout: propriedades.timeout ?? 2000
        }

        this.toast.push({
            conteudo,
            id,
            status:props.status
        })

        setTimeout(()=>{
            this.remove(id)
        },props.timeout)
    }

    sucess(conteudo:string,propriedades?:any){
        const id = this.uuid.rnd();

        if(!propriedades)
            propriedades = {};

        const props = { 
            status: "sucess",
            timeout: propriedades.timeout ?? 2000
        }

        this.toast.push({
            conteudo,
            id,
            status:props.status
        })

        setTimeout(()=>{
            this.remove(id)
        },props.timeout)
    }

    error(conteudo:string,propriedades?:any){
        const id = this.uuid.rnd();

        if(!propriedades)
            propriedades = {};

        const props = { 
            status: "error",
            timeout: propriedades.timeout ?? 2000
        }

        this.toast.push({
            conteudo,
            id,
            status:props.status
        })

        setTimeout(()=>{
            this.remove(id)
        },props.timeout)
    }
    
    private remove(id:string){
        this.toast = this.toast.filter(item => item.id !== id);
    }


}

const toast = new Toast();
export default toast;
