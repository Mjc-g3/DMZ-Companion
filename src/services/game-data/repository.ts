import type { GameDataBundle } from "@/types/game";

/**
 * Source of shared game data. The static implementation reads the bundled
 * content files; a Supabase implementation can replace it without touching UI.
 */
export interface GameDataRepository {
  getBundle(): Promise<GameDataBundle>;
}
