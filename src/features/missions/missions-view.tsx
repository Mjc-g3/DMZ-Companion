"use client";

import { useCallback, useMemo, useState } from "react";
import { ListChecks, RotateCcw } from "lucide-react";

import { FilterSelect } from "@/components/common/filter-select";
import { PageContainer, PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import {
  getMissionProgress,
  isMissionAvailable,
  setMissionStatus,
  toggleObjective,
} from "@/features/progress/logic";
import { useVisibleContent } from "@/hooks/use-visible-content";
import { useGameData } from "@/providers/game-data-provider";
import { useProgressState, useProgressStore } from "@/providers/progress-provider";
import type { Mission } from "@/types/game";
import type { MissionStatus, UserProgress } from "@/types/progress";
import { DEFAULT_MISSION_FILTERS, filterMissions, type MissionFilters, type MissionStatusFilter } from "./filter";
import { MissionCard } from "./mission-card";

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "locked", label: "Locked" },
] as const;

export function MissionsView() {
  const index = useGameData();
  const store = useProgressStore();
  const state = useProgressState();
  const missions = useVisibleContent(index.bundle.missions);
  const [filters, setFilters] = useState<MissionFilters>(DEFAULT_MISSION_FILTERS);

  const factions = useMemo(
    () => [...new Set(missions.map((m) => m.faction))].sort().map((f) => ({ value: f, label: f })),
    [missions],
  );
  const tiers = useMemo(
    () => [...new Set(missions.map((m) => m.tier))].sort((a, b) => a - b).map((t) => ({ value: String(t), label: `Tier ${t}` })),
    [missions],
  );

  const onToggleObjective = useCallback(
    (mission: Mission, objectiveId: string) => store.update((p) => toggleObjective(p, mission, objectiveId)),
    [store],
  );
  const onSetStatus = useCallback(
    (mission: Mission, status: MissionStatus) => store.update((p) => setMissionStatus(p, mission, status)),
    [store],
  );

  const set = <K extends keyof MissionFilters>(key: K) => (value: MissionFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));
  const filtersActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_MISSION_FILTERS);

  return (
    <PageContainer>
      <PageHeader title="Missions" description="Track objectives and mission progress." />

      <div className="flex flex-wrap items-center gap-2" role="search">
        <SearchInput
          label="Search missions"
          placeholder="Search missions or objectives…"
          value={filters.query}
          onChange={set("query")}
          className="w-full sm:w-72"
        />
        <FilterSelect label="Faction" allLabel="All factions" value={filters.faction} onChange={set("faction")} options={factions} />
        <FilterSelect
          label="Status"
          allLabel="Any status"
          value={filters.status}
          onChange={(v) => set("status")(v as MissionStatusFilter)}
          options={STATUS_OPTIONS}
        />
        <FilterSelect label="Tier" allLabel="All tiers" value={filters.tier} onChange={set("tier")} options={tiers} />
        {filtersActive && (
          <Button variant="ghost" size="sm" onClick={() => setFilters(DEFAULT_MISSION_FILTERS)}>
            <RotateCcw /> Reset
          </Button>
        )}
      </div>

      {state.status === "loading" ? (
        <ListSkeleton />
      ) : (
        <>
          {state.status === "error" && <ErrorState title="Progress storage problem" description={state.error} />}
          <MissionList
            missions={missions}
            visible={filterMissions(missions, state.progress, filters)}
            progress={state.progress}
            onClearFilters={() => setFilters(DEFAULT_MISSION_FILTERS)}
            onToggleObjective={onToggleObjective}
            onSetStatus={onSetStatus}
          />
        </>
      )}
    </PageContainer>
  );
}


function MissionList({
  missions,
  visible,
  progress,
  onClearFilters,
  onToggleObjective,
  onSetStatus,
}: {
  missions: Mission[];
  visible: Mission[];
  progress: UserProgress;
  onClearFilters: () => void;
  onToggleObjective: (mission: Mission, objectiveId: string) => void;
  onSetStatus: (mission: Mission, status: MissionStatus) => void;
}) {
  const index = useGameData();

  if (missions.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No missions yet"
        description="Verified mission data has not been added. Turn on mock data in Settings to try the tracker."
      />
    );
  }
  if (visible.length === 0) {
    return (
      <EmptyState
        title="No missions match"
        description="Try a different search or clear the filters."
        action={
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        }
      />
    );
  }
  return (
    <>
      <p className="text-muted-foreground text-xs" aria-live="polite">
        Showing {visible.length} of {missions.length} missions
      </p>
      <div className="grid gap-3 lg:grid-cols-2">
        {visible.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            index={index}
            progress={getMissionProgress(progress, mission.id)}
            available={isMissionAvailable(progress, mission)}
            onToggleObjective={onToggleObjective}
            onSetStatus={onSetStatus}
          />
        ))}
      </div>
    </>
  );
}
