import type { EntityId, Mission } from "@/types/game";
import type { MissionProgress, MissionStatus, UserProgress } from "@/types/progress";

/** Pure progress updates. Every function returns a new UserProgress. */

export function createEmptyProgress(contentVersion: string): UserProgress {
  return {
    schemaVersion: 1,
    contentVersion,
    missions: {},
    items: {},
    fobUpgrades: {},
    settings: { showMockData: true, compactMode: false },
    updatedAt: new Date(0).toISOString(),
  };
}

const now = () => new Date().toISOString();

export function getMissionProgress(progress: UserProgress, missionId: EntityId): MissionProgress {
  return (
    progress.missions[missionId] ?? {
      status: "not_started",
      completedObjectives: [],
      updatedAt: progress.updatedAt,
    }
  );
}

export function setMissionStatus(
  progress: UserProgress,
  mission: Mission,
  status: MissionStatus,
): UserProgress {
  const current = getMissionProgress(progress, mission.id);
  const completedObjectives =
    status === "completed"
      ? mission.objectives.map((o) => o.id)
      : status === "not_started"
        ? []
        : current.completedObjectives;
  const time = now();
  return {
    ...progress,
    missions: { ...progress.missions, [mission.id]: { status, completedObjectives, updatedAt: time } },
    updatedAt: time,
  };
}

/** Toggles one objective and derives the mission status from the objectives. */
export function toggleObjective(
  progress: UserProgress,
  mission: Mission,
  objectiveId: EntityId,
): UserProgress {
  const current = getMissionProgress(progress, mission.id);
  const done = new Set(current.completedObjectives);
  if (done.has(objectiveId)) done.delete(objectiveId);
  else done.add(objectiveId);

  // Keep the mission's own objective order and drop ids that no longer exist.
  const completedObjectives = mission.objectives.map((o) => o.id).filter((id) => done.has(id));
  const status: MissionStatus =
    completedObjectives.length === 0
      ? "not_started"
      : completedObjectives.length === mission.objectives.length
        ? "completed"
        : "in_progress";
  const time = now();
  return {
    ...progress,
    missions: { ...progress.missions, [mission.id]: { status, completedObjectives, updatedAt: time } },
    updatedAt: time,
  };
}

function updateItem(
  progress: UserProgress,
  itemId: EntityId,
  key: "collected" | "tracked",
): UserProgress {
  const current = progress.items[itemId] ?? { collected: false, tracked: false, updatedAt: progress.updatedAt };
  const time = now();
  return {
    ...progress,
    items: { ...progress.items, [itemId]: { ...current, [key]: !current[key], updatedAt: time } },
    updatedAt: time,
  };
}

export const toggleItemCollected = (progress: UserProgress, itemId: EntityId) =>
  updateItem(progress, itemId, "collected");

export const toggleItemTracked = (progress: UserProgress, itemId: EntityId) =>
  updateItem(progress, itemId, "tracked");

/** Missions whose prerequisites are all completed. */
export function isMissionAvailable(progress: UserProgress, mission: Mission): boolean {
  return mission.prerequisites.every((id) => progress.missions[id]?.status === "completed");
}
