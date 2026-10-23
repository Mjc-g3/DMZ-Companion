import { Crosshair } from "lucide-react";

export function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-primary/15 text-primary grid size-8 place-items-center rounded-md">
        <Crosshair className="size-4" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-wide uppercase">DMZ Companion</span>
        <span className="text-muted-foreground block text-[11px]">Unofficial · MW4</span>
      </span>
    </div>
  );
}
