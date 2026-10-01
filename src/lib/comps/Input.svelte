<script lang="ts">
  import type { ZodTypeAny } from "zod";

  let {
    value = $bindable(),
    validation,
    label,
    placeholder,
    kind = "input",
  }: {
    value: string;
    validation: ZodTypeAny;
    label: string;
    placeholder: string;
    kind?: "input" | "textarea";
  } = $props();

  const id = $props.id();

  let error = $derived.by(() => {
    if (!value) return "";
    const v = validation.safeParse(value);
    return v.success ? "" : (v.error.issues[0]?.message ?? "");
  });

  const field = `peer w-full rounded-xl border bg-ink/60 px-4 py-3 text-[15px] text-sand outline-none
    placeholder:text-dust/60 transition-[border-color,box-shadow] duration-300
    focus:ring-4 focus:ring-clay/10`;
</script>

<div class="relative flex w-full flex-col gap-2">
  <label for={id} class="font-mono text-[11px] tracking-[0.14em] text-dust uppercase">{label}</label>
  {#if kind === "input"}
    <input
      {id}
      type="text"
      class="{field} {error ? 'border-clay/70' : 'border-line focus:border-clay/60'}"
      {placeholder}
      name={label}
      aria-invalid={!!error}
      bind:value
    />
  {:else}
    <textarea
      {id}
      class="{field} min-h-[150px] resize-y {error ? 'border-clay/70' : 'border-line focus:border-clay/60'}"
      {placeholder}
      name={label}
      aria-invalid={!!error}
      bind:value
    ></textarea>
  {/if}
  <span class="h-3 text-[12px] leading-none text-clay" aria-live="polite">{error}</span>
</div>
