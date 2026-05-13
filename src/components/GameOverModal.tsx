import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GameOverModalProps {
  open: boolean;
  score: number;
  onRestart: () => void;
  onNewGame: () => void;
}

export function GameOverModal({
  open,
  score,
  onRestart,
  onNewGame,
}: GameOverModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent aria-describedby="game-over-description">
        <DialogHeader>
          <DialogTitle>Game Over</DialogTitle>
          <DialogDescription id="game-over-description">
            Your game has ended. Final score: {score}
          </DialogDescription>
        </DialogHeader>

        <div className="text-center py-4">
          <div className="text-5xl font-bold text-primary">{score}</div>
        </div>

        <DialogFooter className="gap-3 pt-4">
          <Button onClick={onNewGame} variant="outline" className="w-full sm:w-auto">
            New Game
          </Button>
          <Button onClick={onRestart} className="w-full sm:w-auto">
            Restart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
