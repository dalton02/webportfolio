var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

let spaceX = [];
let spaceY = [];
let quantidadeStars = 50;
let quantidadeRains = 5;
let divA = document.getElementById("animation");
divA.style.height = height+"px";

var star = [];
var speed = [];
var speedR = [];
var rain = [];
calculatePos(spaceX,spaceY);


for(let i=0;i<quantidadeStars;i++){
    star[i] = solar(i);
    
}

for(let i=0;i<quantidadeRains;i++){
    rain[i] = rainer();
    speedR[i]= Math.random()*14+10;    
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
    
    star[i].style.top = (parseInt(posY) + speed[i]) + "px";
    star[i].style.left = (parseInt(posX) + 0)+"px";
    
    star[i].style.transform = "rotateZ("+(parseInt(r2)+1)+"deg)";
    let limit = document.body.clientWidth;
    if(posX>limit || posY>height){
        calculatePos(spaceX,spaceY);
        star[i].style.left = spaceX[i] + "px";
        star[i].style.top = spaceY[i] + "px";
    }
            
    }
    
    for(let i=0;i<quantidadeRains;i++){    
    
    let y = rain[i].style.top;
    let posY = y.replace("px","");
    
    let x = rain[i].style.left;
    let posX = x.replace("px","");
    
    rain[i].style.top = (parseInt(posY) + speedR[i]) + "px";
    rain[i].style.left = (parseInt(posX) + speedR[i])+"px";
    
    let limit = document.body.clientWidth;
    
    if(posX>limit || posY>height){
        calculatePos(spaceX,spaceY);
        rain[i].style.left =  -150 + "px";
        rain[i].style.top = Math.random()*height + "px";
    }
            
    }
    
    window.requestAnimationFrame(loopStar);
}
window.requestAnimationFrame(loopStar);


function rainer(){
    
var star = document.createElement("div");
let randomT = (Math.random()*1)+0.5;

star.style.width = randomT+"px";
star.style.height = randomT+70+"px";
    
star.style.backgroundColor= "rgb(245,245,255)";
star.style.opacity = (Math.random()*1)+0.9;
star.style.position = "absolute";
star.style.left = Math.random()*document.body.clientWidth+(-200)+"px";
star.style.zIndex=-1;
star.style.overflow="hidden";
star.style.top = (Math.random()*height) +"px";
star.style.transform = "rotateZ(-43deg)";
//star.style.borderRadius = "100%";
//star.style.boxShadow = "0px 0px "+(parseInt(star.style.width)*3)+"px "+(parseInt(star.style.width)/7)+"px "+star.style.backgroundColor+"";
star.style.filter = "drop-shadow(0px -30px 1px "+star.style.backgroundColor+")";
document.body.style.position = "relative";
document.body.style.margin = "0";
divA.appendChild(star);
    
return star;
    
}

function solar(i){
var star = document.createElement("div");
let randomT = (Math.random()*5.5)+0.5;
let randomB = (Math.random()*300)+170;
let choose = (Math.random()*100)+0;
    
if(choose>99)   {
star.style.width = randomB+"px";
star.style.height = randomB+"px";
star.style.backgroundColor= "rgb(233,246,255)";
speed[i]=1;
}else{

if(randomT<3)
    speed[i]=1;
else
    speed[i]=2;
star.style.width = randomT+"px";
star.style.height = randomT+"px";

star.style.backgroundColor= "white";
}
    
star.style.opacity = (Math.random()*1)+0.9;
star.style.position = "absolute";
star.style.left = Math.random()*document.body.clientWidth+"px";
star.style.zIndex=-1;
star.style.overflow = "hidden";
star.style.borderRadius = "100%";
star.style.boxShadow = "0px 0px "+(parseInt(star.style.width)*3)+"px "+(parseInt(star.style.width)/7)+"px "+star.style.backgroundColor+"";
star.style.top = (Math.random()*height) +"px";
star.style.transform = "rotateZ(90deg)";

divA.appendChild(star);
    
return star;
}

function calculatePos(spaceX,spaceY){

for(let i=0;i<quantidadeStars;i++)
    spaceX[i] = (Math.random()*( document.body.clientWidth))+ (-10);

for(let i=0;i<quantidadeStars;i++)
    spaceY[i] = (Math.random()*-10)+0;
    
    
}
