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
//Props: name,size,color

function Languages(){
	
	return (
	<>
	
	<div className={`${styles.box} color2`}>
    

  <CardLanguage logo={Rust} delay='10ms' />
  <CardLanguage logo={Java} delay='30ms'/>
  <CardLanguage logo={Svelte} delay='60ms'/>
  <CardLanguage logo={ReactL} delay='90ms'/>
  <CardLanguage logo={Node} delay='120ms'/>
  <CardLanguage logo={Post} delay='150ms'/>
  <CardLanguage logo={Php} delay='180ms'/>
  <CardLanguage logo={Mongo} delay='210ms'/>
  <CardLanguage logo={Sql} delay='240ms'/>
  <CardLanguage logo={C} delay='270ms'/>
  <CardLanguage logo={Jquery} delay='300ms'/>
  <CardLanguage logo={Phyton} delay='330ms'/>

  </div>

	</>


	);

}




export default Languages;