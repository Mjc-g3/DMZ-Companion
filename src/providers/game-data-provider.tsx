"use client";

import { createContext, useContext, useMemo } from "react";

import { buildGameIndex, type GameIndex } from "@/lib/game-index";
import type { GameDataBundle } from "@/types/game";

const GameDataContext = createContext<GameIndex | null>(null);

export function GameDataProvider({
  bundle,
  children,
}: {
  bundle: GameDataBundle;
  children: React.ReactNode;
}) {
  const index = useMemo(() => buildGameIndex(bundle), [bundle]);
  return <GameDataContext.Provider value={index}>{children}</GameDataContext.Provider>;
}

export function useGameData(): GameIndex {
  const index = useContext(GameDataContext);
  if (!index) throw new Error("useGameData must be used inside GameDataProvider");
  return index;
}
