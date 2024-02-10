<!DOCTYPE html>
<html>
    
    <head>
        <meta charset="utf-8">
        <title>PROJECTS.IO</title>
        <link rel="stylesheet" href="css/styleS.css">
    </head>
    
    <script type="text/javascript">
    
    var currentLang = "pt_BR";  
    
   
    let texto = {
        
    descricao:{
        pt_BR:"Olá, meu nome é Dalton Gomes Lobato, moro no cratinho de açucar, e sempre fui apaixonado em programação e paradigmas computacionais, estou em busca de oportunidaes profissionais para ampliar meu curriculo e me trazer novos desafios",
        en_US:"Hi, my name is Dalton Gomes Lobato, living in the 'sugar region' of Cariri in Brazil, i'm very passionate about programming and learning computer paradigms and i am looking for career oportunities to amplify my curriculum and computer skills"
    },
    titleAbout:{
        pt_BR: "SOBRE MIM",
        en_US: "ABOUT ME"
    },

    titleContact:{
        pt_BR: "CONTATO",
        en_US: "CONTACT"
    },

    titleSkills:{
        pt_BR: "HABILIDADES DE PROGRAMACAO",
        en_US: "PROGRAMMING SKILLS"
    },
    titleProjects:{
        pt_BR: "MEUS PROJETOS",
        en_US: "MY PROJECTS"
    },
    titleEducation:{
        pt_BR: "ESCOLARIDADE",
        en_US: "EDUCATION"
    },
    titleExperience:{
        pt_BR: "EXPERIENCIA",
        en_US: "EXPERIENCE"
    },
    infoEducation:{
        en_US:"<h3>DEGREE: BACHELOR IN COMPUTER SCIENCE </h3><h3> PERIOD: 2018-2021   </h3> ",
        pt_BR:"<h3>NIVEL: BACHALERADO EM CIÊNCIA DA COMPUTAÇÃO</h3> <h3> PERIODO: 2018-2021 </h3>"
    },
    infoEducation2:{
      en_US:" <h3>DEGREE: COMPUTER NETWORK TECHNICIAN</h3><h3>PERIOD: 2018-2021 </h3>",
      pt_BR: "<h3>NIVEL: TÉCNICO EM REDES DE COMPUTADORES</h3><h3>PERIODO: 2018-2021 </h3>"
    },
    infoJob:{
        en_US:" <h2>I.T TECHNICIAN</h2><h3> LOCATION: DEPARTAMENT OF IT</h3><h3>PERIOD: 2022-2023</h3><h3>TASKS:HARDWARE MAINTANCE,MAINTANCE NETWORK STRUCTURE, VEYON MASTER NETWORK MANAGER </h3> ",
        pt_BR:" <h2>TÉCNICO DA TI</h2><h3> LOCAL: DEPARTAMENTO DA DTI</h3><h3>PERIODO: 2022-2023</h3><h3>FUNCOES:MANUTENCAO DE HARDWARE, ESTRUTURAMENTO DE CABEAMENTO, GESTOR DO PROGRAMA VEYON MASTER </h3> ",
    },
    skillsJava:{
      en_US:" Habilitys: <br/>-OOP (Object Oriented Programming)<br/>-Swing Graphics<br/>-DataBase Connection/Manipulation<br/>"+         
      "<br/> Curiosity: <br/>First contact in high scholl as my ever first programming language, this is what boost my passion for coding. <br/><br/> Skill Level: ",
      pt_BR:" Habilidades: <br/>-POO (Programação Orientada a Objeto)<br/>-Janela de Gráficos Swing<br/>-Conexão e Manipulação de Banco de Dados<br/>"+         
      "<br/> Curiosidade: <br/>Primeiro contato com a linguagem Java no ensino médio, onde surgiu minha paixão por programação<br/><br/> Nivel de habilidade: "
    },
    skillsC:{
      en_US:" Habilitys: <br/> -Memory Manipulation<br/>-Graphics Engines<br/> -Sockets Connection<br/>"+         
      "<br/> Curiosity: <br/>By far one of my favorite languages, to build algorithms in scratch i always resort to C language, it just feels more welcome to the basics of learning something<br/><br/> Skill Level: ",
      pt_BR:" Habilidades: <br/>-Manipulação de Memoria<br/>-Computação Gráfica<br/>-Conexão de Sockets<br/>"+         
      "<br/> Curiosidade: <br/>Minha linguagem favorita quando se trata de aprender as origens de algum algoritimo, entender a verdadeira essência dele<br/><br/> Nivel de habilidade: "
    },
    projectsRay:{
        en_US: "<h2>RAYCAST ENGINE</h2><h3>Project made in JS using just the basics of the language, its is not a enjoyable game however</h3> ",
        pt_BR: "  <h2>RAYCAST ENGINE</h2><h3>Projeto feito em javascript, apenas um estudo de projeções tridimensionais a partir de um ambiente 2D</h3> "
    },
    projects3d:{
        en_US: "<h2>3D TRIANGLE ENGINE</h2><h3>Project made in JS using just the basics of the language, its is not a enjoyable game however</h3> ",
        pt_BR: "  <h2>RENDERIZADOR DE TRIANGULOS</h2><h3>Projeto feito em C++, consegue converter qualquer .obj em um mesh de triangulos,permitindo fazer translação,rotação,escalonamento.(sem uso do opengl)</h3> "
    }
    
        
        
    };
    
    function traduzir(item,lang){
        document.write(texto[item][lang]);
    }
    
    
    </script>
    
    
    <body>
        
    
        
        <div id="cab">
        
        <h1>PROJECTS.IO</h1>
         
            <div id="cabLang"> 
            <div class="language"> 
            <input type="checkbox" id="1" class="langswitch-checkbox" checked>
            <label for="1">    
            <img src="imagens/usa.png"/>    
                </label>
                </div>
            <div class="language"> <input type="checkbox" id="2" class="langswitch-checkbox" checked>
            <label for="2">
                <img src="imagens/br.png" onclick="" /></label></div>
                </div>
         </div>
        
        <script>
                
            var check = document.querySelectorAll('.langswitch-checkbox');
            for (var i = 0; i < check.length; i++) {    
            check[i].addEventListener('click', ((j) => {         
            return function() {
            
            if(j==1){
                teste[0].checked=false;
            }
            else{
                    teste[1].checked=false;
            }
                location.reload();
            
            }
            })(i))
            }
            
            
             var teste = document.getElementsByClassName("langswitch-checkbox");
            
            
            if(teste[1].checked)
                currentLang = "pt_BR";
            else
                currentLang = "en_US";
        </script>
        
        <div class="containerG">
            
        <div class="containerDivI">
        <div class="titleProject">
            <h1><script>traduzir('titleAbout',currentLang);</script></h1>
        </div>
            
        <div class="smallContainer">
           
         <div id="myPhoto"></div>
            <p><script>traduzir('descricao',currentLang);</script></p>
        </div>
        <div id="menuAbout">
        
         <ul>
        <li onclick="change(1)">
        <script>traduzir('titleEducation',currentLang);</script>
        </li>   
        <li onclick="change(2)">
        <script>traduzir('titleExperience',currentLang);</script>   
        </li>
        </ul>
        </div>
        <div class="hiddenText">
        <div class="textAbout">
            
           
            <div class="myAbout">   
            
            <div class="allHiddenSkill">
            
            <div class="inContainerSkill"
            style="
            background: none;      
            margin:0;"    
            >    
            
            <div class="imageContact" style="background: url(imagens/UFCA.png);
    background-size: contain; 
    background-position: center; 
    background-repeat: no-repeat;">
            </div>
            <div class="textInContainerContact"
            style="display: flex;justify-content: center;"     
            >
            
            <h2 style="text-align: center;word-break: normal;">
        
                UNIVERSIDADE FEDERAL DO CARIRI  
            </h2>
                <script>traduzir('infoEducation',currentLang);</script>
            
            </div>
            
            </div>
                
            </div>
        
        </div>
            
            
            
            
            <div class="myAbout">   
            
            <div class="allHiddenSkill">
            
            <div class="inContainerSkill"
            style="
            background: none;      
            margin:0;
            "    
            >    
            
            <div class="imageContact" style="background:  url(imagens/violeta.png);    background-size: contain; 
    background-position: center; 
    background-repeat: no-repeat;">
            </div>
            <div class="textInContainerContact"
            style="display: flex;justify-content: center;">
            
            <h2>
        
                E.E.E.P Maria Violeta Arraes  
            </h2>
           
                <script>traduzir('infoEducation2',currentLang);</script> </div>
            
            </div>
                
            </div>
        
        </div>
            
            
            
            
        </div>
            
            
            
        <div class="textAbout" style="transform: translateY(100vh);">
            <div class="myAbout">   
            
            <div class="allHiddenSkill">
            
            <div class="inContainerSkill"
            style="
            background: none;      
            margin:0;
            display: flex;
            justify-content: flex-start;
                   align-content: flex-start;
            "    
            >    
            
            <div class="imageContact" style="background:  url(imagens/UFCA.png);    background-size: contain; 
    background-position: center; 
    background-repeat: no-repeat;">
            </div>
            <div class="textInContainerContact"
            style="display: flex;justify-content: center;">
            
            
        <script>traduzir('infoJob',currentLang);</script>
            </div>
            
            </div>
                
            </div>
        
        </div>
        
        </div>
            
        </div>
        </div>
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
        
        <div class="containerDivS">
        <div class="titleProject">
            <h1><script>traduzir('titleSkills',currentLang);</script></h1>
        </div>
            
        <div class="bigContainer">   
            
        <div class="skillsContainer">
            
            
            
            <div class="mySkill"  style="background: none;" >   
            
            <div class="allHiddenSkill">
            
            <div class="imageHiddenSkill"><img src="imagens/cardJ.png" /> 
            </div> 
            
            <div class="inContainerSkill" 
          
                 
                >    
            
            <div class="textInContainerSkill">
            <h3>
            
                <script>traduzir('skillsJava',currentLang)</script> 
                
                
                
            </h3> 
                
                <div class="levelSkill"></div>
            </div>
                
            </div>
            
            </div>
                
            </div>
    
            
            <div class="mySkill">   
            
            <div class="allHiddenSkill">
            
            <div class="imageHiddenSkill"><img src="imagens/cardC.png" /> 
            </div> 
            
            <div class="inContainerSkill">    
            
            <div class="textInContainerSkill">
            <h3>
            
                <script>traduzir('skillsC',currentLang)</script>
                
                </h3> 
                <div class="levelSkill"
                style="
