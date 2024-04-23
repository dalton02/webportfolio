
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
    WGG='1800px' HGG='700px'
    WG='1400px'  HG='600px'
    WM='1366px'  HM='650px'
    WP='800px' HP='600px'
    WPP='600px'  HPP='600px'
    WXP='400px'  HXP='600px'
    backColor='#fff6ff' backColorAnt='#fff6ff'
    backEndColor='54%'
    >
    <Hero/>
    </Container>


    <Container 
    WGG='1800px' HGG='800px'
    WG='1400px'  HG='800px'
    WM='1366px'  HM='800px'
    WP='800px' HP='1000px'
    WPP='600px'  HPP='900px'
    WXP='400px'  HXP='580px'
    backColor='#1f1926' backColorAnt='#1f1926' backEndColor='54%'
   
    >
    <h1 className="title color2">Especialidades</h1>
    <Languages/>

    </Container>

    <Container 
    WGG='1800px' HGG='700px'
    WG='1400px'  HG='700px'
    WM='1366px'  HM='900px'
    WP='800px' HP='1300px'
    WPP='600px'  HPP='1500px'
    WXP='400px'  HXP='1500px'
    backColor='#1f1926' backColorAnt='#fff6ff' backEndColor='0%'
    >
    
    <h1 className="title color2">Áreas de dominio</h1>
    <Habilitys/>

    </Container>



    <Container 
    WGG='1800px' HGG='700px'
    WG='1400px'  HG='700px'
    WM='1366px'  HM='700px'
    WP='800px' HP='700px'
    WPP='600px'  HPP='700px'
    WPXP='400px'  HXP='700px'
    backColor='#1f1926' backColorAnt='#1f1926' backEndColor='70%'
   
    >
    <h1 className="title color2">Meus projetos </h1>
    <Carrosel/>
    </Container>
    
    </>
  );
}

export default App;
