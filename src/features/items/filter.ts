import { matchesQuery } from "@/lib/format";
import type { Item, ItemCategory, ItemRarity } from "@/types/game";
import type { UserProgress } from "@/types/progress";

export type ItemStatusFilter = "all" | "collected" | "missing" | "tracked";

export interface ItemFilters {
  query: string;
  category: ItemCategory | "all";
  rarity: ItemRarity | "all";
  status: ItemStatusFilter;
}

export const DEFAULT_ITEM_FILTERS: ItemFilters = { query: "", category: "all", rarity: "all", status: "all" };

export function filterItems(
  items: Item[],
  progress: UserProgress,
  filters: ItemFilters,
  locationName: (id: string) => string = (id) => id,
): Item[] {
  return items.filter((item) => {
    if (filters.category !== "all" && item.category !== filters.category) return false;
    if (filters.rarity !== "all" && item.rarity !== filters.rarity) return false;
    const state = progress.items[item.id];
    if (filters.status === "collected" && !state?.collected) return false;
    if (filters.status === "missing" && (state?.collected || !item.collectible)) return false;
    if (filters.status === "tracked" && !state?.tracked) return false;
    return matchesQuery(filters.query, item.name, item.category, item.description, ...item.foundAt.map(locationName));
  });
}