background: linear-gradient(90deg, rgba(223,200,40,1) 0%, rgba(223,200,40,1) 25%, rgba(255,255,255,1) 25.1%, rgba(223,200,40,1) 25.5%,
    
    
    rgba(223,200,40,1) 50%, rgba(255,255,255,1) 50.1%, 
    
    rgba(223,200,40,1) 50.5%,
    
    rgba(223,200,40,1) 75%, rgba(255,255,255,1) 75.1%, 
    
    rgba(223,200,40,0) 75.5%, 
    
    rgba(223,200,40,0) 100%);
" 
                     
                    ></div>
            </div>
                
            </div>
            
            </div>
                
            </div>
    
            
            <div class="mySkill">   
            
            <div class="allHiddenSkill">
            
            <div class="imageHiddenSkill"><img src="imagens/cardC.png"/> 
            </div> 
            
            <div class="inContainerSkill">    
            
            <div class="textInContainerSkill">
            <h3>
            
                Habilitys: <br/>
                -Memory Manipulation<br/>
                -Graphics Engines<br/>
                -Sockets Connection<br/>
                
                <br/> Curiosity: <br/>
                By far one of my favorite languages, to build algorithms in scratch i always resort to C language,
                it just feels more welcome to the basics of learning something
                <br/>
                <br/> Skill Level:                
            </h3> 
                <div class="levelSkill"></div>
            </div>
                
            </div>
            
            </div>
                
            </div>
    
            
            
        </div>
        
            
            
            
        </div>
        </div>
        
        <div class="containerDivP">
        
        <div class="titleProject">
            <h1><script>traduzir('titleProjects',currentLang);</script></h1>
        
        </div>
        
            
        <div class="bigContainer">
                
                
        <div class="projectsContainer">
            
            
            
            <div class="myProject">   
            
            <div class="allHidden">
            
            <div class="imageHidden"><img src="imagens/ray.gif" style="width:1280px" /> 
            </div> 
            
            <div class="inContainer">    
            <div class="textInContainer">
            <script>traduzir('projectsRay',currentLang);</script> 
            </div>
                <div class="btnContainer">
                <form>
                    <button class="btn" onclick= "openPreview()">START</button> </form> 
            </div>
            </div>
            
            </div>
                
            </div>
      
            <div class="myProject">   
            
            <div class="allHidden">
            
            <div class="imageHidden"><img src="imagens/3d.gif" style="width:1280px" /> 
            </div> 
            
            <div class="inContainer">    
            <div class="textInContainer">
                <script>traduzir('projects3d',currentLang);</script>  </div> <div class="btnContainer">
                <form action="https://github.com/dalton02/engine3D" target="_blank"><button class="btn">START</button> </form>    
           </div>
                
            </div>
            </div>
            </div>
            
            
            
        </div>
        
                </div>
        </div>  
            
        
        
        
        
        <div class="containerDiv" style="margin-bottom: 0;">
        <div class="titleProject">
        <h1><script>traduzir('titleContact',currentLang);</script> </h1>
        
        </div>
        <div class="smallContainerC">
           
            <div class="myContact" onclick="openZap()"       >   
            
            <div class="allHiddenSkill">
            
            <div class="inContainerSkill"
            style="      
            margin:0;
            justify-content: flex-end;
            justify-items: center;
            align-content: flex-end;
            align-items: center;
            "    
            >    
            
            <div class="imageContact">
              <img src="imagens/zap.png" />
            </div>
            <div class="textInContainerContact">
            
            <h2 style="text-align: center;">
        
                WHATSAPP:  
            </h2>
            <h3 style="text-align: center;">
            +55 (88) 99744-6106
            </h3>
            
            </div>
            
            </div>
                
            </div>
        </div>
            
             <div class="myContact" onclick="openEmail()"            >   
            
            <div class="allHiddenSkill" style="margin:0;">
            
         
            
            <div class="inContainerSkill"
            style="
            margin:0;
            justify-content: center;
            justify-items: center;
            align-content: flex-end;
            align-items: center;
            "    
            >    
              
            <div class="imageContact">
              <img src="imagens/mail.png" />
            </div>
            <div class="textInContainerContact">
            
            <h2 style="text-align: center;">
        
               EMAIL:
            </h2>
            <h3 style="text-align: center;">
            dalton.gomes@aluno.ufca.edu.br
            </h3>
            
            </div>
                
            </div>
            
            </div>
                
            </div>
        </div>
        </div>
            
        <div class="smallContainerC" style="width: 100;height: 80vh;flex-direction: column;margin-bottom: 10%;margin-top: 0;">
            <div class="alert">A EMAIL HAS BEEN SENT TO YOU</div>
            <div class="emailForm">
                <h1>TALK TO ME</h1>
				
                <form id="myForm" method="POST">
				
					<input type="text" id="yourEmail" name="emailAddress" placeholder="youremail@gmail.com" required>
					<input type="text" id="yourName" name="nameCompany" placeholder="Your name here" required>
                    <textarea name="emailText" id="yourText" placeholder="Type your email here." required ></textarea>
                    <input onclick="showAlert()" type="submit" id="mySubmit" value="SEND TO MY EMAIL">
                        
                </form>
            </div>
            
        </div>
            </div>
        
        
        
     
        
            <div id="animation"></div>

        <script>
            
       
          
            function change(item){
                
                let shut = document.body.getElementsByClassName("textAbout");
                
                for(let i=0;i<shut.length;i++){
                    shut[i].style.transform = "translateY(100vh)";
                }
                
                let about = document.body.getElementsByClassName("textAbout")[item-1];
                about.style.transform = "translateY(0)";
            }
            
            function openPreview(){
                window.open("https://htmlpreview.github.io/?https://github.com/dalton02/raycasting/blob/main/pagina.html");
            }
            function openZap(){
                window.open("https://wa.me/5588997446106");
            }
            function openEmail(){
				let body = document.body,
				html = document.documentElement;

				let height = Math.max( body.scrollHeight, body.offsetHeight, 
                html.clientHeight, html.scrollHeight, html.offsetHeight );
				window.scrollTo(0, height);
            }
			
			function showAlert(){
				let alerta = document.getElementsByClassName("alert")[0];
				alerta.style.clipPath="polygon(0 0, 100% 0, 100% 100%, 0 100%)";
				alerta.style.opacity = 1;
				setTimeout(removeAlert, 5000);
			}
            function removeAlert(){
				let alerta = document.getElementsByClassName("alert")[0];
				alerta.style.opacity = 0;			
				alerta.style.clipPath="polygon(50% 0, 50% 0, 50% 100%, 50% 100%)";	
				}
	
        </script>
        
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        <script>
		
		$(document).ready(function(){
			
			$("form").submit(function(event){
				event.preventDefault()
				let email = document.getElementById("yourEmail").value
				let texto = document.getElementById("yourText").value
				let name = document.getElementById("yourName").value
				
				console.log(texto)
				$.post("sendMail.php",{emailText:texto,emailAddress:email,nameCompany:name},function(data){
					
				})
				
			})
			
		})
		
		
		</script>
		
		<script src="style.js" refer></script>
        
    </body>
</html>



