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
    this.snake = [
      { x: Math.floor(this.gridWidth / 2), y: Math.floor(this.gridHeight / 2) },
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
    const nextPos = { ...pos };
    switch (dir) {
      case 'up':
        nextPos.y = (pos.y - 1 + this.gridHeight) % this.gridHeight;
        break;
      case 'down':
        nextPos.y = (pos.y + 1) % this.gridHeight;
        break;
      case 'left':
        nextPos.x = (pos.x - 1 + this.gridWidth) % this.gridWidth;
        break;
      case 'right':
        nextPos.x = (pos.x + 1) % this.gridWidth;
        break;
    }
    return nextPos;
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
    return this.snake;
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
