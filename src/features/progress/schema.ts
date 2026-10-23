import type { UserProgress } from "@/types/progress";
import { createEmptyProgress } from "./logic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validates and migrates stored progress. Unknown or broken input falls back
 * to empty progress rather than crashing the app.
 */
export function parseProgress(raw: unknown, contentVersion: string): UserProgress {
  const empty = createEmptyProgress(contentVersion);
  if (!isRecord(raw) || raw.schemaVersion !== 1) return empty;

  const settings = isRecord(raw.settings) ? raw.settings : {};
  return {
    schemaVersion: 1,
    contentVersion,
    missions: isRecord(raw.missions) ? (raw.missions as UserProgress["missions"]) : {},
    items: isRecord(raw.items) ? (raw.items as UserProgress["items"]) : {},
    fobUpgrades: isRecord(raw.fobUpgrades) ? (raw.fobUpgrades as UserProgress["fobUpgrades"]) : {},
    settings: {
      showMockData:
        typeof settings.showMockData === "boolean" ? settings.showMockData : empty.settings.showMockData,
      compactMode:
        typeof settings.compactMode === "boolean" ? settings.compactMode : empty.settings.compactMode,
    },
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : empty.updatedAt,
  };
}
