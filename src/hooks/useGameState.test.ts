import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';

describe('useGameState Hook', () => {
  describe('initial state', () => {
    it('should initialize with idle state', () => {
      const { result } = renderHook(() => useGameState());
      expect(result.current.gameState).toBe('idle');
    });
  });

  describe('setGameState', () => {
    it('should set game state to playing', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setGameState('playing');
      });

      expect(result.current.gameState).toBe('playing');
    });

    it('should set game state to paused', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setGameState('paused');
      });

      expect(result.current.gameState).toBe('paused');
    });

    it('should set game state to gameOver', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setGameState('gameOver');
      });

      expect(result.current.gameState).toBe('gameOver');
    });

    it('should set game state back to idle', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setGameState('playing');
        result.current.setGameState('idle');
      });

      expect(result.current.gameState).toBe('idle');
    });
  });

  describe('convenience setters', () => {
    it('should set state to idle with setIdle', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setPlaying();
      });
      expect(result.current.gameState).toBe('playing');

      act(() => {
        result.current.setIdle();
      });
      expect(result.current.gameState).toBe('idle');
    });

    it('should set state to playing with setPlaying', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setPlaying();
      });

      expect(result.current.gameState).toBe('playing');
    });

    it('should set state to paused with setPaused', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setPaused();
      });

      expect(result.current.gameState).toBe('paused');
    });

    it('should set state to gameOver with setGameOver', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setGameOver();
      });

      expect(result.current.gameState).toBe('gameOver');
    });
  });

  describe('state transitions', () => {
    it('should support idle -> playing -> paused -> idle flow', () => {
      const { result } = renderHook(() => useGameState());

      expect(result.current.gameState).toBe('idle');

      act(() => {
        result.current.setPlaying();
      });
      expect(result.current.gameState).toBe('playing');

      act(() => {
        result.current.setPaused();
      });
      expect(result.current.gameState).toBe('paused');

      act(() => {
        result.current.setIdle();
      });
      expect(result.current.gameState).toBe('idle');
    });

    it('should support idle -> playing -> gameOver -> idle flow', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setPlaying();
      });

      act(() => {
        result.current.setGameOver();
      });
      expect(result.current.gameState).toBe('gameOver');

      act(() => {
        result.current.setIdle();
      });
      expect(result.current.gameState).toBe('idle');
    });
  });

  describe('memoization of callbacks', () => {
    it('should return stable setter functions across renders', () => {
      const { result, rerender } = renderHook(() => useGameState());

      const setIdleRef1 = result.current.setIdle;
      const setPlayingRef1 = result.current.setPlaying;
      const setPausedRef1 = result.current.setPaused;
      const setGameOverRef1 = result.current.setGameOver;

      rerender();

      const setIdleRef2 = result.current.setIdle;
      const setPlayingRef2 = result.current.setPlaying;
      const setPausedRef2 = result.current.setPaused;
      const setGameOverRef2 = result.current.setGameOver;

      expect(setIdleRef1).toBe(setIdleRef2);
      expect(setPlayingRef1).toBe(setPlayingRef2);
      expect(setPausedRef1).toBe(setPausedRef2);
      expect(setGameOverRef1).toBe(setGameOverRef2);
    });
  });
});
