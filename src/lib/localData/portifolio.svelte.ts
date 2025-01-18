import { base } from "$app/paths";


export type lang = "PT-BR" | "EN-US" | "IT-IT"

class InfoPortfolio{

    PTUSAIT(portugues:string,ingles:string,italiano:string,){
        if(this.language==="PT-BR")
            return portugues
        if(this.language==="EN-US")
            return ingles
        if(this.language==="IT-IT")
            return italiano
    }

    language = $state<lang>("PT-BR");
    
    programming = ["php","java","docker","react","svelte","typescript","go"]

    tools = ["jest","nestjs"]

    countrys = $derived([
        {
            icon:"br",
            value:"100",
            status:this.PTUSAIT("Natural","Natural","")
        },
        {
            icon:"it",
            value:"20",
            status:this.PTUSAIT("Iniciante","Begineer","")
        },
        {
            icon:"us",
            value:"90",
            status:this.PTUSAIT("Proeficiente","Expert","")        }
    ])

    habilitys = $derived([
        {
        title: "Manipulação de banco de dados e otimização de recursos",
        desc: "Desenvolvimento, manutenção e otimização de bancos de dados relacionais utilizando PostgreSQL e Prisma. Foco em melhorar a eficiência e a performance das aplicações por meio de consultas e estruturas de dados otimizadas.",
        icon: "c++"
    },
    {
        title: "Desenvolvimento de aplicações Web",
        desc: "Desenvolvimento de aplicações Web com foco em Single Page Applications (SPA), Server-Side Rendering (SSR) e Multi-Page Applications (MPA), usando SvelteKit, React e Tailwind CSS para criar interfaces rápidas, dinâmicas e responsivas.",
        icon: "svelte"
    },
    {
        title: "Programação Orientada a Objetos",
        desc: "Proficiente em aplicar conceitos de programação orientada a objetos para construir soluções de software modulares, reutilizáveis e de fácil manutenção.",
        icon: "java"
    },
    {
        title: "Desenvolvimento de Backend",
        desc: "Gestão do desenvolvimento de backend com foco em escalabilidade e confiabilidade, utilizando NestJS para entregar soluções de software de alta qualidade.",
        icon: "post2"
    },
    {
        title: "Liderança de Equipe",
        desc: "Experiência em liderar equipes multifuncionais de desenvolvedores e designers, promovendo a execução bem-sucedida de projetos e garantindo a entrega de soluções escaláveis e de longo prazo.",
        icon: "node2"
    },
    {
        title: "Resolução de Problemas e Depuração",
        desc: "Habilidades comprovadas em identificar e resolver problemas complexos em software, além de depurar e testar soluções de alto desempenho com atenção aos detalhes.",
        icon: "go"
    },
    {
        title: "Comunicação Eficaz",
        desc: "Capacidade de comunicação eficaz com membros da equipe e stakeholders, facilitando a colaboração e garantindo o alinhamento em todos os estágios do projeto.",
        icon: "go"
    }])

    menuList = $derived([
        {
            label: this.language=="PT-BR" ? "Sobre" :"About",
        },
        {
            label: this.language=="PT-BR" ? "Habilidades" :"Skills",
        },
        {
            label: this.language=="PT-BR" ? "Carreira" :"Career",
        },
        {
            label: this.language=="PT-BR" ? "Projetos" :"Projects",
        },
    ])

    about = $derived(
        {
            name: "Dalton Gomes Lobato",
            role: this.language=="PT-BR" ? "Desenvolvedor FullStack": "FullStack Engineer",
            age: 21,
        }
    )

    projects = $derived([
        {
            name:"UFCHAT",
            about:this.PTUSAIT(`Projeto institucional para publicação de noticias para com estudantes da Universidade Federal do Cariri, embutido com um
            web-scrapper para seleção de editais e noticias revelantes sobre a instituição`,`Institutional project to publish news for students at the 
            Federal University of Cariri, embedded with a
            web-scrapper for selecting public notices and relevant news about the institution`,``),
            img:`${base}/images/ufchat1.png`,
            tags: ["Svelte 5","Golang","TypeScript"],
            link:"https://github.com/dalton02/UFCHAT"  
                      
        },

        {
            name:"RayCaster",
            about:this.PTUSAIT(`Pequeno experimento feito no inicio dos meus estudos de javascript, basicamente uma replica de como funcionava os gráficos do famoso
            jogo DOOM, onde é criado uma ilusão do 3D atravez de diversos raios que representam a visão do jogador`,`A little experiment I did at the beginning of my javascript studies, basically a replica of how the graphics of the famous
            DOOM game, where an illusion of 3D is created through various rays that represent the player's vision.`,""),
            img:`${base}/images/ray.png`,
            tags: ["Javascript","HTML5"],
            link:"https://github.com/dalton02/Raycasting?tab=readme-ov-file"  
                      
        },
        {
            name:"3D MOTOR ENGINE",
            about:this.PTUSAIT(`Motor 3D desenvolvido do zero, um pequeno estudo feito usando manipulação de matrizes 4D para traduzir um
            ambiente com vetores 3D para uma tela 2D.`,`A 3D engine from scratch, a small study using 4D matrix manipulation to translate an
            environment with 3D vectors to a 2D screen.`,""),
            img:`${base}/images/3d.png`,
            tags: ["C++","SDL2"],
            link:"https://github.com/dalton02/3D-Engine"  
                      
        },
        {
            name:"32-BIT CPU",
            about:this.PTUSAIT(`Circuito de um processador implementado no Logisim seguindo uma arquitetura de 32 BITS, 
            feito com uma arquitetura de pipelines para aprimorar a velocidade e controle de fluxo de instruções, suas instruções são geradas por um codigo python convertido para binario`,`The Logisim-implemented circuit embodies vital components intricately linked to craft a robust 32-bits 
            processor architecture. These components collaboratively facilitate instruction execution. Leveraging pipeline circuits, instructions are 
            segmented, enhancing code performance by segregating each operation's execution phase.`,""),
            img:`${base}/images/circuito.png`,
            tags: ["Python","Logisim"],
            link:"https://github.com/dalton02/CPU-32BITS"  
        },

        {
            name:"Licor FrameWork",
            about:this.PTUSAIT(`Pequeno framework criado em golang baseado em net/http, o mesmo segue as práticas de modulos e padronização de mensagens HTTP
            seguidas pelo framework nest.js do mundo do typescript, contendo validações JSON e um pacote de utilitarios.`,`Small framework created in golang based on net/http, it follows the practices of modules and standardization of HTTP messages
            messaging practices followed by the nest.js framework from the typescript world, containing JSON validations and a package of utilities.`,""),
            img:`${base}/images/qiwi.webp`,
            tags: ["Golang"],
            link:"https://www.linkedin.com/in/dalton-gomes/"  
        },
        
    ])

