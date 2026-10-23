"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Layers, Map as MapIcon, MapPin, TriangleAlert } from "lucide-react";

import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/states";
import { VerificationBadge } from "@/components/common/verification-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useVisibleContent } from "@/hooks/use-visible-content";
import { humanize, matchesQuery } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useGameData } from "@/providers/game-data-provider";
import { LOCATION_KINDS, type LocationKind } from "@/types/game";
import { LOCATION_KIND_STYLE } from "./location-kinds";

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-none" aria-label="Loading map" />,
});

export function MapView() {
  const index = useGameData();
  const searchParams = useSearchParams();
  const locations = useVisibleContent(index.bundle.locations);

  const requested = searchParams.get("location");
  const requestedLocation = requested ? index.locationsById.get(requested) : undefined;

  const [mapId, setMapId] = useState(requestedLocation?.mapId ?? index.bundle.maps[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(requestedLocation?.id ?? null);
  const [kinds, setKinds] = useState<Set<LocationKind>>(() => new Set(LOCATION_KINDS));
  const [query, setQuery] = useState("");

  // The page can stay mounted between visits, so follow later ?location= links too.
  const [handledRequest, setHandledRequest] = useState(requested);
  if (requested !== handledRequest) {
    setHandledRequest(requested);
    if (requestedLocation) {
      setMapId(requestedLocation.mapId);
      setSelectedId(requestedLocation.id);
    }
  }

  const map = index.mapsById.get(mapId);
  const onMap = useMemo(() => locations.filter((l) => l.mapId === mapId), [locations, mapId]);
  const shown = useMemo(() => onMap.filter((l) => kinds.has(l.kind)), [onMap, kinds]);
  const listed = shown.filter((l) => matchesQuery(query, l.name, l.kind, l.description));
  const selected = selectedId ? index.locationsById.get(selectedId) : undefined;

  if (!map) {
    return (
      <div className="p-4 sm:p-6">
        <EmptyState icon={MapIcon} title="No maps available" description="Map data has not been added yet." />
      </div>
    );
  }

  const toggleKind = (kind: LocationKind) =>
    setKinds((current) => {
      const next = new Set(current);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="relative h-[55dvh] shrink-0 lg:h-auto lg:min-h-[calc(100dvh)] lg:flex-1">
        <LeafletMap map={map} locations={shown} selectedId={selectedId} onSelect={setSelectedId} />
        {map.image.isPlaceholder && (
          <div className="bg-background/90 border-warning/40 pointer-events-none absolute top-3 left-1/2 z-[500] flex -translate-x-1/2 items-center gap-2 rounded-md border px-3 py-1.5 text-xs shadow">
            <TriangleAlert className="text-warning size-3.5" aria-hidden />
            Placeholder map image. Marker positions are mock data.
          </div>
        )}
      </div>

      <aside
        aria-label="Map controls"
        className="bg-sidebar border-sidebar-border flex flex-col gap-4 border-t p-4 lg:h-dvh lg:w-80 lg:overflow-y-auto lg:border-t-0 lg:border-l"
      >
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">{map.name}</h1>
          {index.bundle.maps.length > 1 && (
            <Select
              value={mapId}
              onValueChange={(value) => {
                setMapId(value);
                setSelectedId(null);
              }}
            >
              <SelectTrigger size="sm" aria-label="Choose map">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {index.bundle.maps.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {selected && <SelectedLocation id={selected.id} onClose={() => setSelectedId(null)} />}

        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-muted-foreground mb-1.5 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
            <Layers className="size-3.5" aria-hidden /> Layers
          </legend>
          {LOCATION_KINDS.map((kind) => {
            const count = onMap.filter((l) => l.kind === kind).length;
            const id = `layer-${kind}`;
            return (
              <div key={kind} className="flex items-center gap-2 text-sm">
                <Checkbox id={id} checked={kinds.has(kind)} onCheckedChange={() => toggleKind(kind)} />
                <label htmlFor={id} className="flex flex-1 cursor-pointer items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: LOCATION_KIND_STYLE[kind].color }} aria-hidden />
                  {LOCATION_KIND_STYLE[kind].label}
                  <span className="text-muted-foreground ml-auto text-xs tabular-nums">{count}</span>
                </label>
              </div>
            );
          })}
        </fieldset>

        <div className="flex flex-col gap-2">
          <SearchInput label="Search locations" placeholder="Search locations…" value={query} onChange={setQuery} />
          {listed.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">No locations match.</p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {listed.map((location) => (
                <li key={location.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(location.id)}
                    aria-current={location.id === selectedId ? "true" : undefined}
                    className={cn(
                      "hover:bg-sidebar-accent focus-visible:ring-ring/50 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none focus-visible:ring-[3px]",
                      location.id === selectedId && "bg-sidebar-accent",
                    )}
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: LOCATION_KIND_STYLE[location.kind].color }}
                      aria-hidden
                    />
                    <span className="truncate">{location.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

function SelectedLocation({ id, onClose }: { id: string; onClose: () => void }) {
  const index = useGameData();
  const location = index.locationsById.get(id);
  if (!location) return null;
  const items = index.itemsByLocation.get(id) ?? [];
  const missions = index.missionsByLocation.get(id) ?? [];

  return (
    <section aria-label="Selected location" className="bg-card flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 font-medium">
            <MapPin className="text-primary size-4" aria-hidden />
            {location.name}
          </p>
          <p className="text-muted-foreground text-xs">{humanize(location.kind)}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded text-xs outline-none focus-visible:ring-[3px]"
        >
          Clear
        </button>
      </div>
      <VerificationBadge meta={location.meta} />
      {location.description && <p className="text-sm">{location.description}</p>}
      {items.length > 0 && (
        <div className="text-sm">
          <p className="text-muted-foreground text-xs font-medium uppercase">Items found here</p>
          <p>{items.map((i) => i.name).join(", ")}</p>
        </div>
      )}
      {missions.length > 0 && (
        <div className="text-sm">
          <p className="text-muted-foreground text-xs font-medium uppercase">Mission objectives</p>
          <p>{missions.map((m) => m.name).join(", ")}</p>
        </div>
      )}
    </section>
  );
}
