import '../CSS/framework.css'; 
import styles from './container.module.css'; 
import '../CSS/fonts.css';
import React from 'react'

const Container = ({children,...props}) => {
	console.log(props.WGG);

return(

	<div 
	style={{
		'--sizeWGG': props.WGG,
  		'--sizeHGG': props.HGG,
  		'--sizeWG': props.WG,
  		'--sizeHG': props.HG,
  		'--sizeWM': props.WM,
  		'--sizeHM': props.HM,
  		'--sizeWP': props.WP,
  		'--sizeHP': props.HP,
  		'--sizeWPP':props.WPP,
  		'--sizeHPP':props.HPP,
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
);
}

export default Container;