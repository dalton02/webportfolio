import styles from './asteroid.module.css';
import Rock from '../SVG/rock1.svg'
import {useState,useRef,useEffect} from 'react';
import React,{Component} from 'react';
//Props: name,size,color


class Asteroid extends Component{

	constructor(props){

		super(props);
		this.state={
			xPos: parseInt(props.xPos),
			yPos: parseInt(props.yPos),
			mouseX: 0,
			mouseY: 0,
			velX: parseInt(props.velX),
			velY: parseInt(props.velY),
			size: props.size,
			hidden: props.hidden,
			hold: false,
			spawn:false
		};
	}

	//Essas funções são pre definidas
  	componentDidMount(){
		this.animate();
		document.addEventListener('mousemove', this.handleMouseMove);
		document.addEventListener('mouseup', this.handleMouseUp);
	}
	componentWillUnmount(){
    cancelAnimationFrame(this.Frame);
	}

  // componentDidUpdate
  componentDidUpdate(prevProps, prevState) {
    	
  		if(prevState.xPos!== this.state.xPos || prevState.yPos !== this.state.yPos ||
  			prevState.velX!== this.state.velX || prevState.velY !== this.state.velY
  			|| this.state.hold==true
  		){


  		if(this.state.spawn==true){
  			console.log("A");
		  this.props.onAsteroidHit(this.state.xPos,this.state.yPos, 
		  this.state.velX*1.8,this.state.velY*1.8,this.state.size/1.8,this.props.id);
			}

			this.animate();
  		
  		}

    
  }

	handleMouseDown = (event) =>{
		this.setState({ hold: true });    	
    	this.animate();
	}

	handleMouseUp = (event) =>{
		if(this.state.hold===true){
		this.setState({ hold: false });
		this.setState((prevState) => {	
     		let newX = (prevState.mouseX - this.state.mouseX)/5;  
     		let newY = (prevState.mouseY - this.state.mouseY)/5;   
    		if(newX>5) newX=5;
    		if(newY>5) newY=5;
    		return{
    			velX: newX,
    			velY: newY
    		};
    	});
    	this.animate();
	}

	}

  	handleMouseMove = (event) => {
    this.setState({
      mouseX: (event.pageX-this.state.size/2),
      mouseY: (event.pageY-this.state.size/2),
    });
  	};
	animate = () => {
		this.frame = requestAnimationFrame(this.update);
	}

	update = () => {

			this.setState({spawn:false});
		if(this.state.hold === false){
		  this.setState((prevState) => ({
     		 xPos: prevState.xPos + prevState.velX,
     		 yPos: prevState.yPos + prevState.velY,
		
    	}));
		}
		else{
		this.setState({xPos: this.state.mouseX,yPos: this.state.mouseY});
		}

		const width = document.body.clientWidth;
		const height = document.body.clientHeight;
    let hit=false;		
		
		if(this.state.xPos<0){
			this.setState({xPos:5,velX: this.state.velX*-1});
			console.log("colidiux");
			hit=true;
		}
		else if(this.state.xPos>width){
			this.setState({xPos:width-5,velX: this.state.velX*-1});
			hit=true;
		}
		else if(this.state.yPos<0){
			this.setState({yPos:this.state.size,velY: this.state.velY*-1});
				hit=true;	
		}
		else if(this.state.yPos>height){
			this.setState({yPos:height-this.state.size,velY: this.state.velY*-1});
			hit=true;
		}

		if( (hit==true) && (this.state.velX>5 || this.state.velX<-5) ){
			console.log('CHAOS');

		  this.setState({velX:this.state.velX*0.1,velY: this.state.velY*0.1,size:this.state.size});
			this.setState({spawn:true});

	  }
		

	}

	render(){
	

	const myStyle = [
		styles.item,
	].join(" ");

	const {xPos,yPos,size,hidden,velX,velY} = this.state;
	let vel = Math.abs((velX+velY)/1);
	if(vel==0) vel=6;
	else if(vel<0.5) vel=0.5;

	vel = vel * this.state.size/50;

	return (
	<>
	<div className={myStyle}

	style={{
	'--hidden': `${hidden}`,
	'--size': `${size}px`,
	'--time': `${vel}s`,
	'left': `${xPos}px`,
	'top': `${yPos}px`
	}}

	onMouseDown={this.handleMouseDown}
	>

	<img src={Rock}/>
	
	</div>	
	



	</>

	);

}
}



export default Asteroid;