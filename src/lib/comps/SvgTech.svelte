<script>
  let { url, name } = $props();

  const prefix = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";
</script>

<div
  class="flex flex-col text-sm grayscale-100 hover:grayscale-0 duration-200 select-none tracking-tight items-center justify-center gap-2"
>
  <img src={prefix + url} class="w-[44px]" />
  {name}
</div>
