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

    it('should pause game when pause is called', () => {
      engine.start();
      expect(engine.isPlaying()).toBe(true);
      engine.pause();
      expect(engine.isPlaying()).toBe(false);
      expect(engine.getGameState()).toBe('paused');
    });

    it('should resume game when resume is called', () => {
      engine.start();
      engine.pause();
      engine.resume();
      expect(engine.isPlaying()).toBe(true);
      expect(engine.getGameState()).toBe('playing');
    });

    it('should preserve game state when pausing', () => {
      engine.start();
      engine.setDirection('up');
      for (let i = 0; i < 3; i++) {
        engine.update();
      }
      const snakeBeforePause = engine.getSnake();
      const scoreBeforePause = engine.getScore();

      engine.pause();
      engine.resume();

      expect(engine.getSnake()).toEqual(snakeBeforePause);
      expect(engine.getScore()).toBe(scoreBeforePause);
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

    it('should end game when hitting top boundary', () => {
      engine.setDirection('up');
      for (let i = 0; i < 11; i++) {
        engine.update();
      }
      expect(engine.isGameOver()).toBe(true);
    });

    it('should end game when hitting left boundary', () => {
      engine.setDirection('up');
      engine.update();
      engine.setDirection('left');
      for (let i = 0; i < 11; i++) {
        engine.update();
      }
      expect(engine.isGameOver()).toBe(true);
    });

    it('should end game when hitting right boundary', () => {
      for (let i = 0; i < 11; i++) {
        engine.update();
      }
      expect(engine.isGameOver()).toBe(true);
    });

    it('should end game when hitting bottom boundary', () => {
      engine.setDirection('down');
      for (let i = 0; i < 11; i++) {
        engine.update();
      }
      expect(engine.isGameOver()).toBe(true);
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

    it('should spawn food at valid position', () => {
      const food = engine.getFood();
      expect(food).not.toBeNull();
      expect(food!.x).toBeGreaterThanOrEqual(0);
      expect(food!.x).toBeLessThan(20);
      expect(food!.y).toBeGreaterThanOrEqual(0);
      expect(food!.y).toBeLessThan(20);
    });

    it('should grow snake when head reaches food position', () => {
      const initialLength = engine.getSnake().length;
      engine.setFood({ x: 11, y: 10 });
      engine.setDirection('right');
      engine.update();
      expect(engine.getSnake()).toHaveLength(initialLength + 1);
    });

    it('should increment score when eating food', () => {
      const initialScore = engine.getScore();
      engine.setFood({ x: 11, y: 10 });
      engine.setDirection('right');
      engine.update();
      expect(engine.getScore()).toBe(initialScore + 1);
    });

    it('should spawn new food after consuming', () => {
      engine.setFood({ x: 11, y: 10 });
      const foodBeforeConsume = engine.getFood();
      engine.setDirection('right');
      engine.update();
      const foodAfterConsume = engine.getFood();
      expect(foodBeforeConsume).toEqual({ x: 11, y: 10 });
      expect(foodAfterConsume).not.toEqual(foodBeforeConsume);
      expect(foodAfterConsume).not.toBeNull();
      const newFood = foodAfterConsume!;
      expect(newFood.x).toBeGreaterThanOrEqual(0);
      expect(newFood.x).toBeLessThan(20);
      expect(newFood.y).toBeGreaterThanOrEqual(0);
      expect(newFood.y).toBeLessThan(20);
      expect(engine.getSnake().some((seg) => seg.x === newFood.x && seg.y === newFood.y)).toBe(false);
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
