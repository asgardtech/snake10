export const GAME_UI_TEXT = {
  idle: {
    helpText: 'Use arrow keys or WASD to control the snake',
    buttons: {
      start: 'Start Game',
    },
  },
  playing: {
    helpText: 'Playing... Use arrow keys or WASD to control the snake',
    buttons: {
      pause: 'Pause',
    },
  },
  paused: {
    helpText: 'Game paused',
    buttons: {
      resume: 'Resume',
      newGame: 'New Game',
    },
  },
  gameOver: {
    helpText: 'Game Over! Your game has ended.',
    buttons: {
      restart: 'Restart',
      newGame: 'New Game',
    },
  },
} as const;
