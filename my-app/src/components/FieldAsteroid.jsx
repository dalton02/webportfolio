import styles from './asteroid.module.css';
import Asteroid from './Asteroid.jsx'
import {useState,useRef} from 'react';
import React,{Component} from 'react';
//Props: name,size,color


function FieldAsteroid(){

 const [asteroids, setAsteroids] = useState([
 	{ id: 1, xPos: 440, yPos: 400, velX: -0.5, velY: 0, size: 120, hidden: 999999999 },
  { id: 1, xPos: 140, yPos: 400, velX: 0.5, velY: 0, size: 180, hidden: 999999999 }
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