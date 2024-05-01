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

import CardLanguage from './CardLanguage.jsx';
import SliderBox from './SliderBox.jsx';
import useScreenSize from './useScreenSize';
//Props: name,size,color

function Languages(){

    const screen = useScreenSize();
    //Organizando os cards para dois tipos de tela pra ficar bonito
    const array1 = [Go,Rust,CS,Phyton,Java, Ruby, Docker, C];
    const array2 = [Jquery,Mongo,Node,ReactL,Svelte, Sql, Post, Php];
    
	return (
	<>
    
    <div className={`flex-column get-full ${styles.box}`}>
        <div className={`flex-column ${styles.about}`}>
        <p>Desenvolvimento de software nas mais diversas linguagens assim como expertise na criação de containers 
        utilizando Docker, proporcionando soluções de hospedagem mais flexíveis e eficientes.
        </p>
        </div>
        <div className={`flex-column ${styles.floating}`}>
        <SliderBox cards={array1} direction='1' delay='.3s'/>
        <SliderBox cards={array2} direction='-1' delay='.3s'/>
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
