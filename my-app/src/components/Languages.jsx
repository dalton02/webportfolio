import styles from './languages.module.css';
import {useState,useRef,useEffect} from 'react';
import { useInView, animated } from '@react-spring/web'
import '../CSS/framework.css';
import '../CSS/fonts.css';
import Rust from '../SVG/rust.svg';
import Java from '../SVG/java.svg';
import Svelte from '../SVG/svelte.svg';
import Post from '../SVG/post.svg';
import ReactL from '../SVG/react.svg';
import Node from '../SVG/node.svg';
import Php from '../SVG/php.svg';
import Sql from '../SVG/mysql.svg';
import C from '../SVG/c++.svg';
import Mongo from '../SVG/mongo.svg';
import Phyton from '../SVG/phyton.svg';
import Jquery from '../SVG/jquery.svg';
import Docker from '../SVG/docker.svg';
import Ruby from '../SVG/ruby.svg';
import Go from '../SVG/go.svg';
import CS from '../SVG/cS.svg';
import linux from '../SVG/linux.svg';
import windows from '../SVG/windows.svg';
import mac from '../SVG/mac.svg';

import CardLanguage from './CardLanguage.jsx';
import SliderBox from './SliderBox.jsx';
import useScreenSize from './useScreenSize';
//Props: name,size,color

function Languages(){

    const screen = useScreenSize();
    //Organizando os cards para dois tipos de tela pra ficar bonito
    const array1 = [C,Go,Rust,CS,Phyton];
    const array2 = [Jquery,Mongo,Node,ReactL,Svelte];
    const array3 = [Java,Ruby,Sql,Post,Docker];
    
	return (
	<>
    
    <div className={`flex-row get-full justify-end overHidden ${styles.fullBox}`}>
    <div className={`${styles.overView}`}>
    <div className={`${styles.clip}`}>
    <span>Trabalho para todas as plataformas</span>

    <div className={`flex-row ${styles.distros}`}>
    <img src={linux}/>
    <img src={mac}/>
    <img src={windows}/>
    
    </div>
    </div>
    </div>
    
    <div className={`flex-column get-full ${styles.floating}`}>
    <SliderBox cards={array1} direction='1' delay='.3s'/>
    <SliderBox cards={array2} direction='-1' delay='.2s'/>
    <SliderBox cards={array3} direction='1' delay='.1s'/>
    </div>

    
    </div>
    
    </>
    );

}




export default Languages;

{/*
        <CardLanguage logo={Mongo} delay='80ms'/>
        <CardLanguage logo={C} delay='100ms'/>
        <CardLanguage logo={Jquery} delay='110ms'/>
        <CardLanguage logo={Phyton} delay='120ms'/>
        <CardLanguage logo={Go} delay='120ms'/>
        <CardLanguage logo={Docker} delay='120ms'/>
        <CardLanguage logo={Ruby} delay='120ms'/>
   
*/}
