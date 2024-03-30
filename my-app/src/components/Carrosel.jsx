import styles from './carrosel.module.css';
import {useState,useRef,useEffect} from 'react';
import '../CSS/framework.css';
import iconGit from '../SVG/iconGit.svg';

import Pokedex from '../IMG/pokeProject.png';

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
/*
	useEffect( () =>{

		if(init==false)	{
		setInit(true);
		return;
		}

		const quantidade =115;
		car.current.style.transform = "translateX("+current*quantidade+"%)";
		

		},[current]);

*/



	return (
	<>
	
	<div className={`${styles.box} color2`}>
  
	  <div className={`${styles.carrosselBox} flex-row`}>	
	
		 	<div className={`${styles.typeBox} flex-row justify-around content-center items-center`}>
		 		<h1 className="normalText"></h1>

		 		<div className={`${styles.projectBox} flex-column justify-end content-center items-center `}>
		 		<div className={`${styles.filterBox}`}></div>
		 		<img src={Pokedex}/>
		 		<div className={`${styles.projectTitle} flex-column justify-center content-center items-center`}>
		 		<h2 className="normalText">Pokedex WEB</h2>
		 		<span className="tinyText flex-row justify-center items-center content-center"> 
		 				Pokedex armazenada em Postgres e back end em express 
		 		</span>
		 		</div>
		 		</div>

		 		<div className={`${styles.projectBox} flex-column justify-end content-center items-center `}>
		 		<div className={`${styles.filterBox}`}></div>
		 		<img src={Pokedex}/>
		 		<div className={`${styles.projectTitle} flex-column justify-center content-center items-center`}>
		 		<h2 className="normalText">Pokedex WEB</h2>
		 		<span className="tinyText flex-row justify-center items-center content-center"> 
		 				Pokedex armazenada em Postgres e back end em express 
		 		</span>
		 		</div>
		 		</div>
		 		
		 		<div className={`${styles.projectBox} flex-column justify-end content-center items-center `}>
		 		<div className={`${styles.filterBox}`}></div>
		 		<img src={Pokedex}/>
		 		<div className={`${styles.projectTitle} flex-column justify-center content-center items-center`}>
		 		<h2 className="normalText">Pokedex WEB</h2>
		 		<span className="tinyText flex-row justify-center items-center content-center"> 
		 				Pokedex armazenada em Postgres e back end em express 
		 		</span>
		 		</div>
		 		</div>

		 	</div>
  		<div className={`${styles.typeBox} flex-row justify-around`}>
  			
  		</div>
  
  	</div>

  </div>

	</>


	);

}




export default Carrosel;