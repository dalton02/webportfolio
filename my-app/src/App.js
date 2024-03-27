
import './CSS/framework.css'; 
import './App.css'; 
import './Fonts/fonts.css'; 
import FieldAsteroid from './components/FieldAsteroid.jsx';
import Carrosel from './components/Carrosel.jsx';
import iconGit from './SVG/iconGit.svg';
import iconInsta from './SVG/iconInsta.svg';
import iconLinkedin from './SVG/iconLinkedin.svg';
import React, { useState, useEffect, useRef } from 'react';
import Me from './IMG/me.png';


function App() {

    const width = document.body.clientWidth;
    const height = document.body.clientHeight;


    const hero = useRef(null);
    const projects = useRef(null);
    const showcase = useRef(null);

    function goTo(pos){

        console.log(pos);
        if(pos===0)
        hero.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        
        if(pos===1)  
        projects.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        
        if(pos===2)
        showcase.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
    }
  
  return (
    <>

    <div className="general flex-column justify-start items-center content-center">
    
    <ul className="menuStatic flex-column justify-around content-start items-start">
    <li onClick={ () => goTo(0)  }>Begin</li>
    <li onClick={ () => goTo(1)  }>Projects</li>
    <li onClick={ () => goTo(2)  }>About</li>
    </ul>

    <header className="flex-row justify-around content-start items-center containerHeader" ref={hero}>
    
  <div className="wrapperHeaderLeft flex-column justify-center content-center items-center">
  <div className="wrapperPhoto">
    <div className="toClip flex-row justify-center items-end get-full">
   <img className="myPhoto get-full"  src={Me} alt="Me"/>
   <div id="myMoldurePhoto"></div>
    </div>
    </div>
    <div className="myAccounts normalText flex-row justify-around">
    <img src={iconGit}/><img src={iconLinkedin}/><img src={iconInsta}/>
    </div>
    </div>  

    <h1 className="title flex-column justify-center items-center">
    Dalton Gomes Lobato
    </h1>
    

    </header>
  

    <div className="containerBody flex-column justify-center items-center" ref={projects}>
    <div className="containerCarrossel flex-row justify-center items-center">
    <Carrosel/>
    </div>
    </div>

    <div className="containerBody2 flex-column justify-start items-center" ref={showcase}>
    </div>

    
    <footer className="containerFooter flex-column justify-center items-center content-center">
    @powered by React
    </footer>


 <FieldAsteroid/>

    <svg viewport="0 0 1 1">
    <defs>
    <clipPath id="maskPhoto" clipPathUnits="objectBoundingBox"> 
         <path d="M 0.1 0.599
               A 0.4 0.4, 0, 1, 0, 0.9, 0.599 
               A 0.01 1, 0, 1, 0, 0.1, 0.7
               Z"/>  
    </clipPath>
    </defs>
    </svg>
    </div>
    </>
  );
}

export default App;
