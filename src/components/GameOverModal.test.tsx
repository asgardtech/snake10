import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameOverModal } from './GameOverModal';

describe('GameOverModal Component', () => {
  describe('visibility and content', () => {
    it('should not render when open is false', () => {
      const { container } = render(
        <GameOverModal
          open={false}
          score={42}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });

    it('should render when open is true', () => {
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display the game over title', () => {
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(screen.getByText('Game Over')).toBeInTheDocument();
    });

    it('should display the final score', () => {
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should display score description text', () => {
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(screen.getByText(/final score/i)).toBeInTheDocument();
    });
  });

  describe('buttons', () => {
    it('should render Restart button', () => {
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument();
    });

    it('should render New Game button', () => {
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument();
    });

    it('should call onRestart when Restart button is clicked', () => {
      const onRestart = vi.fn();
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={onRestart}
          onNewGame={vi.fn()}
        />
      );
      const restartButton = screen.getByRole('button', { name: /restart/i });
      fireEvent.click(restartButton);
      expect(onRestart).toHaveBeenCalled();
    });

    it('should call onNewGame when New Game button is clicked', () => {
      const onNewGame = vi.fn();
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={vi.fn()}
          onNewGame={onNewGame}
        />
      );
      const newGameButton = screen.getByRole('button', { name: /new game/i });
      fireEvent.click(newGameButton);
      expect(onNewGame).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA dialog role', () => {
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have accessible title', () => {
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      const title = screen.getByText('Game Over');
      expect(title).toBeInTheDocument();
      // The title should be associated with the dialog via aria-labelledby
    });

    it('should have accessible description', () => {
      render(
        <GameOverModal
          open={true}
          score={42}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      const description = screen.getByText(/final score/i);
      expect(description).toBeInTheDocument();
      // The description should be associated with the dialog via aria-describedby
    });
  });

  describe('score display', () => {
    it('should display different scores correctly', () => {
      const { rerender } = render(
        <GameOverModal
          open={true}
          score={10}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(screen.getByText('10')).toBeInTheDocument();

      rerender(
        <GameOverModal
          open={true}
          score={100}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should display zero score', () => {
      render(
        <GameOverModal
          open={true}
          score={0}
          onRestart={vi.fn()}
          onNewGame={vi.fn()}
        />
      );
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
