<script>
  /**
   * @typedef {Object} Props
   * @property {boolean} [isAtivo]
   * @property {any} info
   */

  /** @type {Props} */
  let { isAtivo = false, info } = $props();
</script>

<div class="absolute flex flex-col items-center justify-center text-left p-4 w-[60%] p:w-full gap-4 {isAtivo  ? "" : "translate-y-[-600%]"}">
    <h1 class="text-28 font-semibold text-left w-full">{info.title}</h1>
    <p> 
      {info.desc}
    </p>
</div>