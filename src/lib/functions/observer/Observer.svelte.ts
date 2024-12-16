import validateInputs from "../sanitizers/validateFormats";


class Observer{

    signal = $state<{tipo:string,data:any}>({
        tipo:"",
        data:{}
    })


    sendSignal(tipo:string,data?:any){
        this.signal = {
            tipo,
            data
        }
    }

    clearSignal(){
        this.signal = {
            tipo:"",
            data:{}
        }
    }

    getData(){
        return JSON.parse(JSON.stringify(this.signal.data))
    }

}

const observer = new Observer();
export default observer