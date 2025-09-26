import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('../../components/GameCanvas'), { ssr: false });

export default function GamePage() {
  return (
    <main style={{padding:'1rem', textAlign:'center'}}>
      <h1>🎮 Space Shooter</h1>
      <GameCanvas />
    </main>
  );
}
