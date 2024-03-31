import styles from './carrosel.module.css';
import {useState,useRef,useEffect} from 'react';
import '../CSS/framework.css';
import CardProject from './CardProject.jsx';
import Engine from '../IMG/engine.png';
import Ray from '../IMG/ray.png';
import Voxel from '../IMG/voxel.png';

//Props: name,size,color

function Carrosel(){
	
	
	const [current,setCurrent]= useState(-1);
	const [init,setInit] = useState(false);
	
	const addCountHandler = () => {
    if([current] == 1)	return;
		setCurrent(current + 1);
	};  

	const removeCountHandler = () => {
    if([current] == -1){
      return;  
    }
    setCurrent(current - 1);
	};

	const car = useRef(null);
	
	useEffect( () =>{
		const quantidade= 100/3;
		car.current.style.transform = "translateX("+(current*-1)*quantidade+"%)";		
		},[current]);



	return (
		
		<div className={`${styles.carrosel}`}>
				<div className={`${styles.controller}`}>
				
				<i onClick={removeCountHandler}></i> 
				Projetos de Computação Grafica
				<i onClick={addCountHandler}></i>
				
				</div>
				<div className={`${styles.box}`} ref={car}>

					<CardProject img={Ray} title="RayCaster Engine" language="Javascript" 
					link="http://projectsio.000.pe/Projects/RayCasting/pagina.html?"/>
					<CardProject img={Voxel} title="Voxel Terrain Generator" language="Javascript" 
					link="http://projectsio.000.pe/Projects/Voxel/pagina.html?"/>
					<CardProject img={Engine} title="3D Game Engine" language="C++"
					link="https://github.com/dalton02/engine3D"

					/>

				</div>

		</div>

	);

}




export default Carrosel;