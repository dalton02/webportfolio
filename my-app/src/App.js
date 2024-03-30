
import './CSS/framework.css'; 
import './App.css'; 
import './CSS/fonts.css'; 
import { useInView, animated } from '@react-spring/web'
import iconGit from './SVG/iconGit.svg';
import iconInsta from './SVG/iconInsta.svg';
import iconLinkedin from './SVG/iconLinkedin.svg';
import React, { useState, useEffect, useRef } from 'react';
import Me from './IMG/me.png';
import FieldAsteroid from './components/FieldAsteroid.jsx';
import Carrosel from './components/Carrosel.jsx';
import Habilitys from './components/Habilitys.jsx';
import Languages from './components/Languages.jsx';
import Hero from './components/Hero.jsx';
import Container from './components/Container.jsx';

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
    
    <Container 
    WGG='1800px' HGG='700px'
    WG='1400px'  HG='600px'
    WM='1200px'  HM='700px'
    WP='800px' HP='500px'
    WPP='400px'  HPP='400px'
    backColor='#fff6ff' backColorAnt='#fff6ff'
    backEndColor='54%'
    >
    <Hero/>
    </Container>


    <Container 
    WGG='1800px' HGG='700px'
    WG='1400px'  HG='600px'
    WM='1200px'  HM='600px'
    WP='800px' HP='1200px'
    WPP='400px'  HPP='800px'
    backColor='#1f1926' backColorAnt='#fff6ff' backEndColor='0%'
    >
    <h1 className="title color2">O que ofereço?</h1>
    <Habilitys/>
    </Container>


    <Container 
    WGG='1800px' HGG='900px'
    WG='1400px'  HG='800px'
    WM='1200px'  HM='800px'
    WP='800px' HP='1200px'
    WPP='400px'  HPP='600px'
    backColor='#1f1926' backColorAnt='#1f1926' backEndColor='54%'
   
    >
    <h1 className="title color2">Linguagens utilizadas</h1>
    <Languages/>
    </Container>

    <Container 
    WGG='1800px' HGG='900px'
    WG='1400px'  HG='800px'
    WM='1200px'  HM='700px'
    WP='800px' HP='1200px'
    WPP='400px'  HPP='600px'
    backColor='#4b4453' backColorAnt='#1f1926' backEndColor='70%'
   
    >
    <h1 className="title color2">Meus projetos</h1>
    <Carrosel/>
    </Container>


    </div>
    </>
  );
}

export default App;
