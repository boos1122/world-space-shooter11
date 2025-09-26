"use client";
import { useEffect } from "react";
import Phaser from "phaser";

export default function GameCanvas() {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      backgroundColor: "#000000",
      scene: []
    };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div id="game-container" style={{width:"100vw",height:"100vh"}} />;
}
