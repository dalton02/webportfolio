<script lang="ts">
  import z from "zod";
  import Button from "$lib/comps/Button.svelte";
  import globalState from "$lib/utils/global.svelte";
  import Icon from "$lib/comps/Icon.svelte";
  import Input from "$lib/comps/Input.svelte";
  import SectionHeading from "$lib/comps/SectionHeading.svelte";
  import { Text } from "$lib/utils/lang.svelte";
  import { reveal } from "$lib/utils/reveal.js";
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = Object.fromEntries(Object.entries(ui.contact).map(([k, v]) => [k, new Text(v)])) as Record<
    keyof typeof ui.contact,
    Text
  >;
  const { email, whatsapp } = ui.links;
  const [emailUser, emailDomain] = email.split("@");
  const resume = new Text(ui.links.resume);

  let validation = $derived(
    z.object({
      name: z.string().min(4, { message: t.nameError.value }),
      message: z.string().min(10, { message: t.messageError.value }),
    }),
  );

  let form = $state({ name: "", message: "" });
  let copied = $state(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
      setTimeout(() => (copied = false), 1800);
    } catch (_) {}
  }

  function submitEmail() {
    if (!validation.safeParse(form).success) return;
    const subject = new Text({
      ptBr: `Contato de ${form.name}`,
      enUs: `Contact of ${form.name}`,
    }).value;
    const body = new Text({
      ptBr: `${form.message}\n\n---\nNome: ${form.name}`,
      enUs: `${form.message}\n\n---\nName: ${form.name}`,
    }).value;
    window.open(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_blank",
    );
  }

  function submitWhats() {
    if (!validation.safeParse(form).success) return;
    const text = new Text({
      ptBr: `Olá meu nome é ${form.name},\n${form.message}`,
      enUs: `Hi there, my name is ${form.name}, \n ${form.message}`,
    }).value;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  }

  const channels = [
    { icon: "whatsapp", label: "WhatsApp", value: ui.links.whatsappLabel, href: `https://wa.me/${whatsapp}` },
    { icon: "linkedin", label: "LinkedIn", value: ui.links.linkedinLabel, href: ui.links.linkedin },
    { icon: "github", label: "GitHub", value: ui.links.githubLabel, href: ui.links.github },
  ] as const;
</script>

<section id="contact" class="relative overflow-hidden py-28 sm:py-36">
  <div
    class="pointer-events-none absolute inset-x-0 bottom-0 h-[520px]"
    style="background: radial-gradient(ellipse 55% 60% at 50% 100%, rgb(232 116 74 / 0.10), transparent 70%);"
    aria-hidden="true"
  ></div>

  <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
    <SectionHeading index={4} title={t.heading.value} />

    <h2
      class="headline -mt-4 max-w-4xl font-display font-soft text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] font-light tracking-[-0.03em] text-sand"
      use:reveal
    >
      {@html t.headline.value}
    </h2>
    <p class="mt-8 max-w-xl text-[17px] leading-relaxed text-dust" use:reveal={1}>
      {t.availability.value}
    </p>

    <div class="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <div class="flex flex-col gap-3 lg:col-span-5" use:reveal>
        <span class="mb-2 font-mono text-[12px] tracking-[0.16em] text-dust uppercase">{t.channels.value}</span>

        <div class="group flex items-center gap-3 rounded-2xl border border-line bg-surface/60 p-4 backdrop-blur-sm transition-colors sm:gap-4 sm:p-5 duration-300 hover:border-clay/40">
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-11 sm:w-11 bg-clay/10 text-clay">
            <Icon name="mail" class="h-5 w-5" />
          </span>
          <a href="mailto:{email}" class="flex min-w-0 flex-1 flex-col">
            <span class="font-mono text-[11px] tracking-[0.14em] text-dust uppercase">Email</span>
            <!-- breaks before the "@" on narrow screens instead of cutting the address -->
            <span class="text-[14px] break-words text-sand transition-colors group-hover:text-clay sm:text-[15px]">
              {emailUser}<wbr />@{emailDomain}
            </span>
          </a>
          <button
            type="button"
            onclick={copyEmail}
            class="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-dust transition-colors hover:border-clay/50 hover:text-sand"
            aria-label={t.copy.value}
          >
            <Icon name={copied ? "check" : "copy"} class="h-3.5 w-3.5 {copied ? 'text-clay' : ''}" />
            <span class="hidden sm:inline">{copied ? t.copied.value : t.copy.value}</span>
          </button>
        </div>

        <a
          href="{globalState.basePath}/{resume.value}"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 rounded-2xl border border-line bg-surface/40 p-4 transition-colors duration-300 hover:border-clay/40 hover:bg-surface/70 sm:gap-4 sm:p-5"
        >
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-11 sm:w-11 bg-sun/10 text-sun">
            <Icon name="download" class="h-[18px] w-[18px]" />
          </span>
          <span class="flex flex-1 flex-col">
            <span class="font-mono text-[11px] tracking-[0.14em] text-dust uppercase">{t.resume.value}</span>
            <span class="text-[15px] text-sand">{t.resumeValue.value}</span>
          </span>
          <Icon
            name="arrow"
            class="h-4 w-4 text-dust transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-clay"
          />
        </a>

        {#each channels as c (c.label)}
          <a
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-3 rounded-2xl border border-line bg-surface/40 p-4 transition-colors duration-300 hover:border-clay/40 hover:bg-surface/70 sm:gap-4 sm:p-5"
          >
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-11 sm:w-11 bg-ink/70 text-dust transition-colors group-hover:text-sand">
              <Icon name={c.icon} class="h-[18px] w-[18px]" />
            </span>
            <span class="flex flex-1 flex-col">
              <span class="font-mono text-[11px] tracking-[0.14em] text-dust uppercase">{c.label}</span>
              <span class="text-[15px] text-sand">{c.value}</span>
            </span>
            <Icon
              name="arrow"
              class="h-4 w-4 text-dust transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-clay"
            />
          </a>
        {/each}
      </div>

      <div class="lg:col-span-7" use:reveal={1}>
        <div class="rounded-3xl border border-line bg-surface/70 p-6 backdrop-blur-md sm:p-9">
          <span class="mb-7 block font-mono text-[12px] tracking-[0.16em] text-dust uppercase">{t.form.value}</span>
          <form
            class="flex flex-col gap-4"
            onsubmit={(e) => {
              e.preventDefault();
              const action = (e.submitter as HTMLButtonElement | null)?.value;
              if (action === "email") submitEmail();
              else submitWhats();
            }}
          >
            <Input
              bind:value={form.name}
              validation={validation.shape.name}
              label={t.name.value}
              placeholder={t.namePlaceholder.value}
            />
            <Input
              kind="textarea"
              bind:value={form.message}
              validation={validation.shape.message}
              label={t.message.value}
              placeholder={t.messagePlaceholder.value}
            />
            <div class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button type="submit" value="whats">
                <Icon name="whatsapp" class="h-4 w-4" />
                {t.sendWhats.value}
              </Button>
              <Button type="submit" value="email" variant="ghost">
                <Icon name="mail" class="h-4 w-4" />
                {t.sendEmail.value}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .headline :global(em) {
    font-style: italic;
    color: var(--color-clay);
  }
</style>
