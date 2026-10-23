import type { GameDataBundle } from "@/types/game";
import { staticGameDataRepository } from "./static-repository";

export type { GameDataRepository } from "./repository";

/** Server-side entry point for game data. Swap the repository here for Supabase. */
export async function getGameData(): Promise<GameDataBundle> {
  "use cache";
  return staticGameDataRepository.getBundle();
}
