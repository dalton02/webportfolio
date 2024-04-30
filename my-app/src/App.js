
import './CSS/framework.css'; 
import './App.css'; 
import './CSS/fonts.css'; 
import { useInView, animated } from '@react-spring/web'
import iconGit from './SVG/iconGit.svg';
import iconInsta from './SVG/iconInsta.svg';
import iconLinkedin from './SVG/iconLinkedin.svg';
import React, { useState, useEffect, useRef } from 'react';
import Me from './IMG/me.png';
import Carrosel from './components/Carrosel.jsx';
import Habilitys from './components/Habilitys.jsx';
import Languages from './components/Languages.jsx';
import Hero from './components/Hero.jsx';
import Container from './components/Container.jsx';
import About from './components/About.jsx';
function App() {

    
/*
    function goTo(pos){

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
  */
  return (
    <>

    <Container 
    HGG='1000px'
    HG='1000px'
    HM='750px'
    HP='600px'
    HPP='600px'
    HXP='500px'
    backColor='#fff6ff' backColorAnt='#fff6ff'
    backEndColor='54%'
    >
    <Hero/>
    </Container>


    <Container 
    HGG='800px'
    HG= '800px'
    HM='600px'
    HP='600px'
    HPP='450px'
    HXP='450px'
    backColor='#1f1926' backColorAnt='#1f1926' backEndColor='70%'
   
    >
    <h1 className="title color2">Sobre mim</h1>
    <About/>
    </Container>
    
    <Container 
    HGG='1200px'
    HG='1200px'
    HM='950px'
    HP='1000px'
    HPP='700px'
    HXP='700px'
    backColor='#1f1926' backColorAnt='#1f1926' backEndColor='54%'
   
    >
    <h1 className="title color2">Especialidades</h1>
    <Languages/>

    </Container>

    <Container 
    HGG='1000px'
    HG='1000px'
    HM='900px'
    HP='1500px'
    HPP='1500px'
    HXP='1500px'
    backColor='#1f1926' backColorAnt='#fff6ff' backEndColor='0%'
    >
    
    <h1 className="title color2">Áreas de dominio</h1>
    <Habilitys/>

    </Container>



    <Container 
    HGG='1000px'
    HG='1000px'
    HM='850px'
    HP='850px'
    HPP='900px'
    HXP='900px'
    backColor='#1f1926' backColorAnt='#1f1926' backEndColor='70%'
   
    >
    <h1 className="title color2">Meus projetos </h1>
    <Carrosel/>
    </Container>



    </>
  );
}

export default App;
