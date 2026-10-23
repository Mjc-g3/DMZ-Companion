import { Crosshair } from "lucide-react";

export function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-sm">
        <Crosshair className="size-4" strokeWidth={2.5} aria-hidden />
      </span>
      <span className="leading-none">
        <span className="block text-base font-black tracking-tight uppercase italic">
          DMZ <span className="text-primary">Companion</span>
        </span>
        <span className="text-muted-foreground mt-1 block text-[10px] tracking-[0.2em] uppercase">
          Unofficial · MW4
        </span>
      </span>
    </div>
  );
}
