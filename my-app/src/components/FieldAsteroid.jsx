import styles from './asteroid.module.css';
import Asteroid from './Asteroid.jsx'
import {useState,useRef} from 'react';
import React,{Component} from 'react';
//Props: name,size,color


function FieldAsteroid(){

 const [asteroids, setAsteroids] = useState([
 	{ id: 1, xPos: 100, yPos: 100, velX: 2, velY: 2, size: 200, hidden: 10 }
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