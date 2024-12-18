import { base } from "$app/paths";

class Asteroids{

    asteroids = $state([]);
    type = $state("")
    list = [base+"/icons/xicara.svg","",base+"/icons/c++.svg",base+"/icons/linux.svg"]


    constructor(qtd:number){
        for(let i=0;i<qtd;i++){
            const [initX,initY] = [Math.random()*(-1000),Math.random()*(8000)];
            const opacity = Math.random()*0.5+0.2;
            this.asteroids.push({
                initX: initX,
                initY: initY,
                vX: Math.random()*5+3,
                x: initX,
                y: initY,
                width:Math.random()*3+1,
                opacity:opacity,
                transition: true
            })
        }
    }

    randomFigure(){
        const old = this.type;
        while(old === this.type){
            this.type = this.list[Math.floor(Math.random() * this.list.length)] ?? this.type;
        }
        console.log(this.type)
    }

    newPositions(){
        const initX = (Math.random()*window.innerWidth) *-1;
        const initY = Math.random()*(document.documentElement.scrollHeight);
        
        return [initX,initY];
      }
      resetPosition(i:number){
        const [initX,initY] = this.newPositions();
        this.asteroids[i].x = initX;
        this.asteroids[i].y = initY;
  }


}


const asteroidsHandle = new Asteroids(110);
export default asteroidsHandle