"use client";
import { useEffect } from "react";

export default function GameCanvas() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("@/game/index").catch(console.error);
  }, []);

  return (
    <div
      id="phaser-root"
      style={{ width: "100%", height: "100vh" }}
    />
  );
}
