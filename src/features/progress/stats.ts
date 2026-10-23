import type { Item, Mission } from "@/types/game";
import type { UserProgress } from "@/types/progress";
import { getMissionProgress, isMissionAvailable } from "./logic";

export interface ProgressStats {
  missions: { total: number; completed: number; inProgress: number; available: number };
  objectives: { total: number; completed: number };
  collection: { total: number; collected: number };
  trackedItems: number;
}

export function computeStats(progress: UserProgress, missions: Mission[], items: Item[]): ProgressStats {
  let completed = 0;
  let inProgress = 0;
  let available = 0;
  let objectivesTotal = 0;
  let objectivesDone = 0;

  for (const mission of missions) {
    const state = getMissionProgress(progress, mission.id);
    if (state.status === "completed") completed++;
    else if (state.status === "in_progress") inProgress++;
    else if (isMissionAvailable(progress, mission)) available++;
    objectivesTotal += mission.objectives.length;
    objectivesDone += state.completedObjectives.length;
  }

  const collectibles = items.filter((item) => item.collectible);
  return {
    missions: { total: missions.length, completed, inProgress, available },
    objectives: { total: objectivesTotal, completed: objectivesDone },
    collection: {
      total: collectibles.length,
      collected: collectibles.filter((item) => progress.items[item.id]?.collected).length,
    },
    trackedItems: items.filter((item) => progress.items[item.id]?.tracked).length,
  };
}
