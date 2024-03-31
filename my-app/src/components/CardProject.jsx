import styles from './cardProject.module.css';
import {useState,useRef,useEffect} from 'react';
import { useInView, animated } from '@react-spring/web'
import '../CSS/framework.css';
import '../CSS/fonts.css';
import iconGit from '../SVG/iconGit.svg';

function CardProject(props){

	const [myAnim,inView] = useInView();


    useEffect(() => {
    
    if (inView) {
      myAnim.current.classList.add(`${styles.show}`);
      myAnim.current.classList.remove(`${styles.hidden}`);
      console.log("A");
    } 

    else {
      myAnim.current.classList.add(`${styles.hidden}`);
      myAnim.current.classList.remove(`${styles.show}`);
    }

  	}, [inView]);

	return(

	<div className={`${styles.projectBox}`} ref={myAnim}>
			<div className={`${styles.projectHead}`}>
			<h4>{props.language}</h4>
			</div>

			<div className={`${styles.projectImg}`}>
			<img src={props.img}/>
			<div className={`${styles.borderFake}`}></div>
			</div>
			<div className={`${styles.projectTitle}`}>
				<div className={`${styles.titleLeft}`}>
				<h2>{props.title}</h2>
				<h3>Acesse meu projeto</h3>
				</div>
				
				<div className={`${styles.titleRight}`}>
					<a target="_blank" href={props.link}>Ir para</a>
				</div>
			</div>
	</div>

	);

}

export default CardProject;