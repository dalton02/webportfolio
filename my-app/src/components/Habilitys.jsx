import styles from './habilitys.module.css';
import {useState,useRef,useEffect} from 'react';
import { useInView, animated } from '@react-spring/web'
import '../CSS/framework.css';
import '../CSS/fonts.css';
import Stonks from '../SVG/stonks.svg'
import Security from '../SVG/security.svg'
import Performance from '../SVG/desempenho.svg'
import Ads from '../SVG/ads.svg'

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
		 	<h2  className='subTitle'>Segurança WEB</h2>
		 		<span  className='normalText'> 
		 				Serviços oferecendo proteção extrema ao servidor contra 
		 				ataques maliciosos e furto de dados
		 		</span>
		 	</animated.div>
		 	
		 	<animated.div className={`${styles.projectImg}`} ref={item1} style={springs}>
		 	<img src={Security}/>
		 	</animated.div>
		
		</div>

		<div className={`${styles.projectBox}`}>
		 
		 	<animated.div className={`${styles.projectTitle} normalText`} ref={text2} style={springsT2}>
		 			 		
			<h2  className='subTitle'>Serviços ADS</h2>
		 		<span className='normalText'> 
		 				Ajudando dar um boost na publicidade de sua webpage, anunciando para as 
		 				midias sociais mais famosas
		 		</span>
		 	</animated.div>
		 	
		 	<animated.div className={`${styles.projectImg}`} ref={item2}  style={springs2}>
		 	<img src={Ads}/>
		 	</animated.div>
		
		</div>	

		<div className={`${styles.projectBox}`}>
		 
		 	<animated.div className={`${styles.projectTitle} normalText`} ref={text3} style={springsT3}>
		 	
		<h2 className='subTitle'>Boost Performance</h2>
		 		<span className='normalText'> 
		 				Com seu servidor escalado você vai esquecer problemas de sobrecarregamento de acessos do usuario
		 		</span>

		 	</animated.div>
		 	
		 	<animated.div className={`${styles.projectImg}`} ref={item3}  style={springs3}>
		 	<img src={Performance}/>
		 	</animated.div>
		
		</div>	
	




	</div>

	</>


	);

}




export default Habilitys;