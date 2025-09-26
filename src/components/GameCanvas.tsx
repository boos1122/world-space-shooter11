'use client';
import { useEffect, useRef } from 'react';
import { createGame } from '@/game';

export default function GameCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    // 确保只初始化一次
    if (ref.current.children.length > 0) return;

    const game = createGame(ref.current.id);

    return () => {
      // 组件卸载时销毁游戏实例，释放资源
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-root" ref={ref} className="w-full h-[800px]" />;
}
