import { Route, Routes } from "react-router-dom";

import { Button } from "@/components/ui/button";

function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">
        {"snake"}
      </h1>
      <p className="text-muted-foreground max-w-prose text-center">
        {"a snake like game in the browser"}
      </p>
      <Button onClick={() => console.log("hello from shadcn")}>
        Get started
      </Button>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
