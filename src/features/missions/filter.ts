import { getMissionProgress, isMissionAvailable } from "@/features/progress/logic";
import { matchesQuery } from "@/lib/format";
import type { Mission } from "@/types/game";
import type { MissionStatus, UserProgress } from "@/types/progress";

export type MissionStatusFilter = MissionStatus | "locked" | "all";

export interface MissionFilters {
  query: string;
  faction: string;
  status: MissionStatusFilter;
  tier: string;
}

export const DEFAULT_MISSION_FILTERS: MissionFilters = { query: "", faction: "all", status: "all", tier: "all" };

export function filterMissions(missions: Mission[], progress: UserProgress, filters: MissionFilters): Mission[] {
  return missions.filter((mission) => {
    if (filters.faction !== "all" && mission.faction !== filters.faction) return false;
    if (filters.tier !== "all" && String(mission.tier) !== filters.tier) return false;
    if (filters.status !== "all") {
      const status = getMissionProgress(progress, mission.id).status;
      if (filters.status === "locked") {
        if (status !== "not_started" || isMissionAvailable(progress, mission)) return false;
      } else if (status !== filters.status) return false;
    }
    return matchesQuery(
      filters.query,
      mission.name,
      mission.faction,
      mission.description,
      ...mission.objectives.map((o) => o.description),
    );
  });
}
