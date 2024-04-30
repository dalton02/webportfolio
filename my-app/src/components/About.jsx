import styles from './about.module.css';
import {useState,useRef,useEffect} from 'react';
import { useInView, animated } from '@react-spring/web'
import '../CSS/framework.css';
import '../CSS/fonts.css';
import Penguin from '../IMG/penguin.png';


function About(){
       
      const [text,springs] = useInView( ()=>({
       config:{
      	duration:600,
      },
      from: {
        opacity: 0,
        x: 200,
      },
      to: {
        opacity: 1,
        x: 0,
    },
    }),{
      rootMargin: '5% 0%',
    });

	return (
	<>
	
	<animated.div className={`${styles.box} color2 normalText`} ref={text} style={springs}>
  <p>Saudações, meu nome é <b>Dalton Gomes Lobato</b>, tenho 21 anos e sou desenvolvedor fullstack, 
  atualmente curso <b>Ciência da Computação</b> na Universidade Federal do Cariri. Tenho como objetivo construir não apenas aplicativos e serviços web, 
  mas trazer uma experiência inesquecivel para o usuário</p>
	<img src={Penguin}/>

	</animated.div>

	</>


	);

}




export default About;