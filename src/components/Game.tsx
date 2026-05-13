import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from './Canvas';
import { GameOverModal } from './GameOverModal';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useInputHandler } from '@/hooks/useInputHandler';
import { useGameState } from '@/hooks/useGameState';
import { GameEngine } from '@/engine/GameEngine';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types/game';
import { GAME_UI_TEXT } from '@/constants/ui';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const GRID_SIZE = 20;

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const { gameState, setGameState } = useGameState();
  const [score, setScore] = useState(0);

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

    if (!engineRef.current.isPlaying()) {
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
      setGameState('gameOver');
    }

    setScore(engineRef.current.getScore());
  }, [getAndClearBuffer]);

  useGameLoop({
    canvas: gameState === 'playing' ? canvasRef.current : null,
    fps: 10,
    onUpdate: handleUpdate,
    onRender: handleRender,
  });

  const startGame = () => {
    if (!engineRef.current) return;
    engineRef.current.start();
    setGameState('playing');
  };

  const pauseGame = () => {
    if (!engineRef.current) return;
    engineRef.current.pause();
    setGameState('paused');
  };

  const resumeGame = () => {
    if (!engineRef.current) return;
    engineRef.current.resume();
    setGameState('playing');
  };

  const resetGame = () => {
    if (!engineRef.current) return;
    engineRef.current.reset();
    setScore(0);
  };

  const restartGame = () => {
    resetGame();
    startGame();
  };

  const newGame = () => {
    resetGame();
    setGameState('idle');
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div className="w-full">
        <div className="text-sm font-medium text-muted-foreground mb-2">Score</div>
        <div className="text-4xl font-bold">{score}</div>
      </div>

      <Canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full aspect-square shadow-lg border-2 border-border"
      />

      <div className="flex flex-col w-full gap-3">
        <div className="flex gap-2 justify-center">
          {gameState === 'idle' && (
            <Button onClick={startGame} size="lg" className="min-w-32">
              {GAME_UI_TEXT.idle.buttons.start}
            </Button>
          )}

          {gameState === 'playing' && (
            <Button onClick={pauseGame} size="lg" variant="secondary" className="min-w-32">
              {GAME_UI_TEXT.playing.buttons.pause}
            </Button>
          )}

          {gameState === 'paused' && (
            <>
              <Button onClick={resumeGame} size="lg" className="min-w-32">
                {GAME_UI_TEXT.paused.buttons.resume}
              </Button>
              <Button onClick={newGame} size="lg" variant="outline" className="min-w-32">
                {GAME_UI_TEXT.paused.buttons.newGame}
              </Button>
            </>
          )}

          {gameState === 'gameOver' && (
            <>
              <Button onClick={restartGame} size="lg" className="min-w-32">
                {GAME_UI_TEXT.gameOver.buttons.restart}
              </Button>
              <Button onClick={newGame} size="lg" variant="outline" className="min-w-32">
                {GAME_UI_TEXT.gameOver.buttons.newGame}
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {gameState === 'idle' && GAME_UI_TEXT.idle.helpText}
          {gameState === 'playing' && GAME_UI_TEXT.playing.helpText}
          {gameState === 'paused' && GAME_UI_TEXT.paused.helpText}
          {gameState === 'gameOver' && GAME_UI_TEXT.gameOver.helpText}
        </div>
      </div>

      <GameOverModal
        open={gameState === 'gameOver'}
        score={score}
        onRestart={restartGame}
        onNewGame={newGame}
      />
    </div>
  );
}
