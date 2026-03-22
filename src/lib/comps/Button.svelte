<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    theme,
    action,
    children,
    kind = "button",
    value,
  }: {
    theme: "primary" | "secondary";
    action: VoidFunction;
    children: Snippet;
    kind?: "button" | "form";
    value?: string;
  } = $props();

  let css =
    $derived(`p-2 px-5 rounded-3xl duration-150 transition-all cursor-pointer 
${theme == "primary" ? "bg-egg text-black/96 hover:bg-egg/90" : "bg-background text-egg border-white border hover:bg-egg/10"}`);
</script>

{#if kind === "button"}
  <button class={css} onclick={action}>
    {@render children()}
  </button>
{:else}
  <button
    {value}
    class={css}
    onsubmit={(e) => {
      e.preventDefault();
      action();
    }}
  >
    {@render children()}
  </button>
{/if}
