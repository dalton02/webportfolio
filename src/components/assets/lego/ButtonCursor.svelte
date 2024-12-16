
<script>
    import mouseState from "$lib/localData/mouse.svelte";
  
    let {
        className,
        children,
        onClick,
        style="",
        title=""
    } = $props();
  </script>
  
  
  <button class="{mouseState.state.haveCustomCursor ? "lg:cursor-none" : ""} {className}" onclick={onClick} style={style} title={title}>
    {@render children?.()}
  </button>
  