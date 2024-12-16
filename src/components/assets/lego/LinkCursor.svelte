
<script>
    import mouseState from "$lib/localData/mouse.svelte";
  
    let {
        className,
        children,
        href,
        style="",
        target,
    } = $props();
  </script>
  
  
  <a class="{mouseState.state.haveCustomCursor ? "lg:cursor-none" : ""} {className}" href={href} style={style} target={target}>
    {@render children?.()}
  </a>
  