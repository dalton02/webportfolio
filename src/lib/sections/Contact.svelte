<script lang="ts">
  import Button from "$lib/comps/Button.svelte";
  import Icon from "$lib/comps/Icon.svelte";
  import Input from "$lib/comps/Input.svelte";
  import SectionHeading from "$lib/comps/SectionHeading.svelte";
  import DialogBox from "$lib/pixel/DialogBox.svelte";
  import PixelSprite from "$lib/pixel/PixelSprite.svelte";
  import { cursor, mailbox, shadowOval, medallionLeft, medallionRight, sparkle } from "$lib/pixel/sprites.js";
  import { Text } from "$lib/utils/lang.svelte";
  import { reducedMotion } from "$lib/utils/motion.svelte";
  import { reveal } from "$lib/utils/reveal.js";
  import { resumeUrl } from "$lib/utils/resume.js";
  import sfx from "$lib/utils/sfx.svelte";
  import ui from "$lib/json/ui.json" with { type: "json" };

  const t = Object.fromEntries(Object.entries(ui.contact).map(([k, v]) => [k, new Text(v)])) as Record<
    keyof typeof ui.contact,
    Text
  >;
  const speaker = new Text(ui.dialog.speaker);
  const { email, whatsapp } = ui.links;
  const [emailUser, emailDomain] = email.split("@");
  const resume = new Text(resumeUrl);

  const validation = {
    name: (v: string) => (v.length >= 4 ? "" : t.nameError.value),
    message: (v: string) => (v.length >= 10 ? "" : t.messageError.value),
  };
  const valid = () => !validation.name(form.name) && !validation.message(form.message);

  let form = $state({ name: "", message: "" });
  let copied = $state(false);
  let fusing = $state(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
      sfx.gem();
      setTimeout(() => (copied = false), 1800);
    } catch (_) {}
  }

  /** The two medallion halves click together, then the message goes out. */
  function celebrate() {
    sfx.itemGet();
    fusing = true;
    setTimeout(() => (fusing = false), reducedMotion.current ? 1400 : 2000);
  }

  function submitEmail() {
    if (!valid()) return;
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
    celebrate();
  }

  function submitWhats() {
    if (!valid()) return;
    const text = new Text({
      ptBr: `Olá meu nome é ${form.name},\n${form.message}`,
      enUs: `Hi there, my name is ${form.name}, \n ${form.message}`,
    }).value;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
    celebrate();
  }

  const channels = [
    { icon: "whatsapp", label: "WhatsApp", value: ui.links.whatsappLabel, href: `https://wa.me/${whatsapp}` },
    { icon: "linkedin", label: "LinkedIn", value: ui.links.linkedinLabel, href: ui.links.linkedin },
    { icon: "github", label: "GitHub", value: ui.links.githubLabel, href: ui.links.github },
  ] as const;
</script>

