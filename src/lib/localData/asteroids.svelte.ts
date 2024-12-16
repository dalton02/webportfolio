class Asteroids{

    asteroids = $state([]);
    type = $state("")
    list = ["/icons/xicara.svg","","/icons/c++.svg","/icons/linux.svg"]


    constructor(qtd:number){
        for(let i=0;i<qtd;i++){
            const [initX,initY] = this.newPositions();
            const opacity = Math.random()*0.5+0.2;
            this.asteroids.push({
                initX: initX,
                initY: Math.random()*(4000),
                vX: Math.random()*2+1,
                x: initX,
                y:Math.random()*(4000),
                width:Math.random()*5+3,
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


const asteroidsHandle = new Asteroids(100);
export default asteroidsHandle