import styles from './asteroid.module.css';
import Asteroid from './Asteroid.jsx'
import {useState,useRef} from 'react';
import React,{Component} from 'react';
//Props: name,size,color


function FieldAsteroid(props){

  const initialS = [120,130,100,100];

 const [asteroids, setAsteroids] = useState([
 	{ id: 1, xPos: 440, yPos: 450, velX: -0, velY: 0, size: initialS[0], hidden: 999999999 },
  { id: 1, xPos: 100, yPos: 450, velX: 0, velY: 0, size: initialS[1], hidden: 9999999 },
  { id: 1, xPos: 1200, yPos: 750, velX: 0, velY: 0, size: initialS[2], hidden: 9999999 },
  { id: 1, xPos: 1200, yPos: 1350, velX: 1, velY: 0, size: initialS[3], hidden: 31}
 ]);

  const handleAsteroidHit = (newXPos, newYPos, newVelX, newVelY,newSize) => {
    // Adiciona os novos asteroides à lista de asteroides
    setAsteroids(prevAsteroids => [
      ...prevAsteroids,
      { id: prevAsteroids.length + 1, xPos: newXPos, yPos: newYPos, velX: newVelX, velY: newVelY, size: newSize, hidden: 10 }
    ]);
    console.log(asteroids);
  };

	return(

		<>
		{asteroids.map( (asteroid,index) =>
		<Asteroid  
    key = {index}
    id = {asteroid.id}
    xPos = {asteroid.xPos}
    yPos = {asteroid.yPos}
    velX = {asteroid.velX}
    velY = {asteroid.velY}
    size = {asteroid.size}
    hidden={asteroid.hidden}   
    onAsteroidHit={handleAsteroidHit} 
    />
		)}
		</>

     

	);

};


export default FieldAsteroid;