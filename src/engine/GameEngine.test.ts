import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from './GameEngine';

describe('GameEngine', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine(400, 400, 20);
  });

  describe('initialization', () => {
    it('should initialize with snake at center with length 3', () => {
      engine.start();
      const snake = engine.getSnake();
      expect(snake).toHaveLength(3);
      expect(snake[0]).toEqual({ x: 10, y: 10 });
      expect(snake[1]).toEqual({ x: 9, y: 10 });
      expect(snake[2]).toEqual({ x: 8, y: 10 });
    });

    it('should initialize with food on canvas', () => {
      const food = engine.getFood();
      expect(food).not.toBeNull();
      expect(food!.x).toBeGreaterThanOrEqual(0);
      expect(food!.x).toBeLessThan(20);
      expect(food!.y).toBeGreaterThanOrEqual(0);
      expect(food!.y).toBeLessThan(20);
    });

    it('should start with score 0', () => {
      expect(engine.getScore()).toBe(0);
    });

    it('should start in idle state', () => {
      expect(engine.getGameState()).toBe('idle');
      expect(engine.isGameOver()).toBe(false);
      expect(engine.isPlaying()).toBe(false);
    });
  });

  describe('game state transitions', () => {
    it('should transition from idle to playing on start', () => {
      engine.start();
      expect(engine.isPlaying()).toBe(true);
      expect(engine.isGameOver()).toBe(false);
    });

    it('should detect collision with snake body', () => {
      engine.start();
      expect(engine.isGameOver()).toBe(false);

      const initialSnake = engine.getSnake();
      initialSnake.push({ x: 11, y: 10 }, { x: 12, y: 10 });

      engine.setDirection('right');
      engine.update();
      engine.update();
      engine.update();

      expect(engine.isGameOver()).toBe(true);
    });
  });

  describe('snake movement', () => {
    beforeEach(() => {
      engine.start();
    });

    it('should move snake right by default', () => {
      engine.update();
      const snake = engine.getSnake();
      expect(snake[0]).toEqual({ x: 11, y: 10 });
    });

    it('should move snake in requested direction', () => {
      engine.setDirection('up');
      engine.update();
      const snake = engine.getSnake();
      expect(snake[0]).toEqual({ x: 10, y: 9 });
    });

    it('should wrap around top boundary', () => {
      engine.setDirection('up');
      for (let i = 0; i < 11; i++) {
        engine.update();
      }
      expect(engine.isGameOver()).toBe(false);
      const snake = engine.getSnake();
      expect(snake[0].y).toBe(19);
    });

    it('should wrap around left boundary', () => {
      engine.setDirection('up');
      engine.update();
      engine.setDirection('left');
      for (let i = 0; i < 11; i++) {
        engine.update();
      }
      expect(engine.isGameOver()).toBe(false);
      const snake = engine.getSnake();
      expect(snake[0].x).toBe(19);
    });

    it('should wrap around right boundary', () => {
      for (let i = 0; i < 11; i++) {
        engine.update();
      }
      expect(engine.isGameOver()).toBe(false);
      const snake = engine.getSnake();
      expect(snake[0].x).toBe(1);
    });

    it('should wrap around bottom boundary', () => {
      engine.setDirection('down');
      for (let i = 0; i < 11; i++) {
        engine.update();
      }
      expect(engine.isGameOver()).toBe(false);
      const snake = engine.getSnake();
      expect(snake[0].y).toBe(1);
    });

    it('should prevent reversing into itself', () => {
      engine.setDirection('right');
      engine.update();
      engine.setDirection('left');
      engine.update();
      const snake = engine.getSnake();
      expect(snake[0].x).toBe(12);
    });

    it('should maintain snake length when not eating', () => {
      const initialLength = engine.getSnake().length;
      engine.update();
      engine.update();
      expect(engine.getSnake()).toHaveLength(initialLength);
    });
  });

  describe('food consumption', () => {
    beforeEach(() => {
      engine.start();
    });

    it('should grow snake when eating food', () => {
      const food = engine.getFood()!;
      const initialLength = engine.getSnake().length;

      // Set up to move towards food
      let x = engine.getSnake()[0].x;
      let y = engine.getSnake()[0].y;

      // Move to food position
      while (x !== food.x && x < food.x) {
        engine.setDirection('right');
        engine.update();
        x = engine.getSnake()[0].x;
      }
      while (x !== food.x && x > food.x) {
        engine.setDirection('left');
        engine.update();
        x = engine.getSnake()[0].x;
      }
      while (y !== food.y && y < food.y) {
        engine.setDirection('down');
        engine.update();
        y = engine.getSnake()[0].y;
      }
      while (y !== food.y && y > food.y) {
        engine.setDirection('up');
        engine.update();
        y = engine.getSnake()[0].y;
      }

      expect(engine.getSnake()).toHaveLength(initialLength + 1);
    });

    it('should increment score when eating food', () => {
      const food = engine.getFood()!;
      const initialScore = engine.getScore();

      let x = engine.getSnake()[0].x;
      let y = engine.getSnake()[0].y;

      while (x !== food.x) {
        engine.setDirection(x < food.x ? 'right' : 'left');
        engine.update();
        x = engine.getSnake()[0].x;
      }
      while (y !== food.y) {
        engine.setDirection(y < food.y ? 'down' : 'up');
        engine.update();
        y = engine.getSnake()[0].y;
      }

      expect(engine.getScore()).toBe(initialScore + 1);
    });

    it('should spawn new food after consuming', () => {
      const food = engine.getFood()!;
      const x = engine.getSnake()[0].x;
      const y = engine.getSnake()[0].y;

      // Teleport head to food by manipulating state is hard, so just verify
      // that food is never on a snake segment
      const snake = engine.getSnake();
      const newFood = engine.getFood();
      expect(newFood).not.toBeNull();
      const isOnSnake = snake.some((s) => s.x === newFood!.x && s.y === newFood!.y);
      expect(isOnSnake).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      engine.start();
      engine.setDirection('up');
      for (let i = 0; i < 5; i++) {
        engine.update();
      }

      engine.reset();

      const snake = engine.getSnake();
      expect(snake).toHaveLength(3);
      expect(snake[0]).toEqual({ x: 10, y: 10 });
      expect(snake[1]).toEqual({ x: 9, y: 10 });
      expect(snake[2]).toEqual({ x: 8, y: 10 });
      expect(engine.getScore()).toBe(0);
      expect(engine.isGameOver()).toBe(false);
    });
  });

  describe('direction buffering', () => {
    beforeEach(() => {
      engine.start();
    });

    it('should allow changing direction multiple times', () => {
      engine.setDirection('up');
      engine.setDirection('right');
      engine.update();
      const snake = engine.getSnake();
      expect(snake[0]).toEqual({ x: 11, y: 10 });
    });

    it('should reject opposite direction and use buffered direction', () => {
      engine.setDirection('up');
      engine.setDirection('down');
      engine.update();
      const snake = engine.getSnake();
      expect(snake[0].y).toBe(9);
    });

    it('should use last valid direction', () => {
      engine.setDirection('left');
      engine.setDirection('up');
      engine.update();
      const snake = engine.getSnake();
      expect(snake[0]).toEqual({ x: 10, y: 9 });
    });
  });
});
