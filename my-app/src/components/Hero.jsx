import styles from './hero.module.css';
import {useState,useRef,useEffect} from 'react';
import { useInView, animated } from '@react-spring/web'
import '../CSS/framework.css';
import '../CSS/fonts.css';
import Me from '../IMG/me.png'
import iconGit from '../SVG/iconGit.svg';
import iconInsta from '../SVG/iconInsta.svg';
import iconLinkedin from '../SVG/iconLinkedin.svg';
//Props: name,size,color

function Hero(){
	
    const [minhaFoto,animPhoto] = useInView( ()=>({
      config:{
        duration:280,
        tension:2000,
        friction:2000
      },
      from: {
        scale: 1,
        rotate:-45,
        y: 400,
        x:-200,
      },
      to: {
        scale: 1.4,
        rotate:0,
        y:5,
        x:0
    },
    }),{
      rootMargin: '0% 0%',
    });
     const [icon1,animIcon1] = useInView( ()=>({
      config:{
        duration:200,
      },
      from: {
        scale: 0,
        rotate:-45,
      },
      to: {
        scale: 1,
        rotate:0,
    },
    }),{
      rootMargin: '5% 0%',
    });

     const [icon2,animIcon2] = useInView( ()=>({
      config:{
        duration:200,
      },
      from: {
        scale: 0,
        rotate:-45,
      },
      to: {
        scale: 1,
        rotate:0,
    },
    }),{
      rootMargin: '5% 0%',
    });
     const [icon3,animIcon3] = useInView( ()=>({
      config:{
        duration:200,
      },
      from: {
        scale: 0,
        rotate:-45,
      },
      to: {
        scale: 1,
        rotate:0,
    },
    }),{
      rootMargin: '5% 0%',
    });


	return (
	<>
	 
  <header className={`${styles.containerHeader} flex-row justify-around content-start items-center`}>  
	<div className={`${styles.wrapperHeaderLeft} flex-column justify-center content-center items-center`}>
        <div className={`${styles.wrapperPhoto}`}>
            
            <div className={`${styles.toClip} flex-row justify-center items-end get-full`}>
                
                <animated.img className={`${styles.myPhoto} get-full`} src={Me} alt="Me" 
                ref={minhaFoto} style={animPhoto}/>

                    <div  className={`${styles.myMoldurePhoto} bgC`} ></div>
                
                </div>
            </div>
        <div className={`${styles.myAccounts} normalText flex-row justify-around`}>
            <animated.img src={iconGit} ref={icon1} style={animIcon1}/>
            <animated.img src={iconLinkedin} ref={icon2} style={animIcon2}/>
            <animated.img src={iconInsta} ref={icon3} style={animIcon3}/>
        </div>
        </div>
        <div className={`${styles.divH1} flex-column justify-center items-center content-center`}>
        <div className={`${styles.animationH1} flex-row justify-end items-center content-center`}>
        <h1 className={`${styles.title} title color1 flex-column content-center items-center`} 
        >Dalton Gomes Lobato</h1>
        </div>
        <h2 className={`${styles.subTitle} subTitle`}>Fullstack Developer</h2>
        
        </div>  

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
    </header>
	</>


	);

}




export default Hero;