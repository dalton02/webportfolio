<script lang="ts">
  import AboutSkill from "$lib/comps/AboutSkill.svelte";
  import SvgTech from "$lib/comps/SvgTech.svelte";
  import TimeLine from "$lib/comps/TimeLine.svelte";
  import Title from "$lib/comps/Title.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import { addDays } from "date-fns";

  const titles = {
    intro: new Text({
      enUs: "Introduction",
      ptBr: "Introdução",
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
    enUs: `The road so far, I have been able to provide a variety of products, from CRUD systems
    , CRM, WhiteLabel, to AI oriented services. I've worked across the full stack, building real-time systems and scalable microservices with clean code and best practices. 
    Whether it's AI integration or cloud infrastructure, I'm always looking to deliver quality. 
    At the end of the day, I enjoy turning complex problems into reliable products.`,
    ptBr: `The road so far, I have been able to provide a variety of products,
    from simple CRUD systems, CRM, WhiteLabel, to AI oriented services.
    <br/>
    I've worked across multiple technologies and scenarios, facing many challenges along my way, building myself
    not just as a good developer, but someone who can design and project the future of your application.

`,
  });

  const skillBack = {
    desc: new Text({
      enUs: "Building scalable things i guess",
      ptBr: "Desenvolvimento de sistemas escalaveis e tals",
    }),
    title: new Text({
      enUs: "Backend Developer",
      ptBr: "Desenvolvedor Backend",
    }),
  };

  const skillFront = {
    desc: new Text({
      enUs: "Building scalable things i guess",
      ptBr: "Desenvolvimento de sistemas escalaveis e tals",
    }),
    title: new Text({
      enUs: "Backend Developer",
      ptBr: "Desenvolvedor Backend",
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

<div
  class="flex flex-col w-full gap-12 pt-18 h-full justify-center items-center"
>
  <Title title={titles.intro.value} />
  <div
    class="max-w-[1102px] h-full flex flex-col not-lg:px-10 lg:grid w-full grid-cols-10 gap-10 grow"
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            class="fill-primary"
            viewBox="0 0 256 256"
            ><path
              d="M196.12,128c24.65-34.61,37.22-70.38,19.74-87.86S162.61,35.23,128,59.88C93.39,35.23,57.62,22.66,40.14,40.14S35.23,93.39,59.88,128c-24.65,34.61-37.22,70.38-19.74,87.86h0c5.63,5.63,13.15,8.14,21.91,8.14,18.48,0,42.48-11.17,66-27.88C151.47,212.83,175.47,224,194,224c8.76,0,16.29-2.52,21.91-8.14h0C233.34,198.38,220.77,162.61,196.12,128Zm8.43-76.55c7.64,7.64,2.48,32.4-18.52,63.28a300.33,300.33,0,0,0-21.19-23.57A300.33,300.33,0,0,0,141.27,70C172.15,49,196.91,43.8,204.55,51.45ZM176.29,128a289.14,289.14,0,0,1-22.76,25.53A289.14,289.14,0,0,1,128,176.29a289.14,289.14,0,0,1-25.53-22.76A289.14,289.14,0,0,1,79.71,128,298.62,298.62,0,0,1,128,79.71a289.14,289.14,0,0,1,25.53,22.76A289.14,289.14,0,0,1,176.29,128ZM51.45,51.45c2.2-2.21,5.83-3.35,10.62-3.35C73.89,48.1,92.76,55,114.72,70A304,304,0,0,0,91.16,91.16,300.33,300.33,0,0,0,70,114.73C49,83.85,43.81,59.09,51.45,51.45Zm0,153.1C43.81,196.91,49,172.15,70,141.27a300.33,300.33,0,0,0,21.19,23.57A304.18,304.18,0,0,0,114.73,186C83.85,207,59.09,212.2,51.45,204.55Zm153.1,0c-7.64,7.65-32.4,2.48-63.28-18.52a304.18,304.18,0,0,0,23.57-21.19A300.33,300.33,0,0,0,186,141.27C207,172.15,212.19,196.91,204.55,204.55ZM140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"
            ></path></svg
          >
        </AboutSkill>
        <AboutSkill
          desc={skillFront.desc.value}
          title={skillFront.title.value}
          subtitle=""
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            class="fill-primary"
            viewBox="0 0 256 256"
            ><path
              d="M196.12,128c24.65-34.61,37.22-70.38,19.74-87.86S162.61,35.23,128,59.88C93.39,35.23,57.62,22.66,40.14,40.14S35.23,93.39,59.88,128c-24.65,34.61-37.22,70.38-19.74,87.86h0c5.63,5.63,13.15,8.14,21.91,8.14,18.48,0,42.48-11.17,66-27.88C151.47,212.83,175.47,224,194,224c8.76,0,16.29-2.52,21.91-8.14h0C233.34,198.38,220.77,162.61,196.12,128Zm8.43-76.55c7.64,7.64,2.48,32.4-18.52,63.28a300.33,300.33,0,0,0-21.19-23.57A300.33,300.33,0,0,0,141.27,70C172.15,49,196.91,43.8,204.55,51.45ZM176.29,128a289.14,289.14,0,0,1-22.76,25.53A289.14,289.14,0,0,1,128,176.29a289.14,289.14,0,0,1-25.53-22.76A289.14,289.14,0,0,1,79.71,128,298.62,298.62,0,0,1,128,79.71a289.14,289.14,0,0,1,25.53,22.76A289.14,289.14,0,0,1,176.29,128ZM51.45,51.45c2.2-2.21,5.83-3.35,10.62-3.35C73.89,48.1,92.76,55,114.72,70A304,304,0,0,0,91.16,91.16,300.33,300.33,0,0,0,70,114.73C49,83.85,43.81,59.09,51.45,51.45Zm0,153.1C43.81,196.91,49,172.15,70,141.27a300.33,300.33,0,0,0,21.19,23.57A304.18,304.18,0,0,0,114.73,186C83.85,207,59.09,212.2,51.45,204.55Zm153.1,0c-7.64,7.65-32.4,2.48-63.28-18.52a304.18,304.18,0,0,0,23.57-21.19A300.33,300.33,0,0,0,186,141.27C207,172.15,212.19,196.91,204.55,204.55ZM140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"
            ></path></svg
          >
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
