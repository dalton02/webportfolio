<script lang="ts">
  import Button from "$lib/comps/Button.svelte";
  import Input from "$lib/comps/Input.svelte";
  import Title from "$lib/comps/Title.svelte";
  import globalState from "$lib/utils/global.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import z from "zod";

  let validation = $state(
    z.object({
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
    name: "",
    message: "",
  });

  let copied = $state(false);
  const email = "daltongomeslobato@gmail.com";

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
      setTimeout(() => (copied = false), 1800);
    } catch (_) {}
  }

  function submitEmail() {
    const v = validation.safeParse(form);
    if (!v.success) return;

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

    window.open(mailtoLink, "_blank");
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

<div class="relative flex h-full w-full flex-col items-center overflow-y-auto px-5 pt-10 lg:pt-16 scroll-bar">
  <div
    class="pointer-events-none absolute inset-x-0 top-0 h-[400px] opacity-60"
    aria-hidden="true"
    style="background: radial-gradient(ellipse at 50% 0%, rgba(140,199,196,0.08), transparent 60%);"
  ></div>

  <div class="relative flex w-full max-w-5xl flex-col items-center">
    <Title title={new Text({ enUs: "HIRE-ME", ptBr: "CONTATE-ME " }).value} />

    <p
      class="mx-auto mt-8 mb-10 max-w-xl text-center text-sm font-light leading-relaxed tracking-wide text-white/60"
    >
      {@html new Text({
        enUs: `I'm open to full-time, part-time, and freelance opportunities. <br/>Feel free to reach out—I'd love to connect and discuss how we can work together.`,
        ptBr: `Estou aberto a oportunidades full-time, part-time e freelas. <br/> Fique à vontade para entrar em contato, adoraria conversar e alinhar como podemos trabalhar juntos.`,
      }).value}
    </p>

    <div class="grid w-full gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
      <aside class="flex flex-col gap-3">
        <div class="mb-1 flex items-center gap-2">
          <span class="h-px w-6 bg-primary"></span>
          <p class="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {new Text({ enUs: "Direct Channels", ptBr: "Canais Diretos" }).value}
          </p>
        </div>

        <button
          type="button"
          onclick={copyEmail}
          class="group flex items-center gap-4 rounded-xl border border-white/5 bg-secondary/70 p-4
          text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30
          hover:bg-secondary hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
        >
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg
            border border-primary/20 bg-primary/5 transition-colors duration-300
            group-hover:border-primary/40 group-hover:bg-primary/10"
          >
            <img src="{globalState.basePath}/gmail.svg" class="w-6" alt="" />
          </span>
          <span class="flex min-w-0 flex-1 flex-col">
            <span class="text-[11px] font-medium uppercase tracking-wider text-white/45">
              Email
            </span>
            <span class="truncate text-sm font-medium text-egg/90">{email}</span>
          </span>
          <span class="text-xs font-medium text-primary/80 transition-opacity duration-300">
            {copied
              ? new Text({ enUs: "Copied!", ptBr: "Copiado!" }).value
              : new Text({ enUs: "Copy", ptBr: "Copiar" }).value}
          </span>
        </button>

        <a
          href="https://wa.me/5588997446106"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-4 rounded-xl border border-white/5 bg-secondary/70 p-4
          transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30
          hover:bg-secondary hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
        >
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg
            border border-primary/20 bg-primary/5 transition-colors duration-300
            group-hover:border-primary/40 group-hover:bg-primary/10"
          >
            <img src="{globalState.basePath}/whatsapp.svg" class="w-5" alt="" />
          </span>
          <span class="flex flex-1 flex-col">
            <span class="text-[11px] font-medium uppercase tracking-wider text-white/45">
              WhatsApp
            </span>
            <span class="text-sm font-medium text-egg/90">+55 88 99744-6106</span>
          </span>
          <svg
            class="h-4 w-4 text-primary/70 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

        <a
          href="https://www.linkedin.com/in/dalton-gomes/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-4 rounded-xl border border-white/5 bg-secondary/70 p-4
          transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30
          hover:bg-secondary hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
        >
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg
            border border-primary/20 bg-primary/5 transition-colors duration-300
            group-hover:border-primary/40 group-hover:bg-primary/10"
          >
            <img
              src="{globalState.basePath}/linkedin-svgrepo-com.svg"
              class="w-5"
              alt=""
            />
          </span>
          <span class="flex flex-1 flex-col">
            <span class="text-[11px] font-medium uppercase tracking-wider text-white/45">
              LinkedIn
            </span>
            <span class="text-sm font-medium text-egg/90">dalton-gomes</span>
          </span>
          <svg
            class="h-4 w-4 text-primary/70 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

        <a
          href="https://github.com/dalton02"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-4 rounded-xl border border-white/5 bg-secondary/70 p-4
          transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30
          hover:bg-secondary hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
        >
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg
            border border-primary/20 bg-primary/5 transition-colors duration-300
            group-hover:border-primary/40 group-hover:bg-primary/10"
          >
            <svg
              class="h-5 w-5 text-egg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.19a11.1 11.1 0 015.79 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.35.77 1.04.77 2.11v3.13c0 .31.21.67.8.55C20.22 21.38 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z"
              />
            </svg>
          </span>
          <span class="flex flex-1 flex-col">
            <span class="text-[11px] font-medium uppercase tracking-wider text-white/45">
              GitHub
            </span>
            <span class="text-sm font-medium text-egg/90">@dalton02</span>
          </span>
          <svg
            class="h-4 w-4 text-primary/70 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </aside>

      <div
        class="relative rounded-2xl border border-white/5 bg-secondary/60 p-6 backdrop-blur-sm
        shadow-[0_8px_30px_rgba(0,0,0,0.25)] lg:p-8"
      >
        <div class="mb-5 flex items-center gap-2">
          <span class="h-px w-6 bg-primary"></span>
          <p class="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {new Text({ enUs: "Send a Message", ptBr: "Envie uma Mensagem" }).value}
          </p>
        </div>

        <form
          class="flex w-full flex-col gap-5"
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
            kind="textarea"
            bind:value={form.message}
            validation={validation.shape.message}
            label={new Text({ enUs: "Message", ptBr: "Mensagem" }).value}
            placeholder={new Text({
              enUs: "Type your message here",
              ptBr: "Escreva sua mensagem aqui",
            }).value}
          />
          <div class="grid items-center gap-3 pt-1 lg:grid-cols-2">
            <Button kind="form" theme="primary" value="whats" action={() => {}}>
              <div class="flex items-center justify-center gap-2">
                {new Text({
                  enUs: "Send to Whatsapp",
                  ptBr: "Enviar para Whatsapp",
                }).value}
                <img
                  src="{globalState.basePath}/whatsapp.svg"
                  class="w-4.5"
                  alt=""
                />
              </div>
            </Button>
            <Button kind="form" theme="secondary" value="email" action={() => {}}>
              <div class="flex items-center justify-center gap-2">
                {new Text({ enUs: "Send to Email", ptBr: "Enviar para Email" })
                  .value}
                <img src="{globalState.basePath}/gmail.svg" class="w-6" alt="" />
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
    <div class="h-12"></div>
  </div>
</div>

<style>
  .scroll-bar::-webkit-scrollbar {
    width: 6px;
  }
  .scroll-bar::-webkit-scrollbar-track {
    background: transparent;
  }
  .scroll-bar::-webkit-scrollbar-thumb {
    background-color: var(--color-terciary);
    border-radius: 10px;
  }
</style>
