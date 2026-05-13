import { useState, useCallback } from 'react';
import { GameState } from '@/types/game';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>('idle');

  const setIdle = useCallback(() => setGameState('idle'), []);
  const setPlaying = useCallback(() => setGameState('playing'), []);
  const setPaused = useCallback(() => setGameState('paused'), []);
  const setGameOver = useCallback(() => setGameState('gameOver'), []);

  return {
    gameState,
    setGameState,
    setIdle,
    setPlaying,
    setPaused,
    setGameOver,
  };
}
