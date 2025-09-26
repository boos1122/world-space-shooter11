"use client";
import { useEffect } from "react";
import Phaser from "phaser";

export default function GamePage() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "game-container",
      scene: {
        preload: function () {
          this.load.image("logo", "/assets/logo.png");
        },
        create: function () {
          this.add.image(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "logo"
          );
        },
      },
    };
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return (
    <div
      id="game-container"
      style={{ width: "100vw", height: "100vh", background: "black" }}
    />
  );
}
