<script lang="ts">
  import Button from "$lib/comps/Button.svelte";
  import Input from "$lib/comps/Input.svelte";
  import Title from "$lib/comps/Title.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import z from "zod";

  let validation = $state(
    z.object({
      email: z.email({
        message: new Text({
          enUs: "Insert a valid email",
          ptBr: "Insira um email válido",
        }).value,
      }),
      name: z.string().min(4, {
        message: new Text({
          enUs: "Name must have at least 4 characters",
          ptBr: "Nome deve ter pelo menos 4 caracteres",
        }).value,
      }),
      message: z.string().min(10, {
        message: new Text({
          enUs: "Message must have at leats 10 characters",
          ptBr: "Mensagem deve ter pelo menos 10 caracteres",
        }).value,
      }),
    }),
  );

  let form = $state({
    email: "",
    name: "",
    message: "",
  });
  function submitEmail() {
    const v = validation.safeParse(form);
    if (!v.success) return;

    const email = "daltongomeslobato@gmail.com";
    const subject = new Text({
      ptBr: `Contato de ${form.name}`,
      enUs: `Contact of ${form.name}`,
    }).value;
    const body = new Text({
      ptBr: `${form.message}\n\n---\nNome: ${form.name}`,
      enUs: `${form.message}\n\n---\nName: ${form.name}`,
    }).value;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    const mailtoLink = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;

    Opcional: window.open(mailtoLink, "_blank");
  }

  function submitWhats() {
    const validationWithoutEmail = z.object({
      name: validation.shape.name,
      message: validation.shape.message,
    });
    const v = validationWithoutEmail.safeParse(form);

    if (!v.success) return;
    const text = new Text({
      ptBr: `Olá meu nome é ${form.name},\n${form.message}`,
      enUs: `Hi there, my name is ${form.name}, \n ${form.message}`,
    });
    const encoded = encodeURIComponent(text.value);
    const url = `https://wa.me/5588997446106?text=${encoded}`;
    window.open(url, "_blank");
  }
</script>

<div
  class="flex h-full w-full not-lg:px-5 pt-10 lg:pt-20 items-center flex-col"
>
  <div class="flex flex-col max-w-[500px]">
    <Title title={new Text({ enUs: "HIRE-ME", ptBr: "CONTATE-ME " }).value} />
    <p
      class="mx-auto max-w-lg text-center text-sm font-light tracking-wide text-white/55 mt-8 mb-10"
    >
      {@html new Text({
        enUs: `I'm open to full-time, part-time, and freelance opportunities. <br/>Feel free
to reach out—I'd love to connect and discuss how we can work together. <br/>You
can contact me through this form or via email:`,
        ptBr: `Estou aberto a oportunidades full-time, part-time e freelas. <br/> Fique à vontade
para entrar em contato — adoraria conversar e alinhar como podemos trabalhar juntos.<br/>
Você pode me encontrar através deste formulário ou pelo e-mail:`,
      }).value}

      <span class=" text-white/90 cursor-text select-all"
        >daltongomeslobato@gmail.com</span
      >
    </p>

    <form
      class="w-full flex flex-col gap-5"
      onsubmit={(e) => {
        e.preventDefault();
        const clickedButton = e.submitter! as HTMLButtonElement;
        const action = clickedButton.value;
        if (action === "email") {
          submitEmail();
          return;
        }
        submitWhats();
      }}
    >
      <Input
        bind:value={form.name}
        validation={validation.shape.name}
        label={new Text({ enUs: "Name", ptBr: "Nome" }).value}
        placeholder={new Text({
          enUs: "Chuck Norris",
          ptBr: "Chuck Norris",
        }).value}
      />
      <Input
        bind:value={form.email}
        validation={validation.shape.email}
        label="Email"
        placeholder={new Text({
          enUs: "example@gmail.com",
          ptBr: "exemplo@gmail.com",
        }).value}
      />
      <Input
        kind="textarea"
        bind:value={form.message}
        validation={validation.shape.message}
        label={new Text({ enUs: "Message", ptBr: "Mensagem" }).value}
        placeholder={new Text({
          enUs: "Type your message here",
          ptBr: "Escreva sua mensagem aqui",
        }).value}
      />
      <div class="grid lg:grid-cols-2 gap-4 items-center">
        <Button kind="form" theme="primary" value="whats" action={() => {}}>
          <div class="flex gap-2 justify-center items-center">
            {new Text({
              enUs: "Send to Whatsapp",
              ptBr: "Enviar para Whatsapp",
            }).value}
            <img src="whatsapp.svg" class="w-4.5" alt="" />
          </div>
        </Button>
        <Button kind="form" theme="secondary" value="email" action={() => {}}>
          <div class="flex gap-2 justify-center items-center">
            {new Text({ enUs: "Send to Email", ptBr: "Enviar para Email" })
              .value}
            <img src="gmail.svg" class="w-6" alt="" />
          </div>
        </Button>
      </div>
    </form>
    <div class="h-10"></div>
  </div>
</div>
