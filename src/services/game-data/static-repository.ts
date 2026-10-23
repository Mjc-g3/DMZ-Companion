import { gameData } from "@/data/content";
import type { GameDataRepository } from "./repository";

export const staticGameDataRepository: GameDataRepository = {
  async getBundle() {
    return gameData;
  },
};
