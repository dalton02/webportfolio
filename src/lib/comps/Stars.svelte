<script lang="ts">
  import mediaQuery from "$lib/utils/media.svelte";

  let canvas = $state<HTMLCanvasElement>();

  interface Star {
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
  }

  let stars: Star[] = [];
  let animationFrame: number;
  let width = 0;
  let height = 0;

  let MAX_STARS = $derived.by(() => {
    if (mediaQuery.lg.current) {
      return 15;
    }
    return 8;
  });
  function randomStar(): Star {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1 + 0.8,
      speed: Math.random() * 2.5 + 0.8,
      opacity: Math.random() * 0.5 + 0.1,
    };
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < MAX_STARS; i++) {
      stars.push(randomStar());
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    width = parent.clientWidth;
    height = parent.clientHeight;

    canvas.width = width;
    canvas.height = height;

    initStars();
  }

  function animate() {
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    ctx.fillStyle = "rgba(37,38,42, 1)";
    ctx.fillRect(0, 0, width, height);

    const trailSize = 200;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];

      star.x += star.speed;

      if (star.x > width + 10) {
        star.x = -10;
        star.y = Math.random() * height;
      }

      ctx.save();
      ctx.globalAlpha = star.opacity;
      ctx.fillStyle = "#ffffff";

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
      ctx.fill();

      const tailOpacity = star.opacity * 0.75;

      ctx.save();

      const gradient = ctx.createLinearGradient(
        star.x - trailSize,
        star.y,
        star.x,
        star.y,
      );

      gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
      gradient.addColorStop(0.4, `rgba(255, 255, 255, ${tailOpacity * 0.15})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${tailOpacity})`);

      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.rect(
        star.x - trailSize - star.size,
        star.y - star.size * 0.8,
        trailSize + star.size,
        star.size * 1.6,
      );
      ctx.fill();

      ctx.restore();
      if (star.size > 1.8) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    animationFrame = requestAnimationFrame(animate);
  }

  $effect(() => {
    if (!canvas) return;
    resizeCanvas();

    animate();

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    observer.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  });
</script>

<canvas bind:this={canvas} class="w-full h-full bg-background block"></canvas>
