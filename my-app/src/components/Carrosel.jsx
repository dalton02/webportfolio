import styles from './carrosel.module.css';
import {useState,useRef,useEffect} from 'react';
import '../CSS/framework.css';
import CardProject from './CardProject.jsx';
import Engine from '../IMG/engine.png';
import Ray from '../IMG/ray.png';
import Voxel from '../IMG/voxel.png';
import Chat from '../IMG/livechat.png';

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
				
				<i onClick={addCountHandler}></i>
				
				</div>
				<div className={`${styles.box}`} ref={car}>

					<CardProject img={Chat} y="18%" title="Live Chat App" language="Socket.io" 
					link="https://github.com/dalton02/LIVE_CHAT"/>
					<CardProject img={Voxel} y="10%" title="Voxel Terrain Generator" language="Javascript" 
					link="http://projectsio.000.pe/Projects/Voxel/pagina.html?"/>
					<CardProject img={Engine} y="10%" title="3D Game Engine" language="C++"
					link="https://github.com/dalton02/engine3D"

					/>

				</div>

		</div>

	);

}




export default Carrosel;