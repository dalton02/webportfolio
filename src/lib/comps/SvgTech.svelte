<script>
  let { url, name } = $props();

  const prefix = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";
</script>

<div
  class="group flex flex-col items-center justify-center gap-2 rounded-xl
  border border-white/5 bg-secondary/40 px-2 py-3
  text-sm tracking-tight text-egg/70 select-none
  transition-all duration-300 ease-out
  hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/80
  hover:text-egg hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
>
  <img
    src={prefix + url}
    class="w-[40px] grayscale-[70%] transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110"
    alt={name}
  />
  {name}
</div>
