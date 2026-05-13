import { useEffect, useRef, useCallback } from 'react';

export type Direction = 'up' | 'down' | 'left' | 'right';

interface UseInputHandlerOptions {
  onDirectionChange?: (direction: Direction) => void;
}

export const useInputHandler = ({ onDirectionChange }: UseInputHandlerOptions = {}) => {
  const directionBufferRef = useRef<Direction | null>(null);
  const lastDirectionRef = useRef<Direction | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    let direction: Direction | null = null;

    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        direction = 'up';
        event.preventDefault();
        break;
      case 'ArrowDown':
      case 'KeyS':
        direction = 'down';
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'KeyA':
        direction = 'left';
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'KeyD':
        direction = 'right';
        event.preventDefault();
        break;
    }

    if (direction) {
      directionBufferRef.current = direction;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getAndClearBuffer = useCallback((): Direction | null => {
    const buffered = directionBufferRef.current;
    lastDirectionRef.current = buffered || lastDirectionRef.current;
    directionBufferRef.current = null;

    if (buffered && onDirectionChange) {
      onDirectionChange(buffered);
    }

    return buffered;
  }, [onDirectionChange]);

  const getCurrentDirection = useCallback((): Direction | null => {
    return lastDirectionRef.current;
  }, []);

  return {
    getAndClearBuffer,
    getCurrentDirection,
  };
};
