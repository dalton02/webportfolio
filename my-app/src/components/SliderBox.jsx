import styles from './SliderBox.module.css';
import CardLanguage from './CardLanguage.jsx';



function SliderBox({ cards, delay, direction }){
	return(
		
	<>
	 <div className={`${styles.content}`}>
	 	<div className={`${styles.box} color2`} 
	 	style={{
	 	'--delay': delay,
	 	'--dir': direction,
	 	}}
	 	>
  			{cards.map((card, index) => (
        	<CardLanguage logo={card} delay={`${index*10}ms`}/>
        	))}
    	</div>

    	<div className={`${styles.box2} color2`}
		style={{
	 	'--delay': delay,
	 	'--dir': direction,
	 	}} 
    	>
    		{cards.map((card, index) => (
        	<CardLanguage logo={card} delay={`${index*10}ms`}/>
        	))}
    	</div>
    
    </div>
	</>

	);
}


export default SliderBox;