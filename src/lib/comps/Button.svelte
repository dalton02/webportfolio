<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    variant = "solid",
    href,
    type = "button",
    value,
    external = false,
    onclick,
    children,
    class: extra = "",
  }: {
    variant?: "solid" | "ghost";
    href?: string;
    type?: "button" | "submit";
    value?: string;
    external?: boolean;
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
    class?: string;
  } = $props();

  let css = $derived(
    `group/btn inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium
    transition-all duration-300 ease-[var(--ease-soft)] active:scale-[0.98]
    ${
      variant === "solid"
        ? "bg-clay text-ink shadow-[0_8px_30px_-8px_rgb(232_116_74/0.55)] hover:bg-sun hover:shadow-[0_10px_36px_-8px_rgb(242_197_124/0.55)]"
        : "border border-line bg-ink/40 text-sand backdrop-blur-sm hover:border-clay/60 hover:text-clay"
    } ${extra}`,
  );
</script>

{#if href}
  <a
    {href}
    class={css}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    {onclick}
  >
    {@render children()}
  </a>
{:else}
  <button {type} {value} class={css} {onclick}>
    {@render children()}
  </button>
{/if}
