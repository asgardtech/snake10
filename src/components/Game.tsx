import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from './Canvas';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useInputHandler } from '@/hooks/useInputHandler';
import { GameEngine } from '@/engine/GameEngine';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const GRID_SIZE = 20;

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const { getAndClearBuffer } = useInputHandler();

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new GameEngine(CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE);
    }
  }, []);

  const handleRender = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!engineRef.current) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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

    const snake = engineRef.current.getSnake();
    ctx.fillStyle = '#22c55e';
    snake.forEach((segment, index) => {
      const x = segment.x * GRID_SIZE + 1;
      const y = segment.y * GRID_SIZE + 1;
      ctx.fillRect(x, y, GRID_SIZE - 2, GRID_SIZE - 2);

      if (index === 0) {
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(x, y, GRID_SIZE - 2, GRID_SIZE - 2);
        ctx.fillStyle = '#22c55e';
      }
    });

    const food = engineRef.current.getFood();
    if (food) {
      ctx.fillStyle = '#ef4444';
      const x = food.x * GRID_SIZE + 1;
      const y = food.y * GRID_SIZE + 1;
      ctx.beginPath();
      ctx.arc(x + (GRID_SIZE - 2) / 2, y + (GRID_SIZE - 2) / 2, (GRID_SIZE - 2) / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (engineRef.current.isGameOver()) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      ctx.font = '16px Arial';
      ctx.fillText(`Score: ${engineRef.current.getScore()}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
    } else if (!engineRef.current.isPlaying()) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Press Start to begin', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
  }, []);

  const handleUpdate = useCallback(() => {
    if (!engineRef.current) return;

    const direction = getAndClearBuffer();
    if (direction) {
      engineRef.current.setDirection(direction);
    }

    engineRef.current.update();

    if (engineRef.current.isGameOver()) {
      setGameOver(true);
      setIsRunning(false);
    }

    setScore(engineRef.current.getScore());
  }, [getAndClearBuffer]);

  const { stop } = useGameLoop({
    canvas: isRunning ? canvasRef.current : null,
    fps: 10,
    onUpdate: handleUpdate,
    onRender: handleRender,
  });

  const startGame = () => {
    if (!engineRef.current) return;
    engineRef.current.start();
    setGameOver(false);
    setIsRunning(true);
  };

  const restartGame = () => {
    if (!engineRef.current) return;
    engineRef.current.reset();
    setScore(0);
    setGameOver(false);
    startGame();
  };

  const toggleGame = () => {
    if (isRunning) {
      stop();
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-2xl font-bold">Score: {score}</div>
      <Canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="bg-white shadow-lg border-2 border-gray-300"
      />
      <div className="flex gap-3">
        {!isRunning && !gameOver && (
          <button
            onClick={startGame}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
          >
            Start
          </button>
        )}
        {isRunning && (
          <button
            onClick={toggleGame}
            className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold"
          >
            Pause
          </button>
        )}
        {gameOver && (
          <>
            <button
              onClick={restartGame}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
            >
              Restart
            </button>
            <button
              onClick={() => {
                if (engineRef.current) {
                  engineRef.current.reset();
                }
                setScore(0);
                setGameOver(false);
                setIsRunning(false);
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-semibold"
            >
              New Game
            </button>
          </>
        )}
      </div>
    </div>
  );
}
