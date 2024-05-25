import Asteroid from './Asteroid.jsx'
import React, { Component } from 'react';
import {useState,useEffect} from 'react';

function FieldAsteroid(props){

  const backup = [
  { id: 1, xPos: 300, yPos: 520, velX: 14, velY: -0.5, size: 100, hidden: 999 },
  { id: 1, xPos: 100, yPos: 450, velX: 0, velY: 0, size: 170, hidden: 99999 },
  { id: 1, xPos: 1200, yPos: 750, velX: 0, velY: 0, size: 110, hidden: 9999999 },
  { id: 1, xPos: 1200, yPos: 2150, velX: 1, velY: 0, size: 120, hidden: 99999},
  { id: 1, xPos: 1200, yPos: 3150, velX: 1, velY: 0, size: 150, hidden: 99999},
  ];
 const [asteroids, setAsteroids] = useState(backup);
 
  const handleAsteroidHit = (newXPos, newYPos, newVelX, newVelY,newSize) => {
    // Adiciona os novos asteroides à lista de asteroides
    setAsteroids(prevAsteroids => [
      ...prevAsteroids,
      { id: prevAsteroids.length + 1, xPos: newXPos, yPos: newYPos, velX: newVelX, velY: newVelY, size: newSize, hidden: 99999 }
    ]);
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
    size = {`${asteroid.size}`}
    hidden={asteroid.hidden}   
    onAsteroidHit={handleAsteroidHit} 
    />
		)}
		</>

     

	);

};


export default FieldAsteroid;