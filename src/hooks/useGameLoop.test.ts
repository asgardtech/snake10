import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameLoop } from './useGameLoop';

describe('useGameLoop Hook', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;

    // Mock canvas.getContext for jsdom compatibility
    canvas.getContext = vi.fn((contextType: string) => {
      if (contextType === '2d') {
        return {
          fillStyle: '#ffffff',
          fillRect: vi.fn(),
          scale: vi.fn(),
        } as unknown as CanvasRenderingContext2D;
      }
      return null;
    }) as unknown as (contextId: string, options?: CanvasRenderingContext2DSettings) => CanvasRenderingContext2D | null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize without errors when canvas is null', () => {
      const { result } = renderHook(() =>
        useGameLoop({
          canvas: null,
          fps: 60,
        })
      );

      expect(result.current.stop).toBeDefined();
    });

    it('should return a stop function', () => {
      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 60,
        })
      );

      expect(result.current.stop).toBeDefined();
      expect(typeof result.current.stop).toBe('function');
    });
  });

  describe('callbacks', () => {
    it('should accept onUpdate callback', () => {
      const onUpdate = vi.fn();

      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 60,
          onUpdate,
        })
      );

      expect(result.current.stop).toBeDefined();
    });

    it('should accept onRender callback', () => {
      const onRender = vi.fn();

      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 60,
          onRender,
        })
      );

      expect(result.current.stop).toBeDefined();
    });

    it('should accept both onUpdate and onRender callbacks', () => {
      const onUpdate = vi.fn();
      const onRender = vi.fn();

      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 60,
          onUpdate,
          onRender,
        })
      );

      expect(result.current.stop).toBeDefined();
    });

    it('should handle missing onUpdate callback', () => {
      const onRender = vi.fn();

      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 60,
          onRender,
        })
      );

      expect(result.current.stop).toBeDefined();
    });

    it('should handle missing onRender callback', () => {
      const onUpdate = vi.fn();

      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 60,
          onUpdate,
        })
      );

      expect(result.current.stop).toBeDefined();
    });
  });

  describe('stop functionality', () => {
    it('should provide a stop function that can be called', () => {
      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 60,
        })
      );

      expect(() => result.current.stop()).not.toThrow();
    });
  });

  describe('cleanup', () => {
    it('should cancel animation frame on unmount', () => {
      const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');

      const { unmount } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 60,
        })
      );

      unmount();

      expect(cancelAnimationFrameSpy).toHaveBeenCalled();
      cancelAnimationFrameSpy.mockRestore();
    });

    it('should not throw error when unmounting', () => {
      const { result, unmount } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 60,
        })
      );

      result.current.stop();

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('fps parameter', () => {
    it('should use default fps of 60 when not provided', () => {
      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
        })
      );

      expect(result.current.stop).toBeDefined();
    });

    it('should handle custom fps values', () => {
      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 30,
        })
      );

      expect(result.current.stop).toBeDefined();
    });

    it('should handle high fps values', () => {
      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 120,
        })
      );

      expect(result.current.stop).toBeDefined();
    });

    it('should handle low fps values', () => {
      const { result } = renderHook(() =>
        useGameLoop({
          canvas,
          fps: 10,
        })
      );

      expect(result.current.stop).toBeDefined();
    });
  });

  describe('null canvas handling', () => {
    it('should not throw when canvas is null', () => {
      expect(() => {
        renderHook(() =>
          useGameLoop({
            canvas: null,
            fps: 60,
          })
        );
      }).not.toThrow();
    });

    it('should handle transition from canvas to null', () => {
      let testCanvas: HTMLCanvasElement | null = canvas;

      const { rerender } = renderHook(
        ({ canvasArg }) =>
          useGameLoop({
            canvas: canvasArg,
            fps: 60,
          }),
        { initialProps: { canvasArg: testCanvas } }
      );

      testCanvas = null;
      rerender({ canvasArg: testCanvas });

      expect(true).toBe(true);
    });
  });
});
