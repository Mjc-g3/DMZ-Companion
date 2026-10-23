import type { GameDataBundle } from "@/types/game";
import { fobUpgrades, recipes } from "./crafting";
import { items } from "./items";
import { locations } from "./locations";
import { maps } from "./maps";
import { CONTENT_VERSION } from "./meta";
import { missions } from "./missions";

export const gameData: GameDataBundle = {
  version: CONTENT_VERSION,
  gameVersion: "unknown",
  updatedAt: "2026-10-23",
  maps,
  locations,
  items,
  missions,
  recipes,
  fobUpgrades,
};
