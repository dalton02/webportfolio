


class MapKeys{

    keys = $state<boolean[]>([])

    constructor(){
        const i = 100;
        const teclas=[]
        for(let j=0;j<i;j++){
          teclas[j]=false
        }
        this.keys = teclas;
    }
    
    onKeyDown(event){
        this.keys[event.keyCode]=true
    }

    onKeyUp(event){
        this.keys[event.keyCode]=false
    }
        
}

const mapKeys = new MapKeys();
export default mapKeys