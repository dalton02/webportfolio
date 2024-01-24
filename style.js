var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

let spaceX = [];
let spaceY = [];
let quantidadeStars = 200;

var star = [];

calculatePos(spaceX,spaceY);

for(let i=0;i<quantidadeStars;i++){
    star[i] = recreate(height);
}


function loopStar(){
    
    for(let i=0;i<quantidadeStars;i++){    
    
    let y = star[i].style.top;
    let posY = y.replace("px","");
    
    let x = star[i].style.left;
    let posX = x.replace("px","");
    
    let randomSpeedY = (Math.random()*-10)-1;
    let randomSpeedX = (Math.random()*-1);    
    
    star[i].style.top = (posY - randomSpeedY) + "px";
    star[i].style.left = (posX - randomSpeedX)+"px";
    star[i].style.opacity = 0.8;
        
    
    if(posX<0){
        calculatePos(spaceX,spaceY);
        star[i].style.left = spaceX[i];
        star[i].style.top = spaceY[i];
    }
    else if(posY<0){
        calculatePos(spaceX,spaceY);
        star[i].style.left = spaceX[i];
        star[i].style.top = spaceY[i];
    }
    else if(posY>height+100){
        calculatePos(spaceX,spaceY);
        star[i].style.left = spaceX[i];
        star[i].style.top = spaceY[i];
    }
        
            
    }
    
    window.requestAnimationFrame(loopStar);
}
window.requestAnimationFrame(loopStar);

function recreate(height){
var star = document.createElement("div");
star.style.width = 7+"px";
star.style.height = 3.5+"px";
star.style.backgroundColor= "white";
star.style.position = "fixed";
star.style.left = "0px";
star.style.zIndex=-1;
star.style.transform = "rotateZ(90deg)"

star.style.top = (Math.random()*height) +"px";
document.body.appendChild(star);
return star;
}

function calculatePos(spaceX,spaceY){

for(let i=0;i<quantidadeStars;i++)
    spaceX[i] = (Math.random()*( document.body.clientWidth))+ "px";

for(let i=0;i<quantidadeStars;i++)
    spaceY[i] = (Math.random()*10) + "px";
    
    
}
