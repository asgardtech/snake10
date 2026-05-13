export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameState = 'idle' | 'playing' | 'gameOver';

interface Position {
  x: number;
  y: number;
}

export class GameEngine {
  private gridWidth: number;
  private gridHeight: number;
  private gridSize: number;

  private snake: Position[] = [];
  private food: Position | null = null;
  private direction: Direction = 'right';
  private nextDirection: Direction = 'right';
  private score: number = 0;
  private gameState: GameState = 'idle';

  constructor(canvasWidth: number, canvasHeight: number, gridSize: number) {
    this.gridWidth = canvasWidth / gridSize;
    this.gridHeight = canvasHeight / gridSize;
    this.gridSize = gridSize;
    this.reset();
  }

  reset() {
    const centerX = Math.floor(this.gridWidth / 2);
    const centerY = Math.floor(this.gridHeight / 2);
    this.snake = [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY },
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameState = 'idle';
    this.spawnFood();
  }

  start() {
    this.gameState = 'playing';
  }

  update() {
    if (this.gameState !== 'playing') return;

    this.direction = this.nextDirection;
    const head = this.snake[0];
    const newHead = this.getNextPosition(head, this.direction);

    if (this.isCollision(newHead)) {
      this.gameState = 'gameOver';
      return;
    }

    this.snake.unshift(newHead);

    if (this.food && newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score += 10;
      this.spawnFood();
    } else {
      this.snake.pop();
    }
  }

  setDirection(direction: Direction) {
    const isOpposite = this.isOppositeDirection(direction, this.nextDirection);
    if (!isOpposite) {
      this.nextDirection = direction;
    }
  }

  private getNextPosition(pos: Position, dir: Direction): Position {
    let nextX = pos.x;
    let nextY = pos.y;
    switch (dir) {
      case 'up':
        nextY = pos.y - 1;
        break;
      case 'down':
        nextY = pos.y + 1;
        break;
      case 'left':
        nextX = pos.x - 1;
        break;
      case 'right':
        nextX = pos.x + 1;
        break;
    }
    // Apply wraparound with modulo arithmetic
    return {
      x: ((nextX % this.gridWidth) + this.gridWidth) % this.gridWidth,
      y: ((nextY % this.gridHeight) + this.gridHeight) % this.gridHeight,
    };
  }

  private isOppositeDirection(dir1: Direction, dir2: Direction): boolean {
    return (
      (dir1 === 'up' && dir2 === 'down') ||
      (dir1 === 'down' && dir2 === 'up') ||
      (dir1 === 'left' && dir2 === 'right') ||
      (dir1 === 'right' && dir2 === 'left')
    );
  }

  private isCollision(pos: Position): boolean {
    return this.snake.some((segment) => segment.x === pos.x && segment.y === pos.y);
  }

  private spawnFood() {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * this.gridWidth),
        y: Math.floor(Math.random() * this.gridHeight),
      };
    } while (this.snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    this.food = newFood;
  }

  getSnake(): Position[] {
    return [...this.snake];
  }

  getFood(): Position | null {
    return this.food;
  }

  getScore(): number {
    return this.score;
  }

  getGameState(): GameState {
    return this.gameState;
  }

  isGameOver(): boolean {
    return this.gameState === 'gameOver';
  }

  isPlaying(): boolean {
    return this.gameState === 'playing';
  }
}
