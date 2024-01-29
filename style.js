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
    star[i] = solar(height);
}


function loopStar(){
    
    for(let i=0;i<quantidadeStars;i++){    
    
    let y = star[i].style.top;
    let posY = y.replace("px","");
    
    let x = star[i].style.left;
    let posX = x.replace("px","");
    
    let r = star[i].style.transform;
    let r1 = r.replace("rotateZ(","");
    let r2 = r1.replace("deg)","");
    
    star[i].style.top = (parseInt(posY) + 1) + "px";
    star[i].style.left = (parseInt(posX) + 0)+"px";
    
    star[i].style.transform = "rotateZ("+(parseInt(r2)+1)+"deg)";
    let limit = document.body.clientWidth;
    if(posX>limit){
        calculatePos(spaceX,spaceY);
        star[i].style.left = spaceX[i];
        star[i].style.top = spaceY[i];
        console.log(spaceX[i]);
    }
        
    else if(posY>height){
        calculatePos(spaceX,spaceY);
        star[i].style.left = spaceX[i];
        star[i].style.top = spaceY[i];
    }
        
            
    }
    
    window.requestAnimationFrame(loopStar);
}
window.requestAnimationFrame(loopStar);


function rain(){
    
var star = document.createElement("div");
let randomT = (Math.random()*1.5)+0.5;

star.style.width = randomT+"px";
star.style.height = randomT+70+"px";
    
star.style.backgroundColor= "aqua";
star.style.opacity = (Math.random()*1)+0.9;
star.style.position = "absolute";
star.style.left = Math.random()*document.body.clientWidth+(-200)+"px";
star.style.zIndex=-1;
star.style.top = (Math.random()*height) +"px";
star.style.transform = "rotateZ(-20deg)";
    
document.body.style.position = "relative";
document.body.style.margin = "0";
document.body.appendChild(star);
    
return star;
    
}

function solar(){
var star = document.createElement("div");
let randomT = (Math.random()*2.5)+0.5;
let randomB = (Math.random()*170)+90;
let choose = (Math.random()*100)+0;
    
if(choose>99.4)   {
star.style.width = randomB+"px";
star.style.height = randomB+"px";
}else{
star.style.width = randomT+"px";
star.style.height = randomT+"px";
    
}
    
star.style.backgroundColor= "white";
star.style.opacity = (Math.random()*1)+0.9;
star.style.position = "absolute";
star.style.left = Math.random()*document.body.clientWidth+"px";
star.style.zIndex=-1;
star.style.overflow = "hidden";
star.style.borderRadius = "100%";
star.style.boxShadow = "0px 0px "+(parseInt(star.style.width)*3)+"px "+(parseInt(star.style.width)/7)+"px rgb(243,211,100)";
star.style.top = (Math.random()*height) +"px";
star.style.transform = "rotateZ(90deg)";
    
document.body.style.position = "relative";
document.body.style.margin = "0";
document.body.appendChild(star);
    
return star;
}

function calculatePos(spaceX,spaceY){

for(let i=0;i<quantidadeStars;i++)
    spaceX[i] = (Math.random()*( document.body.clientWidth))+ (-10) + "px";

for(let i=0;i<quantidadeStars;i++)
    spaceY[i] = (Math.random()*50)+40 + "px";
    
    
}
