"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

import { RarityTag } from "@/components/common/rarity";
import { VerificationBadge } from "@/components/common/verification-badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { humanize } from "@/lib/format";
import { useGameData } from "@/providers/game-data-provider";
import type { Item } from "@/types/game";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{title}</h3>
      {children}
    </section>
  );
}

export function ItemDetailDialog({ item, onOpenChange }: { item: Item | null; onOpenChange: (open: boolean) => void }) {
  const index = useGameData();
  if (!item) return null;

  const missions = index.missionsByItem.get(item.id) ?? [];
  const recipes = index.recipesByInput.get(item.id) ?? [];
  const upgrades = index.upgradesByItem.get(item.id) ?? [];
  const craftedBy = index.bundle.recipes.filter((r) => r.outputItemId === item.id);

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pr-6">{item.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-wrap items-center gap-2">
              <span>{humanize(item.category)}</span>
              <RarityTag rarity={item.rarity} />
              <VerificationBadge meta={item.meta} hideVerified={false} />
            </div>
          </DialogDescription>
        </DialogHeader>

        {item.description && <p className="text-sm">{item.description}</p>}

        <Section title="Where to find">
          {item.foundAt.length === 0 ? (
            <p className="text-muted-foreground text-sm">No known locations yet.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {item.foundAt.map((id) => {
                const location = index.locationsById.get(id);
                return (
                  <li key={id}>
                    <Link
                      href={`/map?location=${encodeURIComponent(id)}`}
                      className="hover:text-primary focus-visible:ring-ring/50 inline-flex items-center gap-1.5 rounded text-sm outline-none focus-visible:ring-[3px]"
                    >
                      <MapPin className="text-primary size-3.5" aria-hidden />
                      {location?.name ?? id}
                      {location && (
                        <span className="text-muted-foreground text-xs">
                          · {index.mapsById.get(location.mapId)?.name}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        {missions.length > 0 && (
          <Section title="Needed for missions">
            <ul className="list-inside list-disc text-sm">
              {missions.map((m) => (
                <li key={m.id}>{m.name}</li>
              ))}
            </ul>
          </Section>
        )}

        {(recipes.length > 0 || craftedBy.length > 0) && (
          <Section title="Crafting">
            <ul className="list-inside list-disc text-sm">
              {craftedBy.map((r) => (
                <li key={r.id}>
                  Crafted from{" "}
                  {r.inputs.map((i) => `${i.quantity}× ${index.itemsById.get(i.itemId)?.name ?? i.itemId}`).join(", ")}
                </li>
              ))}
              {recipes.map((r) => (
                <li key={r.id}>Used to craft {index.itemsById.get(r.outputItemId)?.name ?? r.outputItemId}</li>
              ))}
            </ul>
          </Section>
        )}

        {upgrades.length > 0 && (
          <Section title="FOB upgrades">
            <ul className="list-inside list-disc text-sm">
              {upgrades.map((u) => (
                <li key={u.id}>
                  {u.name} ({u.requirements.find((r) => r.itemId === item.id)?.quantity}×)
                </li>
              ))}
            </ul>
          </Section>
        )}

        <p className="text-muted-foreground border-t pt-3 text-xs">
          Source: {item.meta.sources.map((s) => s.label).join(", ") || "none"} · content v{item.meta.updatedIn}
        </p>
      </DialogContent>
    </Dialog>
  );
}
