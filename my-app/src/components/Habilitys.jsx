import styles from './habilitys.module.css';
import {useState,useRef,useEffect} from 'react';
import { useInView, animated } from '@react-spring/web'
import '../CSS/framework.css';
import '../CSS/fonts.css';
import System from '../SVG/system.svg'
import Web from '../SVG/web.svg'
import Terminal from '../SVG/terminal.svg'

//Props: name,size,color

function Habilitys(){
	
    const [item1,springs] = useInView( ()=>({
      config:{
      	duration:400,
      },
      from: {
        opacity: 0,
        y: 100,
        rotate: 75,
        scale:0,
      },
      to: {
        opacity: 1,
        y: 0,
        rotate:0,
        scale:1,
    },
    }),{
      rootMargin: '0% 0%',
    });

    const [item2,springs2] = useInView( ()=>({
       config:{
      	duration:400,
      },
      from: {
        opacity: 0,
        y: 100,
        rotate: 75,
        scale:0,
      },
      to: {
        opacity: 1,
        y: 0,
        rotate:0,
        scale:1,
    },
    }),{
      rootMargin: '0% 0%',
    });

	const [item3,springs3] = useInView( ()=>({
       config:{
      	duration:400,
      },
      from: {
        opacity: 0,
        y: 100,
        rotate: 75,
        scale:0,
      },
      to: {
        opacity: 1,
        y: 0,
        rotate:0,
        scale:1,
    },
    }),{
      rootMargin: '0% 0%',
    });

	const [text1,springsT] = useInView( ()=>({
       config:{
      	duration:400,
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
      rootMargin: '3% 0%',
    });
	const [text2,springsT2] = useInView( ()=>({
       config:{
      	duration:400,
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
      rootMargin: '3% 0%',
    });
	const [text3,springsT3] = useInView( ()=>({
       config:{
      	duration:400,
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
      rootMargin: '3% 0%',
    });


	return (
	<>
	
	<div className={`${styles.box} color2`}>
  
		<div className={`${styles.projectBox}`}>
		 
		 	<animated.div className={`${styles.projectTitle} normalText`} ref={text1} style={springsT}>
		 	<h2  className='subTitle'>WEB Full-Stack</h2>
		 		<span  className='normalText'> 
		 				Dominio na criação de interfaces envolventes e a implementação de lógica de negócios 
            robusta em projetos web. Experiência nas mais recentes tecnologias.
		 		</span>
		 	</animated.div>
		 	
		 	<animated.div className={`${styles.projectImg}`} ref={item1} style={springs}>
		 	<img src={Web}/>
		 	</animated.div>
		
		</div>

		<div className={`${styles.projectBox}`}>
		 
		 	<animated.div className={`${styles.projectTitle} normalText`} ref={text2} style={springsT2}>
		 			 		
			<h2  className='subTitle'>Engenharia de POO</h2>
		 		<span className='normalText'> 
        Experiência com linguagens orientadas a objetos como Java, C#, ou Python, 
        aplicação de princípios SOLID, design patterns, e frameworks como Spring (Java) ou .NET (C#).</span>
		 	</animated.div>
		 	
		 	<animated.div className={`${styles.projectImg}`} ref={item2}  style={springs2}>
		 	<img src={System}/>
		 	</animated.div>
		
		</div>	

		<div className={`${styles.projectBox}`}>
		 
		 	<animated.div className={`${styles.projectTitle} normalText`} ref={text3} style={springsT3}>
		 	
		<h2 className='subTitle'>Sistemas distribuídos</h2>
		 		<span className='normalText'> 
		 				Implementação de sistemas distribuídos escaláveis e tolerantes a falhas, coordenando a 
            comunicação entre microsserviços e garantindo a consistência de dados distribuídos. 
           </span>

		 	</animated.div>
		 	
		 	<animated.div className={`${styles.projectImg}`} ref={item3}  style={springs3}>
		 	<img src={Terminal}/>
		 	</animated.div>
		
		</div>	
	




	</div>

	</>


	);

}




export default Habilitys;