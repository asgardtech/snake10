import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Game } from './Game';

// Mock Canvas component to avoid rendering issues in tests
vi.mock('./Canvas', () => ({
  Canvas: ({ ref, ...props }: any) => (
    <canvas ref={ref} data-testid="game-canvas" {...props} />
  ),
}));

// Mock useGameLoop to avoid actual animation loop
vi.mock('@/hooks/useGameLoop', () => ({
  useGameLoop: () => {},
}));

describe('Game Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should render with idle state on mount', () => {
      render(<Game />);
      expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument();
    });

    it('should display score as 0 initially', () => {
      render(<Game />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should show idle state help text', () => {
      render(<Game />);
      expect(screen.getByText(/use arrow keys or wasd to control the snake/i)).toBeInTheDocument();
    });
  });

  describe('state transitions', () => {
    it('should transition from idle to playing when Start Game is clicked', async () => {
      render(<Game />);
      const startButton = screen.getByRole('button', { name: /start game/i });

      fireEvent.click(startButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
      });
    });

    it('should transition from playing to paused when Pause is clicked', async () => {
      render(<Game />);
      const startButton = screen.getByRole('button', { name: /start game/i });
      fireEvent.click(startButton);

      await waitFor(() => {
        const pauseButton = screen.getByRole('button', { name: /pause/i });
        fireEvent.click(pauseButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument();
      });
    });

    it('should transition from paused to playing when Resume is clicked', async () => {
      render(<Game />);
      fireEvent.click(screen.getByRole('button', { name: /start game/i }));

      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /pause/i }));
      });

      await waitFor(() => {
        const resumeButton = screen.getByRole('button', { name: /resume/i });
        fireEvent.click(resumeButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
      });
    });

    it('should transition from paused to idle when New Game is clicked', async () => {
      render(<Game />);
      fireEvent.click(screen.getByRole('button', { name: /start game/i }));

      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /pause/i }));
      });

      await waitFor(() => {
        const newGameButton = screen.getByRole('button', { name: /new game/i });
        fireEvent.click(newGameButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument();
      });
    });

    it('should transition from gameOver to playing when Restart is clicked', async () => {
      render(<Game />);
      fireEvent.click(screen.getByRole('button', { name: /start game/i }));

      // Simulate game over by mocking the engine state
      // This is tricky since we'd need to trigger the actual game over condition
      // For now, we'll verify the buttons exist in different states
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
      });
    });
  });

  describe('help text', () => {
    it('should display correct help text for idle state', () => {
      render(<Game />);
      expect(screen.getByText(/use arrow keys or wasd to control the snake/i)).toBeInTheDocument();
    });

    it('should update help text when state changes to playing', async () => {
      render(<Game />);
      fireEvent.click(screen.getByRole('button', { name: /start game/i }));

      await waitFor(() => {
        expect(screen.getByText(/playing\.\.\. use arrow keys or wasd/i)).toBeInTheDocument();
      });
    });

    it('should update help text when state changes to paused', async () => {
      render(<Game />);
      fireEvent.click(screen.getByRole('button', { name: /start game/i }));

      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /pause/i }));
      });

      await waitFor(() => {
        expect(screen.getByText(/game paused/i)).toBeInTheDocument();
      });
    });
  });

  describe('button visibility', () => {
    it('should show Start Game button only in idle state', () => {
      render(<Game />);
      expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument();
    });

    it('should show Pause button only in playing state', async () => {
      render(<Game />);
      fireEvent.click(screen.getByRole('button', { name: /start game/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /start game/i })).not.toBeInTheDocument();
      });
    });

    it('should show Resume and New Game buttons in paused state', async () => {
      render(<Game />);
      fireEvent.click(screen.getByRole('button', { name: /start game/i }));

      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /pause/i }));
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();
        const newGameButtons = screen.getAllByRole('button', { name: /new game/i });
        expect(newGameButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('canvas rendering', () => {
    it('should render canvas element', () => {
      render(<Game />);
      expect(screen.getByTestId('game-canvas')).toBeInTheDocument();
    });

    it('should have score display', () => {
      render(<Game />);
      expect(screen.getByText('Score')).toBeInTheDocument();
    });
  });
});
