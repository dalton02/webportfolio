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
import CardLanguage from './CardLanguage.jsx';
import useScreenSize from './useScreenSize';
//Props: name,size,color

function Languages(){

    const screen = useScreenSize();
    //Organizando os cards para dois tipos de tela pra ficar bonito

	return (
	<>
    {screen.type<1 ? 
    (
    
    <div className={`${styles.box} color2`}>
        <CardLanguage logo={Rust} delay='10ms' x='0%' y='0%' />
        <CardLanguage logo={Java} delay='20ms' x='70%' y='18%'/>
        <CardLanguage logo={Svelte} delay='30ms' x='70%' y='0%'/>
        <CardLanguage logo={ReactL} delay='40ms' x='35%' y='9%'/>
        <CardLanguage logo={Node} delay='50ms' x='0%' y='18%'/>
        <CardLanguage logo={Post} delay='60ms' x='0%' y='45%'/>
        <CardLanguage logo={Php} delay='70ms' x='35%' y='35%'/>
        <CardLanguage logo={Mongo} delay='80ms' x='35%' y='25%'/>
        <CardLanguage logo={Sql} delay='90ms' x='70%' y='45%'/>
        <CardLanguage logo={C} delay='100ms' x='60%' y='65%'/>
        <CardLanguage logo={Jquery} delay='110ms' x='35%' y='55%'/>
        <CardLanguage logo={Phyton} delay='120ms' x='10%' y='65%'/>
    </div>

    ) 
    : 
    (
    
    <div className={`${styles.box} color2`}>
        <CardLanguage logo={Rust} delay='10ms' x='0%' y='0%' />
        <CardLanguage logo={Java} delay='20ms' x='61%' y='16%'/>
        <CardLanguage logo={Svelte} delay='30ms' x='80%' y='2%'/>
        <CardLanguage logo={ReactL} delay='40ms' x='35%' y='6%'/>
        <CardLanguage logo={Node} delay='50ms' x='6%' y='20%'/>
        <CardLanguage logo={Post} delay='60ms' x='4%' y='52%'/>
        <CardLanguage logo={Php} delay='70ms' x='16%' y='36%'/>
        <CardLanguage logo={Mongo} delay='80ms' x='74%' y='30%'/>
        <CardLanguage logo={Sql} delay='90ms' x='70%' y='48%'/>
        <CardLanguage logo={C} delay='100ms' x='80%' y='74%'/>
        <CardLanguage logo={Jquery} delay='110ms' x='38%' y='60%'/>
        <CardLanguage logo={Phyton} delay='120ms' x='10%' y='80%'/>
    </div>
    )}
	
    </>
    );

}




export default Languages;