import type { LocationKind } from "@/types/game";

/** Marker colours per location kind. Hex so they work inside Leaflet's own DOM. */
export const LOCATION_KIND_STYLE: Record<LocationKind, { label: string; color: string }> = {
  landmark: { label: "Landmarks", color: "#e5e5e5" },
  extraction: { label: "Extractions", color: "#4ade80" },
  loot: { label: "Loot", color: "#ffcf00" },
  mission: { label: "Mission objectives", color: "#60a5fa" },
  vendor: { label: "Vendors", color: "#c084fc" },
  hazard: { label: "Hazards", color: "#f87171" },
};
