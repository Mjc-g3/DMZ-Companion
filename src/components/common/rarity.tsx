import { cn } from "@/lib/utils";
import { humanize } from "@/lib/format";
import type { ItemRarity } from "@/types/game";

const RARITY_CLASS: Record<ItemRarity, string> = {
  common: "text-muted-foreground border-border",
  uncommon: "text-emerald-400 border-emerald-400/30",
  rare: "text-sky-400 border-sky-400/30",
  epic: "text-violet-400 border-violet-400/30",
  legendary: "text-amber-400 border-amber-400/30",
};

export function RarityTag({ rarity }: { rarity: ItemRarity }) {
  return (
    <span className={cn("rounded border px-1.5 py-0.5 text-[11px] font-medium", RARITY_CLASS[rarity])}>
      {humanize(rarity)}
    </span>
  );
}
