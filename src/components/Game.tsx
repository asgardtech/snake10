import { useRef, useState, useCallback } from 'react';
import { Canvas } from './Canvas';
import { useGameLoop } from '@/hooks/useGameLoop';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const GRID_SIZE = 20;

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);

  const handleRender = useCallback((ctx: CanvasRenderingContext2D) => {
    // Grid visualization
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }

    for (let i = 0; i <= CANVAS_HEIGHT; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }
  }, []);

  const handleUpdate = useCallback((_deltaTime: number) => {
    // Game update logic will go here
  }, []);

  const { stop } = useGameLoop({
    canvas: isRunning ? canvasRef.current : null,
    fps: 10,
    onUpdate: handleUpdate,
    onRender: handleRender,
  });

  const toggleGame = () => {
    if (isRunning) {
      stop();
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="bg-white shadow-lg"
      />
      <button
        onClick={toggleGame}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
