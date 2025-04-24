'use client';

import { useEffect, useRef } from 'react';
import BackButton from '@/components/BackButton';
import SpriteUploader from "@/components/SpriteLoader";


export default function GamePage() {
  const gameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const waitForPhaser = () =>
      new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (typeof window !== 'undefined' && (window as any).Phaser) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      });

    const loadGame = async () => {
      // await waitForPhaser();
      const { default: Game } = await import('@/game/main');
      new Game(gameContainer.current!);
    };

    loadGame();
  }, []);

  return (
    <main className="w-screen h-screen m-0 p-0 overflow-hidden">
      <div ref={gameContainer} className="w-full h-full" />
      <SpriteUploader /> 

      {/* <BackButton />  */}

    </main>
  );
}
