class AnimationManager {
    private tasks: Set<FrameRequestCallback> = new Set();
    private fps: number = 50; 
    private lastFrameTime: number = performance.now();
    private animationId: number | null = null;

    private run = (currentTime: number) => {
      const deltaTime = currentTime - this.lastFrameTime;
  
      if (deltaTime > 1000 / this.fps) {
        this.tasks.forEach((task) => task(currentTime));
        this.lastFrameTime = currentTime;
      }
  
      this.animationId = requestAnimationFrame(this.run);
    };
  
    public registerTask(task: FrameRequestCallback) {
      this.tasks.add(task);
      if (this.tasks.size === 1) {
        this.animationId = requestAnimationFrame(this.run); 
      }
    }
  
    public unregisterTask(task: FrameRequestCallback) {
      this.tasks.delete(task);
      if (this.tasks.size === 0 && this.animationId !== null) {
        cancelAnimationFrame(this.animationId); 
        this.animationId = null; 
      }
    }
  }
  
  export const animationManager = new AnimationManager();