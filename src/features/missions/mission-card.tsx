"use client";

import { memo } from "react";
import { Lock, MapPin } from "lucide-react";

import { VerificationBadge } from "@/components/common/verification-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { humanize, percent } from "@/lib/format";
import type { GameIndex } from "@/lib/game-index";
import { cn } from "@/lib/utils";
import type { Mission } from "@/types/game";
import { MISSION_STATUSES, type MissionProgress, type MissionStatus } from "@/types/progress";

const STATUS_VARIANT = {
  not_started: "outline",
  in_progress: "warning",
  completed: "success",
} as const;

export const MissionCard = memo(function MissionCard({
  mission,
  progress,
  available,
  index,
  onToggleObjective,
  onSetStatus,
}: {
  mission: Mission;
  progress: MissionProgress;
  available: boolean;
  index: GameIndex;
  onToggleObjective: (mission: Mission, objectiveId: string) => void;
  onSetStatus: (mission: Mission, status: MissionStatus) => void;
}) {
  const done = progress.completedObjectives.length;
  const total = mission.objectives.length;
  const locked = !available && progress.status === "not_started";
  const headingId = `${mission.id}-title`;

  return (
    <Card
      aria-labelledby={headingId}
      className={cn("gap-3 transition-colors", progress.status === "completed" && "opacity-75")}
      role="article"
    >
      <CardHeader>
        <CardTitle id={headingId} className="flex flex-wrap items-center gap-2 text-base">
          {mission.name}
          <VerificationBadge meta={mission.meta} />
        </CardTitle>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span>{mission.faction}</span>
          <span>Tier {mission.tier}</span>
          {mission.mapId && <span>{index.mapsById.get(mission.mapId)?.name ?? mission.mapId}</span>}
          {locked && (
            <span className="text-warning inline-flex items-center gap-1">
              <Lock className="size-3" aria-hidden />
              Requires{" "}
              {mission.prerequisites.map((id) => index.missionsById.get(id)?.name ?? id).join(", ")}
            </span>
          )}
        </div>
        <CardAction>
          <Select value={progress.status} onValueChange={(value) => onSetStatus(mission, value as MissionStatus)}>
            <SelectTrigger size="sm" aria-label={`Status of ${mission.name}`} className="w-36">
              <SelectValue>
                <Badge variant={STATUS_VARIANT[progress.status]}>{humanize(progress.status)}</Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {MISSION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {humanize(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Progress value={percent(done, total)} aria-label={`${mission.name}: ${done} of ${total} objectives`} />
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
            {done}/{total}
          </span>
        </div>

        <ul className="flex flex-col gap-1">
          {mission.objectives.map((objective) => {
            const id = `${mission.id}-${objective.id}`;
            const checked = progress.completedObjectives.includes(objective.id);
            const location = objective.locationId ? index.locationsById.get(objective.locationId) : undefined;
            return (
              <li key={objective.id} className="hover:bg-accent/40 flex items-start gap-2.5 rounded-md px-1.5 py-1.5">
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={() => onToggleObjective(mission, objective.id)}
                  className="mt-0.5"
                />
                <label htmlFor={id} className="flex-1 cursor-pointer text-sm leading-snug">
                  <span className={cn(checked && "text-muted-foreground line-through")}>{objective.description}</span>
                  {location && (
                    <span className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                      <MapPin className="size-3" aria-hidden />
                      {location.name}
                    </span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>

        {mission.rewards.length > 0 && (
          <p className="text-muted-foreground text-xs">
            <span className="text-foreground/80 font-medium">Rewards:</span>{" "}
            {mission.rewards.map((r) => r.label).join(", ")}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
