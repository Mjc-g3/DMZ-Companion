import type { UserProgress } from "@/types/progress";

/**
 * Persistence for user progress. The localStorage adapter is used today; a
 * Supabase adapter can implement the same interface for account sync.
 */
export interface ProgressRepository {
  load(): Promise<unknown>;
  save(progress: UserProgress): Promise<void>;
  clear(): Promise<void>;
}
