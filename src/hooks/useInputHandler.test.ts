import { renderHook, act } from '@testing-library/react';
import { useInputHandler } from './useInputHandler';

describe('useInputHandler', () => {
  it('should initialize with no buffered direction', () => {
    const { result } = renderHook(() => useInputHandler());
    expect(result.current.getAndClearBuffer()).toBeNull();
    expect(result.current.getCurrentDirection()).toBeNull();
  });

  it('should buffer arrow key inputs', () => {
    const { result } = renderHook(() => useInputHandler());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
    });

    expect(result.current.getAndClearBuffer()).toBe('up');
  });

  it('should buffer WASD key inputs', () => {
    const { result } = renderHook(() => useInputHandler());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }));
    });

    expect(result.current.getAndClearBuffer()).toBe('up');

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS' }));
    });

    expect(result.current.getAndClearBuffer()).toBe('down');

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
    });

    expect(result.current.getAndClearBuffer()).toBe('left');

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }));
    });

    expect(result.current.getAndClearBuffer()).toBe('right');
  });

  it('should maintain current direction after buffer is cleared', () => {
    const { result } = renderHook(() => useInputHandler());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
    });

    expect(result.current.getAndClearBuffer()).toBe('up');
    expect(result.current.getCurrentDirection()).toBe('up');
    expect(result.current.getAndClearBuffer()).toBeNull();
    expect(result.current.getCurrentDirection()).toBe('up');
  });

  it('should call onDirectionChange callback when direction is buffered', () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => useInputHandler({ onDirectionChange: mockCallback }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
    });

    result.current.getAndClearBuffer();
    expect(mockCallback).toHaveBeenCalledWith('down');
  });

  it('should ignore non-directional keys', () => {
    const { result } = renderHook(() => useInputHandler());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyX' }));
    });

    expect(result.current.getAndClearBuffer()).toBeNull();
  });
});
