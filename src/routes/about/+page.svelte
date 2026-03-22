<script lang="ts">
  import AboutSkill from "$lib/comps/AboutSkill.svelte";
  import SvgTech from "$lib/comps/SvgTech.svelte";
  import TimeLine from "$lib/comps/TimeLine.svelte";
  import Title from "$lib/comps/Title.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import { addDays } from "date-fns";

  const titles = {
    intro: new Text({
      enUs: "About-me",
      ptBr: "Sobre",
    }),
    tech: new Text({
      enUs: "Technologies",
      ptBr: "Tecnologias",
    }),

    skills: new Text({
      enUs: "Skills",
      ptBr: "Habilidades primárias",
    }),

    timeline: new Text({
      enUs: "Work timeline",
      ptBr: "Experiência",
    }),

    education: new Text({
      enUs: "Education",
      ptBr: "Educação",
    }),
  };

  const hello = new Text({
    enUs: "👋 Hi, I'm",
    ptBr: "👋 Olá, meu nome é",
  });

  const catchPhrase = new Text({
    enUs: "Transforming ideas into production-ready systems that connect the world.",
    ptBr: "Transformando ideias em sistemas resilientes prontos para encarar o mundo.",
  });

  const paragraph = new Text({
    ptBr: `Durante minha jornada, pude entregar uma variedade de produtos,
    desde sistemas CRUD simples, CRM, WhiteLabel, até serviços voltados para IA, processamento de pipelines RAG, integração de chatbots.
    <br/>
    Trabalhei com múltiplas tecnologias e cenários, enfrentando muitos desafios ao longo do caminho, me construindo
    não apenas como um bom desenvolvedor, mas como alguém que sabe projetar o futuro da sua aplicação.`,
    enUs: `The road so far, I have been able to provide a variety of products,
    from simple CRUD systems, CRM, WhiteLabel, to AI oriented services, like RAG pipeline processing, integrating chatbots.
    <br/>
    I've worked across multiple technologies and scenarios, facing many challenges along my way, building myself
    not just as a good developer, but someone who can design and project the future of your application.

`,
  });
  const skillBack = {
    desc: new Text({
      enUs: "Proficiency in handling high-concurrency systems and keeping them resilient and scalable.",
      ptBr: "Proeficiência em lidar com sistemas de alta concorrência e mantê-los resilientes e escaláveis.",
    }),
    title: new Text({
      enUs: "Concurrent Systems",
      ptBr: "Sistemas escaláveis e concorrentes",
    }),
  };
  const skillFront = {
    desc: new Text({
      enUs: "Full-stack development using the JavaScript ecosystem, framework-agnostic and focused on scalable, maintainable solutions.",
      ptBr: "Desenvolvimento full-stack com ecossistema JavaScript, agnóstico a frameworks e focado em soluções escaláveis e de fácil manutenção.",
    }),
    title: new Text({
      enUs: "JavaScript Ecosystem",
      ptBr: "Ecossistema JavaScript",
    }),
  };
  const educationUniversity = {
    desc: new Text({
      enUs: "Juazeiro do Norte - CE",
      ptBr: "Juazeiro do Norte - CE",
    }),
    title: new Text({
      enUs: "Federal University Of Cariri",
      ptBr: "Universidade Federal do Cariri",
    }),
    subtitle: new Text({
      enUs: "Major in Computer Science",
      ptBr: "Graduação em Ciência da Computação",
    }),
  };

  const timeline = [
    {
      desc: new Text({
        enUs: "FullStack Developer",
        ptBr: "Desenvolver Fullstack",
      }).value,
      title: "Pináculo Digital",
      from: new Date("2024-09-22T14:21:36+00:00"),
      to: addDays(new Date(), 100),
      timestamp: new Date(),
    },
    {
      desc: "Tech Lead",
      title: "Calang.io",
      from: new Date("2025-02-22T14:21:36+00:00"),
      to: new Date("2025-12-22T14:21:36+00:00"),
      timestamp: new Date(),
    },
    {
      desc: new Text({
        enUs: "FullStack Developer",
        ptBr: "Trainee",
      }).value,
      title: "Pináculo Digital",

      from: new Date("2024-06-22T14:21:36+00:00"),
      to: new Date("2024-09-22T14:21:36+00:00"),
      timestamp: new Date(),
    },
  ];
</script>

<div class="flex flex-col w-full gap-12 pt-10 h-full items-center">
  <Title title={titles.intro.value} />
  <div
    class="max-w-[1102px] flex flex-col not-lg:px-5 lg:grid w-full grid-cols-10 gap-10 grow"
  >
    <div class="flex flex-col gap-5 h-full z-10 col-span-5">
      {@render title("Introdução")}
      <div class="flex flex-col">
        <h2 class="text-2xl leading-tight font-light text-white md:text-4xl">
          {hello.value} <b class="text-primary"> Dalton Gomes Lobato </b>
        </h2>

        <h4 class="py-5 text-xl leading-relaxed font-light text-white italic">
          {catchPhrase.value}
        </h4>
        <p
          class=" text-sm leading-relaxed font-light tracking-wide text-white/55"
        >
          {@html paragraph.value}
        </p>
      </div>
      {@render title(titles.skills.value)}
      <div class="flex flex-col gap-5">
        <AboutSkill
          desc={skillBack.desc.value}
          title={skillBack.title.value}
          subtitle=""
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg"
            class="w-8"
            alt="golang"
          />
        </AboutSkill>
        <AboutSkill
          desc={skillFront.desc.value}
          title={skillFront.title.value}
          subtitle=""
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
            class="w-5"
            alt="javascript-ecossystem"
          />
        </AboutSkill>
      </div>

      {@render title(titles.education.value)}
      <div class="flex flex-col gap-5">
        <AboutSkill
          desc={educationUniversity.desc.value}
          title={educationUniversity.title.value}
          subtitle={educationUniversity.subtitle.value}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            class="fill-primary"
            viewBox="0 0 256 256"
            ><path
              d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z"
            ></path></svg
          >
        </AboutSkill>
      </div>
    </div>
    <div class="flex flex-col h-full z-10 col-span-5 gap-1">
      {@render title(titles.tech.value)}
      <div class="grid grid-cols-4 lg:grid-cols-6 gap-5 mt-4 ml-2 mb-8">
        <SvgTech url="typescript/typescript-original.svg" name="Typescript" />
        <SvgTech url="go/go-original-wordmark.svg" name="Golang" />
        <SvgTech url="python/python-original.svg" name="Python" />
        <SvgTech url="java/java-original.svg" name="Java" />
        <SvgTech url="csharp/csharp-original.svg" name="C#" />
        <SvgTech url="docker/docker-original.svg" name="Docker" />
        <SvgTech url="postgresql/postgresql-original.svg" name="PostgreSQL" />
        <SvgTech url="redis/redis-original.svg" name="Redis" />
        <SvgTech url="mongodb/mongodb-original.svg" name="MongoDB" />
        <SvgTech url="rabbitmq/rabbitmq-original.svg" name="RabbitMQ" />
        <SvgTech url="apachekafka/apachekafka-original.svg" name="Kafka" />
        <SvgTech url="linux/linux-original.svg" name="Linux" />
      </div>
      {@render title(titles.timeline.value)}
      <div class="mt-4">
        <TimeLine {timeline} />
      </div>
    </div>
    <div class="h-10 w-full"></div>
  </div>
</div>

{#snippet title(text: string)}
  <span class="text-xs tracking-wide text-white/55">{text.toUpperCase()}</span>
{/snippet}
