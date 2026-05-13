import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopOptions {
  canvas: HTMLCanvasElement | null;
  fps?: number;
  onUpdate?: (deltaTime: number) => void;
  onRender?: (ctx: CanvasRenderingContext2D) => void;
}

export const useGameLoop = ({
  canvas,
  fps = 60,
  onUpdate,
  onRender,
}: UseGameLoopOptions) => {
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const accumulator = useRef<number>(0);

  const frameInterval = 1000 / fps;

  const gameLoop = useCallback(
    (currentTime: number) => {
      if (!canvas) return;

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      accumulator.current += deltaTime;

      while (accumulator.current >= frameInterval) {
        onUpdate?.(frameInterval / 1000);
        accumulator.current -= frameInterval;
      }

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        onRender?.(ctx);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [canvas, frameInterval, onUpdate, onRender]
  );

  useEffect(() => {
    if (!canvas) return;

    lastTimeRef.current = 0;
    accumulator.current = 0;
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvas, gameLoop]);

  const stop = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  return { stop };
};
