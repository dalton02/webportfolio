import styles from './asteroid.module.css';
import Rock from '../SVG/rock1.svg'
import React,{Component} from 'react';

//Props: name,size,color



  
class Asteroid extends Component{

	constructor(props){

		super(props);
		this.state={
			xPos: props.xPos,
			yPos:	props.yPos,
			mouseX: 0,
			mouseY: 0,
			velX: props.velX,
			velY:	props.velY,
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
		  this.props.onAsteroidHit(this.state.xPos,this.state.yPos, 
		  this.state.velX*1.8,this.state.velY*1.8,this.state.size,this.props.id);
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
     		let newX = (prevState.mouseX - this.state.mouseX)/2;  
     		let newY = (prevState.mouseY - this.state.mouseY)/2;   
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
		
		const width = document.body.clientWidth;
		const height = document.body.clientHeight;
    let hit=false;		
		
		if(this.state.xPos<0){
			this.setState({xPos:0,velX: this.state.velX*-1});
			
			hit=true;
		}
		else if(this.state.xPos>width-this.state.size){
			this.setState({xPos:width-this.state.size,velX: this.state.velX*-1});
			hit=true;
		}
		else if(this.state.yPos<0){
			this.setState({yPos:0,velY: this.state.velY*-1});
				hit=true;	
		}
		else if(this.state.yPos>height-this.state.size){
			this.setState({yPos:height-this.state.size,velY: this.state.velY*-1});
			hit=true;
		}

		if( (hit==true) && (this.state.velX>5 || this.state.velX<-5) && this.state.size>90 ){
		  this.setState({velX:this.state.velX*0.1,velY: this.state.velY*0.1,size:this.state.size/1.8});
			this.setState({spawn:true});
	  }
	  
	  else if( (hit==true) && (this.state.velX>5 || this.state.velX<-5)){
	  	this.setState({velX: this.state.velX*0.5});
	  }
	  else if( (hit==true) && (this.state.velY>5 || this.state.velY<-5)){
	  	this.setState({velX: this.state.velY*0.5});
	  }
		
	}
	else{
		this.setState({xPos: this.state.mouseX,yPos: this.state.mouseY});
		}

	}

	render(){
	

	const myStyle = [
		styles.item,
	].join(" ");

	const {xPos,yPos,size,hidden,velX,velY} = this.state;
	let vel = Math.abs((velX+velY)/1);

	if(vel==0) vel=6;
	else if(vel<1) vel=5;
	else if(vel>2) vel=1;

	vel = vel * this.state.size/50;

	return (
	<>
	<div className={myStyle}

	style={{
	'--hidden': `${hidden}`,
	'--size': `${size}px`,
	'--time': `${vel}s`,
	'left': `${xPos}px`,
	'top': `${yPos}px`,
	'--screen': `${window.innerWidth}`
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