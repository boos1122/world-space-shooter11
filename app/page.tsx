import GameCanvas from "@/components/GameCanvas";
import Hud from "@/components/Hud";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="relative w-full max-w-md mx-auto border-2 border-gray-600 rounded-lg overflow-hidden">
        <Hud />
        <GameCanvas />
      </div>
    </main>
  );
}
