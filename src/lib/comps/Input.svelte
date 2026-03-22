<script lang="ts">
  import type { ZodRawShape, ZodTypeAny } from "zod";

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

  let error = $state("");

  $effect(() => {
    if (value) {
      validate();
    }
  });

  function validate() {
    const v = validation.safeParse(value);
    console.log(v);
    if (!v.success) {
      error = JSON.parse(v.error.message)[0].message;
    } else {
      error = "";
    }
  }
</script>

<div class="relative space-y-2.5 w-full">
  <label
    class="flex items-center gap-2 text-sm leading-none font-medium
    select-none group-data-[disabled=true]:pointer-events-none
    group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
    for="name">{label}</label
  >
  {#if kind === "input"}
    <input
      type="text"
      class="bg-secondary flex h-10 w-full min-w-0 rounded-md border border-white/15 px-3 py-1 text-sm shadow-xs
    transition-[color,box-shadow] outline-none placeholder:text-neutral-400 disabled:pointer-events-none
    disabled:cursor-not-allowed disabled:opacity-50 md:text-base focus-visible:border-neutral-600
    focus-visible:ring-[3px] focus-visible:ring-neutral-600/55 aria-invalid:ring-red-700"
      {placeholder}
      name={label}
      bind:value
    />
  {:else}
    <textarea
      class="bg-secondary flex h-10 w-full min-w-0 rounded-md border border-white/15 px-3 py-1 pt-2.5 text-sm shadow-xs
    transition-[color,box-shadow] outline-none placeholder:text-neutral-400 disabled:pointer-events-none
    disabled:cursor-not-allowed disabled:opacity-50 md:text-base focus-visible:border-neutral-600
    focus-visible:ring-[3px] focus-visible:ring-neutral-600/55 aria-invalid:ring-red-700 min-h-[150px]"
      {placeholder}
      name={label}
      bind:value
    ></textarea>
  {/if}
  {#if error}
    <span class="text-red-500 text-xs leading-none absolute h-0 bottom-[3px]">
      {error}
    </span>
  {/if}
</div>