    jobs = $derived(
        [
            {
                icon: `${base}/icons/pinaculo.svg`,    
                name: "Pinaculo Digital",
                role:  this.language=="PT-BR" ? "Desenvolvedor FullStack" : "FullStack Engineer",
                about: this.PTUSAIT(
                `Responsável pelo desenvolvimento de aplicações web, das quais minhas responsabilidades incluíam desde a criação de Progressive Web Apps (PWA) e Multi-Page Applications (MPA) utilizando frameworks como SvelteKit e Next.js,  como a arquitetura e implementação de endpointes utilizando o NestJS, garantindo que as APIs atendam às necessidades de integração e escalabilidade dos projetos, e a configuração e esquematização de banco de dados.`,
                `Responsible for the development of web applications, my responsibilities included the creation of Progressive Web Apps (PWA) and Multi-Page Applications (MPA) using frameworks such as SvelteKit and Next.js, the architecture and implementation of endpoints using NestJS, ensuring that the APIs met the integration and scalability needs of the projects, and the configuration and schematization of databases.`,
                ""), 
                background: "#ED0C32"
            },
            {
                icon: `${base}/images/dti.webp`,
                name: this.PTUSAIT("Departamento da Tecnologia da Informação","Department of Information Technology",""),
                role:   this.PTUSAIT("Estágiario","Intern",""),
                about: this.PTUSAIT("Responsável por atender chamados técnicos pelo campus da UFCA, tal como auxiliava na manutenção e instalação do cabeamento de internet.",
                "Responsible for answering technical calls on the UFCA campus, as well as helping with the maintenance and installation of internet cabling.",""),
                background: "#039BE5"
            },
            ]
    )

    skillsSubText = $derived.by(()=>{
        switch(this.language){
          case "PT-BR":
            return {
              buttons:["Criação","Ferramentas","Estrangeiras"],
              aboutEach:[
              `Na busca por desenvolver sistemas eficientes, não só da linguagem e do framework á de se prover qualidade de software,
              com isso em mente, em todos os projetos sigo as boas práticas de desenvolvimento e padrões de arquitetura que trazem estabilidade,
              rápido desenvolvimento e de facil manutenção. Alguns dos quais utilizo com frequência e já tive o prazer de fazer uma leitura aprofundada sobre:`
              ,
              `Uma parte mais curiosa sobre quais ferramentas eu utilizo,seja de teste ou de terceiros, para testes no backend principalmente usando typescript
              ,utilizo do vitest para as aplicações frontend, quanto ao backend gosto do pacote utilitario da linguagem Golang (a favorita do autor), em meus 
              projetos typescript utilizo o bom e velho jester.`
              ,
              `Desde criança sempre estudei e pratiquei a conversação do meu inglês, ultimamente tenho lido o livro "Italiano para Leigos" e ando
              pondo em práticas conversações rotineiras e simples para aprimorar meu vocabulario, por hora está indo bem`]
            };
          case "EN-US":
            return {
              buttons:["Creation","WorkTools","Foreign Languages"],
              aboutEach:[`In the quest to develop efficient systems, it's not just about the language and framework, it's about providing software quality,
              With this in mind, in all projects I follow good development practices and architecture patterns that bring stability,
              rapid development and easy maintenance. Some of these I use frequently and have had the pleasure of reading about in depth:`,
              `I'm more curious about which tools I use, whether testing or third-party, for backend testing mainly using typescript
              I use vitest for frontend applications, for the backend I like the Golang language utility package (the author's favorite), for my 
              typescript projects I use the good old jester.`,
              `Since I was a child I've always studied and practiced conversational English. Lately I've been reading the book “Italian for Dummies” and I've been
              practicing routine and simple conversations to improve my vocabulary.`]
            };
          case "IT-IT":
            return {
              buttons:["Creation","WorkTools","Foreign Languages"],
              aboutEach:["","",""]
            }
        }
      })

}
const infoPortfolio = new InfoPortfolio();
export default infoPortfolio;

