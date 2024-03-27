import styles from './carrosel.module.css';
import {useState,useRef,useEffect} from 'react';
import '../CSS/framework.css';

import Phone from '../IMG/phone.png';

//Props: name,size,color

function Carrosel(){
	
	const [obj,setObj] = useState([
	{x: 0},
	{x:50},
	{x:100}
	]);
	
	const [current,setCurrent]= useState(1);
	const [init,setInit] = useState(false);
	
	const addCountHandler = () => {
    if([current] == 3)	return;
		setCurrent(current + 1);
		console.log(current);
	};  

	const removeCountHandler = () => {
    if([current] == 0){
      return;  
    }
    setCurrent(current - 1);

		console.log(current);
	};

	const car = useRef(null);

	useEffect( () =>{

		if(init==false)	{
		setInit(true);
		return;
		}

		const quantidade =115;
		car.current.style.transform = "translateX("+current*quantidade+"%)";
		

		},[current]);



	return (
	<>
	
	<div className={`${styles.arrows} flex-row justify-between items-center `}>
  <i className={styles.arrowLeft} onClick={removeCountHandler} >Back</i>
  <i className={styles.arrowRight} onClick={addCountHandler} >Next</i>
  </div>

  <div className={`${styles.containerProjects} flex-row justify-around items-start get-full`}  ref={car}>
  
  <div className={`${styles.wrapperProject} flex-row justify-center`} styles={{
  }}>

  <div className={`${styles.divTitle} flex-column`}>
  <h1 className={`${styles.titleProject} title`}>NuBank Aplicativo</h1>
  <h2 className={`${styles.subtitleProject} subtitle`}>
  Descrição breve falando sobre o aplicativo <br/>
  Features:<br/>
  - Credenciais usando SHA-245 <br/>
  - Accesso Token via Cookies HTTPOnly
 
  </h2>
 	</div>
  <img src={Phone}/>
  
  </div>


  </div>

	</>


	);

}




export default Carrosel;