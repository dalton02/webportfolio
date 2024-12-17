class InfoPortfolio{


    language = $state("PT-BR");


programming = ["php","java","docker","react","svelte","typescript"]
tools = ["jest","nestjs"]
countrys = $derived([
    {
        icon:"br",
        value:"100",
        status:this.language==="PT-BR" ? "Natural" : "Natural"
    },
    {
        icon:"it",
        value:"20",
        status:this.language==="PT-BR" ? "Iniciante" : "Beginner"
    },
    {
        icon:"us",
        value:"90",
        status:this.language==="PT-BR" ? "Proeficiente" : "Expert"
    }
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
            status: this.language=="PT-BR" ? "Disponivel" : "Avaliable",
            tags: ["Svelte 5","Golang","TypeScript"],
            features: this.language ==="PT-BR"  ? 
            ["Editor de Markdown","Sistema de pesquisa avançado","Página interativa UI/UX"]
            :
            ["Markdown Editor","Advanced Search System","UI/UX Interactive WebPage"],
            link:"https://github.com/dalton02/UFCHAT"  
                      
        },
        {
            name:"ChatBot",
            status: this.language=="PT-BR" ? "Disponivel" : "Avaliable",
            tags: ["React","PHP","TypeScript"],
            features: this.language ==="PT-BR"  ? 
            ["Sistema de Chatbot para busca de conteudo"]  
            :
            ["Advanced ChatBot System"],
            link:"https://github.com/dalton02/UFCHAT"  
                      
        }
    ])

    jobs = $derived(
        [
            {
                icon: "/icons/pinaculo.svg",    
                name: "Pinaculo Digital",
                role:  this.language=="PT-BR" ? "Desenvolvedor FullStack" : "FullStack Engineer",
                about: this.language=="PT-BR" ? 
                    "Especializa-se no desenvolvimento de aplicações web robustas com expertise tanto em tecnologias front-end quanto back-end. Apaixonado por criar soluções escaláveis e otimizar experiências de usuário usando frameworks e ferramentas modernas."
                    :"Specializes in developing robust web applications with expertise in both front-end and back-end technologies. Passionate about building scalable solutions and optimizing user experiences using modern frameworks and tools.",
                background: "#ED0C32"
            },
            {
                icon: "/icons/facebook.svg",
                name: "Facebook .Inc",
                role:   this.language=="PT-BR" ? "Engenheiro DevOps" : "DevOps Engineer",
                about: this.language=="PT-BR" ? "Sim eu trabalhei no facebook" : "I know engineer",
                background: "#039BE5"
            },
            {
                icon: "/icons/facebook.svg",
                name: "Facebook .Inc",
                role:   this.language=="PT-BR" ? "Engenheiro DevOps" : "DevOps Engineer",
                about: this.language=="PT-BR" ? "Eu sabo engenhar" : "I know engineer",
                background: "#039BE5"
            },
            ]
    )

}
const infoPortfolio = new InfoPortfolio();
export default infoPortfolio;

