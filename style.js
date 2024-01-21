var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

let spaceX = [];
let spaceY = [];
let quantidadeStars = 80;

var star = [];

calculatePos(spaceX,spaceY);

for(let i=0;i<quantidadeStars;i++){
    star[i] = recreate(height);
    star[i].style.left = spaceX[i];
    star[i].style.top = spaceY[i];
}


function loopStar(){
    
    for(let i=0;i<quantidadeStars;i++){    
    
    let y = star[i].style.top;
    let posY = y.replace("px","");
    
    let x = star[i].style.left;
    let posX = x.replace("px","");
    
    let randomSpeedY = (Math.random()*3)+1;
    let randomSpeedX = (Math.random()*8)+4;    
    
    star[i].style.top = (posY - randomSpeedY) + "px";
    star[i].style.left = (posX - randomSpeedX)+"px";
    star[i].style.opacity = 0.8;
        
    
        
    if(posY<0){
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
star.style.width = 5+"px";
star.style.height = 2+"px";
star.style.backgroundColor= "grey";
star.style.position = "fixed";
star.style.left = "0px";
star.style.zIndex=-1;
star.style.top =  height+"px";
document.body.appendChild(star);
return star;
}

function calculatePos(spaceX,spaceY){

for(let i=0;i<quantidadeStars;i++)
    spaceX[i] = (Math.random()*( document.body.clientWidth)) + (document.body.clientWidth-50) + "px";

for(let i=0;i<quantidadeStars;i++)
    spaceY[i] = (Math.random()*(height)) +50 + "px";
    
    
}
