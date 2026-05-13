import React, { useRef } from 'react';

interface CanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ width = 400, height = 400, className = '' }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = ref || internalRef;

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`border border-gray-300 ${className}`}
      />
    );
  }
);

Canvas.displayName = 'Canvas';
