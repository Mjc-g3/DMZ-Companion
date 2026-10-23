"use client";

import Link from "next/link";
import { ChevronRight, ListChecks, Package, Star, Target } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/common/states";
import { VerificationBadge } from "@/components/common/verification-badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getMissionProgress } from "@/features/progress/logic";
import { computeStats, type ProgressStats } from "@/features/progress/stats";
import { useVisibleContent } from "@/hooks/use-visible-content";
import { percent } from "@/lib/format";
import { useGameData } from "@/providers/game-data-provider";
import { useProgressState } from "@/providers/progress-provider";
import type { Item, Mission } from "@/types/game";
import type { MissionProgress } from "@/types/progress";

export function DashboardView() {
  const { bundle, locationsById } = useGameData();
  const state = useProgressState();
  const missions = useVisibleContent(bundle.missions);
  const items = useVisibleContent(bundle.items);
  const mockCount = [...bundle.missions, ...bundle.items, ...bundle.locations].filter(
    (entry) => entry.meta.verification === "mock",
  ).length;

  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="Your DMZ progress at a glance." />

      {mockCount > 0 && (
        <div className="border-warning/40 bg-warning/5 text-sm rounded-lg border px-4 py-3">
          <span className="text-warning font-medium">Development data.</span>{" "}
          <span className="text-muted-foreground">
            {mockCount} records are placeholders marked <em>Mock</em>. They are not real MW4 DMZ
            missions, items or locations and will be replaced with sourced data.
          </span>
        </div>
      )}

      {state.status === "loading" ? (
        <ListSkeleton rows={4} />
      ) : (
        <>
          {state.status === "error" && <ErrorState title="Progress storage problem" description={state.error} />}
          <DashboardContent
            stats={computeStats(state.progress, missions, items)}
            activeMissions={missions.filter((m) => getMissionProgress(state.progress, m.id).status === "in_progress")}
            trackedItems={items.filter((i) => state.progress.items[i.id]?.tracked)}
            progressOf={(id) => getMissionProgress(state.progress, id)}
            locationName={(id) => locationsById.get(id)?.name ?? id}
          />
        </>
      )}

      <p className="text-muted-foreground text-xs">
        Content v{bundle.version} · game build {bundle.gameVersion} · updated {bundle.updatedAt}
      </p>
    </PageContainer>
  );
}

function DashboardContent({
  stats,
  activeMissions,
  trackedItems,
  progressOf,
  locationName,
}: {
  stats: ProgressStats;
  activeMissions: Mission[];
  trackedItems: Item[];
  progressOf: (id: string) => MissionProgress;
  locationName: (id: string) => string;
}) {
  return (
    <>
      <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Missions"
          icon={ListChecks}
          value={`${stats.missions.completed}/${stats.missions.total}`}
          progress={percent(stats.missions.completed, stats.missions.total)}
          detail={`${stats.missions.inProgress} active · ${stats.missions.available} available`}
        />
        <StatCard
          label="Objectives"
          icon={Target}
          value={`${stats.objectives.completed}/${stats.objectives.total}`}
          progress={percent(stats.objectives.completed, stats.objectives.total)}
        />
        <StatCard
          label="Collection"
          icon={Package}
          value={`${percent(stats.collection.collected, stats.collection.total)}%`}
          progress={percent(stats.collection.collected, stats.collection.total)}
          detail={`${stats.collection.collected} of ${stats.collection.total} collectibles`}
        />
        <StatCard label="Tracked items" icon={Star} value={stats.trackedItems} detail="Pinned from Items & Loot" />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active missions</CardTitle>
            <CardAction>
              <Button asChild variant="ghost" size="sm">
                <Link href="/missions">
                  All missions <ChevronRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {activeMissions.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="No missions in progress"
                description="Tick off an objective on the Missions page to start tracking it here."
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {activeMissions.map((mission) => {
                  const p = progressOf(mission.id);
                  const done = p.completedObjectives.length;
                  const next = mission.objectives.find((o) => !p.completedObjectives.includes(o.id));
                  return (
                    <li key={mission.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate font-medium">{mission.name}</span>
                        <span className="text-muted-foreground shrink-0 tabular-nums">
                          {done}/{mission.objectives.length}
                        </span>
                      </div>
                      <Progress value={percent(done, mission.objectives.length)} aria-label={`${mission.name} progress`} />
                      {next && <p className="text-muted-foreground truncate text-xs">Next: {next.description}</p>}
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Looking for</CardTitle>
            <CardAction>
              <Button asChild variant="ghost" size="sm">
                <Link href="/items">
                  All items <ChevronRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {trackedItems.length === 0 ? (
              <EmptyState
                icon={Star}
                title="No tracked items"
                description="Star an item on the Items & Loot page to pin it here."
              />
            ) : (
              <ul className="divide-border flex flex-col divide-y">
                {trackedItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {item.foundAt.length ? item.foundAt.map(locationName).join(", ") : "Location unknown"}
                      </p>
                    </div>
                    <VerificationBadge meta={item.meta} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
