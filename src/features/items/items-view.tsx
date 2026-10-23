"use client";

import { useMemo, useState } from "react";
import { Package, RotateCcw, Star } from "lucide-react";

import { FilterSelect } from "@/components/common/filter-select";
import { PageContainer, PageHeader } from "@/components/common/page-header";
import { RarityTag } from "@/components/common/rarity";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/common/states";
import { VerificationBadge } from "@/components/common/verification-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toggleItemCollected, toggleItemTracked } from "@/features/progress/logic";
import { useVisibleContent } from "@/hooks/use-visible-content";
import { humanize, percent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useGameData } from "@/providers/game-data-provider";
import { useProgressState, useProgressStore } from "@/providers/progress-provider";
import { ITEM_CATEGORIES, ITEM_RARITIES, type Item } from "@/types/game";
import { DEFAULT_ITEM_FILTERS, filterItems, type ItemFilters, type ItemStatusFilter } from "./filter";
import { ItemDetailDialog } from "./item-detail-dialog";

const CATEGORY_OPTIONS = ITEM_CATEGORIES.map((value) => ({ value, label: humanize(value) }));
const RARITY_OPTIONS = ITEM_RARITIES.map((value) => ({ value, label: humanize(value) }));
const STATUS_OPTIONS = [
  { value: "collected", label: "Collected" },
  { value: "missing", label: "Missing" },
  { value: "tracked", label: "Tracked" },
] as const;

export function ItemsView() {
  const index = useGameData();
  const store = useProgressStore();
  const state = useProgressState();
  const items = useVisibleContent(index.bundle.items);
  const [filters, setFilters] = useState<ItemFilters>(DEFAULT_ITEM_FILTERS);
  const [selected, setSelected] = useState<Item | null>(null);

  const locationName = (id: string) => index.locationsById.get(id)?.name ?? id;
  const visible = useMemo(
    () => (state.progress ? filterItems(items, state.progress, filters, (id) => index.locationsById.get(id)?.name ?? id) : []),
    [items, state.progress, filters, index],
  );

  const set = <K extends keyof ItemFilters>(key: K) => (value: ItemFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));
  const filtersActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_ITEM_FILTERS);

  const collectibles = items.filter((i) => i.collectible);
  const collected = state.progress ? collectibles.filter((i) => state.progress.items[i.id]?.collected).length : 0;

  return (
    <PageContainer>
      <PageHeader
        title="Items & Loot"
        description="Track your collection and find where items spawn."
        actions={
          state.progress && (
            <div className="flex w-48 flex-col gap-1 text-right text-xs">
              <span className="text-muted-foreground">
                Collection <span className="text-foreground font-medium tabular-nums">{collected}/{collectibles.length}</span>
              </span>
              <Progress value={percent(collected, collectibles.length)} aria-label="Collection progress" />
            </div>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-2" role="search">
        <SearchInput
          label="Search items"
          placeholder="Search items or locations…"
          value={filters.query}
          onChange={set("query")}
          className="w-full sm:w-72"
        />
        <FilterSelect label="Category" allLabel="All categories" value={filters.category} onChange={set("category")} options={CATEGORY_OPTIONS} />
        <FilterSelect label="Rarity" allLabel="All rarities" value={filters.rarity} onChange={set("rarity")} options={RARITY_OPTIONS} />
        <FilterSelect
          label="Status"
          allLabel="Any status"
          value={filters.status}
          onChange={(v) => set("status")(v as ItemStatusFilter)}
          options={STATUS_OPTIONS}
        />
        {filtersActive && (
          <Button variant="ghost" size="sm" onClick={() => setFilters(DEFAULT_ITEM_FILTERS)}>
            <RotateCcw /> Reset
          </Button>
        )}
      </div>

      {state.status === "loading" ? (
        <ListSkeleton rows={8} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No items yet"
          description="Verified item data has not been added. Turn on mock data in Settings to try the tracker."
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No items match"
          description="Try a different search or clear the filters."
          action={
            <Button variant="outline" size="sm" onClick={() => setFilters(DEFAULT_ITEM_FILTERS)}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          {state.status === "error" && <ErrorState title="Progress storage problem" description={state.error} />}
          <p className="text-muted-foreground text-xs" aria-live="polite">
            Showing {visible.length} of {items.length} items
          </p>
          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10">
                    <span className="sr-only">Collected</span>
                  </TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Rarity</TableHead>
                  <TableHead className="hidden md:table-cell">Found at</TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Track</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((item) => {
                  const p = state.progress.items[item.id];
                  return (
                    <TableRow key={item.id} data-state={p?.collected ? "selected" : undefined}>
                      <TableCell>
                        {item.collectible ? (
                          <Checkbox
                            checked={p?.collected ?? false}
                            onCheckedChange={() => store.update((s) => toggleItemCollected(s, item.id))}
                            aria-label={`Collected ${item.name}`}
                          />
                        ) : (
                          <span className="text-muted-foreground text-xs" title="Not a collectible">–</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-0 w-full sm:max-w-none sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setSelected(item)}
                          className="hover:text-primary focus-visible:ring-ring/50 flex max-w-full flex-col items-start rounded text-left outline-none focus-visible:ring-[3px]"
                        >
                          <span className="flex max-w-full items-center gap-2">
                            <span className="truncate font-medium">{item.name}</span>
                            <VerificationBadge meta={item.meta} />
                          </span>
                          <span className="text-muted-foreground text-xs sm:hidden">
                            {humanize(item.category)} · {humanize(item.rarity)}
                          </span>
                        </button>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell">{humanize(item.category)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <RarityTag rarity={item.rarity} />
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden max-w-64 truncate md:table-cell">
                        {item.foundAt.map(locationName).join(", ") || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-pressed={p?.tracked ?? false}
                          aria-label={p?.tracked ? `Stop tracking ${item.name}` : `Track ${item.name}`}
                          onClick={() => store.update((s) => toggleItemTracked(s, item.id))}
                        >
                          <Star className={cn(p?.tracked ? "fill-primary text-primary" : "text-muted-foreground")} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <ItemDetailDialog item={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </PageContainer>
  );
}
