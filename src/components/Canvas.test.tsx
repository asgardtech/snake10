import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from './Canvas';

describe('Canvas Component', () => {
  beforeEach(() => {
    // Mock canvas.getContext for jsdom compatibility
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      scale: vi.fn(),
    })) as unknown as (contextId: string, options?: CanvasRenderingContext2DSettings) => CanvasRenderingContext2D | null;
  });

  describe('rendering', () => {
    it('should render canvas element', () => {
      const { container } = render(<Canvas />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should render with default dimensions', () => {
      const { container } = render(<Canvas />);
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      expect(canvas).toHaveStyle('width: 400px');
      expect(canvas).toHaveStyle('height: 400px');
    });

    it('should render with custom dimensions', () => {
      const { container } = render(<Canvas width={600} height={800} />);
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      expect(canvas).toHaveStyle('width: 600px');
      expect(canvas).toHaveStyle('height: 800px');
    });

    it('should apply custom className', () => {
      const { container } = render(<Canvas className="custom-class" />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toHaveClass('custom-class');
      expect(canvas).toHaveClass('border');
      expect(canvas).toHaveClass('border-gray-300');
    });
  });

  describe('styling', () => {
    it('should have default border styling', () => {
      const { container } = render(<Canvas />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toHaveClass('border');
      expect(canvas).toHaveClass('border-gray-300');
    });

    it('should combine default and custom classes', () => {
      const { container } = render(<Canvas className="shadow-lg" />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toHaveClass('border');
      expect(canvas).toHaveClass('border-gray-300');
      expect(canvas).toHaveClass('shadow-lg');
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Canvas ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLCanvasElement);
    });

    it('should set width and height attributes via ref', () => {
      const ref = { current: null };
      render(<Canvas width={400} height={400} ref={ref} />);
      const canvas = ref.current as HTMLCanvasElement;
      const dpr = window.devicePixelRatio || 1;
      expect(canvas.width).toBe(400 * dpr);
      expect(canvas.height).toBe(400 * dpr);
    });
  });

  describe('device pixel ratio handling', () => {
    it('should scale canvas for high DPI displays', () => {
      const ref = { current: null };
      render(<Canvas width={400} height={400} ref={ref} />);
      const canvas = ref.current as HTMLCanvasElement;
      const dpr = window.devicePixelRatio || 1;
      expect(canvas.width).toBe(400 * dpr);
      expect(canvas.height).toBe(400 * dpr);
    });
  });

  describe('displayName', () => {
    it('should have correct displayName for debugging', () => {
      expect(Canvas.displayName).toBe('Canvas');
    });
  });
});
