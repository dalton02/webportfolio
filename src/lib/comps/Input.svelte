<script lang="ts">
  let {
    value = $bindable(),
    validation,
    label,
    placeholder,
    kind = "input",
  }: {
    value: string;
    /** the error to show for this value, or "" when it's fine */
    validation: (value: string) => string;
    label: string;
    placeholder: string;
    kind?: "input" | "textarea";
  } = $props();

  const id = $props.id();

  let error = $derived(value ? validation(value) : "");

  const field = `w-full border-0 bg-night-hi px-4 py-3 font-pixel text-[18px] text-snow outline-none
    placeholder:text-mist/60 focus:ring-0`;
</script>

<div class="flex w-full flex-col gap-2">
  <label for={id} class="font-label text-[13px] tracking-wide text-gold-hi uppercase">{label}</label>
  <div class="field {error ? 'field-error' : ''}">
    {#if kind === "input"}
      <input {id} type="text" class={field} {placeholder} name={label} aria-invalid={!!error} bind:value />
    {:else}
      <textarea
        {id}
        class="{field} min-h-[150px] resize-y"
        {placeholder}
        name={label}
        aria-invalid={!!error}
        bind:value
      ></textarea>
    {/if}
  </div>
  <span class="min-h-4 font-label text-[12px] leading-none text-gem-red" aria-live="polite">{error}</span>
</div>

<style>
  .field {
    --c: var(--color-mist);
    margin: 2px;
    box-shadow:
      0 -2px 0 0 var(--c),
      0 2px 0 0 var(--c),
      -2px 0 0 0 var(--c),
      2px 0 0 0 var(--c);
  }
  .field:focus-within {
    --c: var(--color-gold-hi);
  }
  .field-error {
    --c: var(--color-gem-red);
  }
  .field > :global(*) {
    display: block;
  }
</style>
