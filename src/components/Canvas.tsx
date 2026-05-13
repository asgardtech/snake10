import React, { useRef, useLayoutEffect } from 'react';

interface CanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ width = 400, height = 400, className = '' }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = ref || internalRef;

    useLayoutEffect(() => {
      const canvas = (canvasRef as React.MutableRefObject<HTMLCanvasElement>).current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }, [width, height, canvasRef]);

    return (
      <canvas
        ref={canvasRef}
        className={`border border-gray-300 ${className}`}
      />
    );
  }
);

Canvas.displayName = 'Canvas';
