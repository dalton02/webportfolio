import styles from './hero.module.css';
import {useState,useRef,useEffect} from 'react';
import { useInView, animated } from '@react-spring/web'
import '../CSS/framework.css';
import '../CSS/fonts.css';
import Me from '../IMG/me.webp'
import iconGit from '../SVG/iconGit.svg';
import iconInsta from '../SVG/iconInsta.svg';
import iconCV from '../SVG/iconCV.svg';
import Curriculo from '../PDF/curriculo.pdf';
//Props: name,size,color

function Hero(){
	
    const [minhaFoto,animPhoto] = useInView();

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


  useEffect(() => {
    if (animPhoto) {
      minhaFoto.current.classList.add(`${styles.show}`);
      minhaFoto.current.classList.remove(`${styles.hidden}`);
    } else {
      minhaFoto.current.classList.add(`${styles.hidden}`);
      minhaFoto.current.classList.remove(`${styles.show}`);
    }

    }, [animPhoto]);

	return (
	<>
	 
  <header className={`${styles.containerHeader} flex-row justify-around content-start items-center`}>  
	<div className={`${styles.wrapperHeaderLeft} flex-column justify-center content-center items-center`}>
        <div className={`${styles.wrapperPhoto}`}>
            
            <div className={`${styles.toClip} flex-row justify-center items-end get-full`}>
                
                <animated.img className={`${styles.myPhoto} get-full`} src={Me} alt="Me" 
                ref={minhaFoto}/>

                    <div  className={`${styles.myMoldurePhoto} bgC`} ></div>
                
                </div>
            </div>
        <div className={`${styles.myAccounts} normalText flex-row justify-around`}>
            <a href="https://github.com/dalton02" target="_blank"><animated.img src={iconGit} ref={icon1} style={animIcon1}/></a>
            <a  href={Curriculo} download="curriculo.pdf"><animated.img src={iconCV} ref={icon2} style={animIcon2}/></a>
            <a href="https://www.instagram.com/dalton.gomes___/" target="_blank">
              <animated.img src={iconInsta} ref={icon3} style={animIcon3}/>
            </a>
        </div>
        </div>
        <div className={`${styles.divH1} flex-column justify-center items-center content-center`}>
        <div className={`${styles.animationH1} flex-row justify-end items-center content-center`}>
        <h1 className={`${styles.title} color1 flex-column content-center items-center`} 
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