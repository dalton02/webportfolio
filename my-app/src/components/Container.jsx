import '../CSS/framework.css'; 
import styles from './container.module.css'; 
import '../CSS/fonts.css';
import React from 'react'

const Container = ({children,...props}) => {

return(
	<>
	<div 
	style={{
  		'--sizeHGG': props.HGG,
  		'--sizeHG': props.HG,
  		'--sizeHM': props.HM,
  		'--sizeHP': props.HP,
  		'--sizeHPP':props.HPP,
  		'--sizeHXP':props.HXP,
  		'--backColor':props.backColor,
  		'--backColorAnt':props.backColorAnt,
  		'--backEndColor':props.backEndColor
	}
	}

	className={styles.container}
	>
		<div className={styles.children}>{children}</div>
		
	<div className={styles.background}></div>		
	</div>

	</>

);
}

export default Container;