<section id="contact" class="relative py-24 sm:py-32">
  <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
    <SectionHeading title={t.heading.value} />

    <!-- headline flush left with the sign and the dialog; the mailbox stands off to the right -->
    <div class="flex items-end justify-between gap-8" use:reveal>
      <h2 class="headline max-w-4xl font-title text-[clamp(1.5rem,4vw,2.75rem)] leading-[1.35] text-snow px-outline">
        {@html t.headline.value}
      </h2>
      <!-- planted on the ground like the props in the field, the flag flutters instead of the box hopping -->
      <span class="mr-4 hidden shrink-0 flex-col items-center md:flex" aria-hidden="true">
        <PixelSprite sprite={mailbox} scale={3} fps={1.5} class="relative z-[1]" />
        <span class="-mt-2"><PixelSprite sprite={shadowOval(32, 7)} scale={3} /></span>
      </span>
    </div>

    <div class="mt-12 max-w-3xl" use:reveal={1}>
      <DialogBox speaker={speaker.value} text={t.availability.value} />
    </div>

    <div class="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
      <!-- direct channels, as a menu list -->
      <div class="lg:col-span-5" use:reveal>
        <div class="px-box px-menu p-4 sm:p-5">
          <span class="mb-3 block font-title text-[11px] text-gold-hi uppercase">{t.channels.value}</span>
          <ul class="flex flex-col">
            <li class="channel group flex items-center gap-3 py-3">
              <span class="cur"><PixelSprite sprite={cursor} scale={2} /></span>
              <span class="px-box px-slot-dark grid h-12 w-12 shrink-0 place-items-center"><Icon name="mail" class="h-8 w-8" /></span>
              <a href="mailto:{email}" class="flex min-w-0 flex-1 flex-col" onmouseenter={() => sfx.cursor()}>
                <span class="font-label text-[12px] text-mist uppercase">Email</span>
                <!-- breaks before the "@" on narrow screens instead of cutting the address -->
                <span class="text-[16px] break-words group-hover:text-gold-hi">{emailUser}<wbr />@{emailDomain}</span>
              </a>
              <!-- same square slot as the channel icons, so the row lines up with the others -->
              <button
                type="button"
                onclick={copyEmail}
                class="px-box px-slot-dark grid h-10 w-10 shrink-0 cursor-pointer place-items-center hover:text-gold-hi"
                aria-label={t.copy.value}
                title={copied ? t.copied.value : t.copy.value}
              >
                <Icon name={copied ? "check" : "copy"} class="h-4 w-4 {copied ? 'text-gem' : ''}" />
                <span class="sr-only" aria-live="polite">{copied ? t.copied.value : ""}</span>
              </button>
            </li>

            <li>
              <a
                href={resume.value}
                target="_blank"
                rel="noopener noreferrer"
                class="channel group flex items-center gap-3 py-3"
                onmouseenter={() => sfx.cursor()}
              >
                <span class="cur"><PixelSprite sprite={cursor} scale={2} /></span>
                <span class="px-box px-slot-dark grid h-12 w-12 shrink-0 place-items-center text-gold-hi"
                  ><Icon name="download" class="h-8 w-8" /></span
                >
                <span class="flex flex-1 flex-col">
                  <span class="font-label text-[12px] text-mist uppercase">{t.resume.value}</span>
                  <span class="text-[17px] group-hover:text-gold-hi">{t.resumeValue.value}</span>
                </span>
              </a>
            </li>

            {#each channels as c (c.label)}
              <li>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="channel group flex items-center gap-3 py-3"
                  onmouseenter={() => sfx.cursor()}
                >
                  <span class="cur"><PixelSprite sprite={cursor} scale={2} /></span>
                  <span class="px-box px-slot-dark grid h-12 w-12 shrink-0 place-items-center"><Icon name={c.icon} class="h-8 w-8" /></span>
                  <span class="flex flex-1 flex-col">
                    <span class="font-label text-[12px] text-mist uppercase">{c.label}</span>
                    <!-- Pixelify draws 5 almost like S, so the phone number goes in the title font -->
                    <span class="{c.icon === 'whatsapp' ? 'font-title text-[12px] leading-[1.7] tracking-[-0.1em] [word-spacing:-0.5em]' : 'text-[17px]'} group-hover:text-gold-hi">{c.value}</span>
                  </span>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <!-- the letter -->
      <div class="lg:col-span-7" use:reveal={1}>
        <div class="px-box px-dialog p-5 sm:p-7">
          <span class="mb-6 block font-title text-[11px] text-gold-hi uppercase">{t.form.value}</span>
          <form
            class="flex flex-col gap-3"
            onsubmit={(e) => {
              e.preventDefault();
              const action = (e.submitter as HTMLButtonElement | null)?.value;
              if (action === "email") submitEmail();
              else submitWhats();
            }}
          >
            <Input
              bind:value={form.name}
              validation={validation.name}
              label={t.name.value}
              placeholder={t.namePlaceholder.value}
            />
            <Input
              kind="textarea"
              bind:value={form.message}
              validation={validation.message}
              label={t.message.value}
              placeholder={t.messagePlaceholder.value}
            />
            <div class="mt-3 grid grid-cols-1 gap-5 px-1.5 sm:flex sm:flex-wrap sm:gap-x-8 sm:pr-0 sm:pl-6">
              <Button type="submit" value="whats" class="w-full sm:w-auto">
                <Icon name="whatsapp" class="h-4 w-4" />
                {t.sendWhats.value}
              </Button>
              <Button type="submit" value="email" variant="ghost" class="w-full sm:w-auto">
                <Icon name="mail" class="h-4 w-4" />
                {t.sendEmail.value}
              </Button>
            </div>
          </form>

          {#if fusing}
            <div class="absolute inset-0 z-10 grid place-items-center bg-night/90" role="status">
              <div class="flex flex-col items-center gap-5">
                <div class="relative flex">
                  <span class="half-l"><PixelSprite sprite={medallionLeft} scale={3} /></span>
                  <span class="half-r -ml-[84px]"><PixelSprite sprite={medallionRight} scale={3} /></span>
                  <span class="spark absolute -top-6 -left-6"><PixelSprite sprite={sparkle} scale={3} fps={5} /></span>
                  <span class="spark absolute -right-6 -bottom-4"><PixelSprite sprite={sparkle} scale={3} fps={5} /></span>
                </div>
                <span class="font-title text-[12px] text-gold-hi">{t.sent.value}</span>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .headline :global(em) {
    font-style: normal;
    /* keeps "do papel" / "off the ground" on one line */
    white-space: nowrap;
    color: var(--color-gold-hi);
  }
  li + li {
    border-top: 2px dashed rgb(248 248 248 / 0.18);
  }
  /* the cursor floats in the card's padding, so it doesn't push every row to the right */
  .channel {
    position: relative;
  }
  .cur {
    position: absolute;
    top: 50%;
    left: -15px;
    display: flex;
    transform: translateY(-50%);
    visibility: hidden;
    animation: px-blink 1s steps(1) infinite;
  }
  .channel:hover .cur,
  .channel:focus-within .cur,
  .channel:focus-visible .cur {
    visibility: visible;
  }
  /* no hover on phones, and the narrow padding there has no room for it */
  @media (max-width: 639px), (hover: none) {
    .cur {
      display: none;
    }
  }

  /* medallion fusion: halves slide in 4 frames, snap, flash */
  .half-l {
    animation: in-l 0.6s steps(4, end) both;
  }
  .half-r {
    animation: in-r 0.6s steps(4, end) both;
  }
  .spark {
    opacity: 0;
    animation: pop 0.2s steps(1, end) 0.65s both;
  }
  @keyframes in-l {
    from {
      transform: translateX(-72px);
    }
  }
  @keyframes in-r {
    from {
      transform: translateX(72px);
    }
  }
  @keyframes pop {
    to {
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .half-l,
    .half-r,
    .spark {
      animation: none;
      opacity: 1;
    }
  }
</style>
