import type { EntityId } from "./content";

/**
 * Per-user progress. Stored separately from shared game data and keyed by
 * entity id, so a content update never overwrites what the user has done.
 */

export const MISSION_STATUSES = ["not_started", "in_progress", "completed"] as const;
export type MissionStatus = (typeof MISSION_STATUSES)[number];

export interface MissionProgress {
  status: MissionStatus;
  completedObjectives: EntityId[];
  updatedAt: string;
}

export interface ItemProgress {
  /** Marked as found for collection tracking. */
  collected: boolean;
  /** Pinned to the dashboard as "looking for". */
  tracked: boolean;
  updatedAt: string;
}

export interface UserSettings {
  /** Show records marked as mock data. */
  showMockData: boolean;
  compactMode: boolean;
}

export interface UserProgress {
  schemaVersion: 1;
  /** Content version the progress was last saved against. */
  contentVersion: string;
  missions: Record<EntityId, MissionProgress>;
  items: Record<EntityId, ItemProgress>;
  fobUpgrades: Record<EntityId, { built: boolean; updatedAt: string }>;
  settings: UserSettings;
  updatedAt: string;
}
