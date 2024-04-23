import styles from './cardLanguage.module.css';
import {useState,useRef,useEffect} from 'react';
import { useInView, animated } from '@react-spring/web'
import '../CSS/framework.css';
import '../CSS/fonts.css';

function CardLanguage(props){
	
	const [myAnim,inView] = useInView();


  useEffect(() => {
    /*if (inView) {
      myAnim.current.classList.add(`${styles.show}`);
      myAnim.current.classList.remove(`${styles.hidden}`);
    } else {
      myAnim.current.classList.add(`${styles.hidden}`);
      myAnim.current.classList.remove(`${styles.show}`);
    }
		*/
  	}, [inView]);


	return (
	  <animated.div className={`${styles.imgBox}`} ref={myAnim} style={
	  {'--delay':`${props.delay}`,
		}

		}>
    	
			<img src={props.logo} />
		
    </animated.div> 
	);

}


export default CardLanguage;