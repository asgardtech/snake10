import { Route, Routes, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Game } from "@/components/Game";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">
        {"snake"}
      </h1>
      <p className="text-muted-foreground max-w-prose text-center">
        {"a snake like game in the browser"}
      </p>
      <Button onClick={() => navigate("/game")}>
        Get started
      </Button>
    </main>
  );
}

function GamePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold tracking-tight">{"snake"}</h1>
      <Game />
      <Button onClick={() => navigate("/")} variant="outline">
        Back to Home
      </Button>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}
