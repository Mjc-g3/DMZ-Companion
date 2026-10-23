import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  progress,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  progress?: number;
  icon: LucideIcon;
}) {
  return (
    <Card className="gap-2 py-3">
      <CardContent className="flex flex-col gap-2 px-3">
        <div className="text-muted-foreground flex items-center justify-between text-xs font-medium tracking-wide uppercase">
          {label}
          <Icon className="size-4" aria-hidden />
        </div>
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        {progress !== undefined && <Progress value={progress} aria-label={`${label} ${progress}%`} />}
        {detail && <div className="text-muted-foreground text-xs">{detail}</div>}
      </CardContent>
    </Card>
  );
}
