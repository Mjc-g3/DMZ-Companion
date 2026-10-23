"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { GameLocation, GameMap } from "@/types/game";
import { imageBounds, pixelToLatLng } from "./coordinates";
import { LOCATION_KIND_STYLE } from "./location-kinds";

export interface LeafletMapProps {
  map: GameMap;
  locations: GameLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function markerIcon(location: GameLocation) {
  return L.divIcon({
    className: "dmz-marker",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `<span style="--marker:${LOCATION_KIND_STYLE[location.kind].color}"></span>`,
  });
}

/** Leaflet map using CRS.Simple over a single image. Client-only. */
export default function LeafletMap({ map, locations, selectedId, onSelect }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Create the map once per map image.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const bounds = L.latLngBounds(imageBounds(map.image));
    const instance = L.map(container, {
      crs: L.CRS.Simple,
      minZoom: -3,
      maxZoom: 2,
      zoomSnap: 0.25,
      attributionControl: Boolean(map.image.attribution),
      maxBounds: bounds.pad(0.25),
    });
    L.imageOverlay(map.image.url, bounds, { alt: `${map.name} map` }).addTo(instance);
    if (map.image.attribution) instance.attributionControl.addAttribution(map.image.attribution);
    instance.fitBounds(bounds);

    mapRef.current = instance;
    layerRef.current = L.layerGroup().addTo(instance);

    const observer = new ResizeObserver(() => instance.invalidateSize());
    observer.observe(container);

    const markers = markersRef.current;
    return () => {
      observer.disconnect();
      instance.remove();
      mapRef.current = null;
      layerRef.current = null;
      markers.clear();
    };
  }, [map]);

  // Sync markers with the filtered locations.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    markersRef.current.clear();

    for (const location of locations) {
      const tooltip = document.createElement("span");
      tooltip.textContent = location.name;
      const marker = L.marker(pixelToLatLng(map.image, location.position), {
        icon: markerIcon(location),
        title: location.name,
        alt: location.name,
        keyboard: true,
        riseOnHover: true,
      })
        .bindTooltip(tooltip, { direction: "top", offset: [0, -8] })
        .on("click", () => onSelectRef.current(location.id))
        .on("keypress", (event: L.LeafletKeyboardEvent) => {
          if (event.originalEvent.key === "Enter" || event.originalEvent.key === " ") onSelectRef.current(location.id);
        });
      marker.addTo(layer);
      markersRef.current.set(location.id, marker);
    }
  }, [locations, map]);

  // Highlight and centre the selected location.
  useEffect(() => {
    const instance = mapRef.current;
    for (const location of locations) {
      // Toggle a class rather than swapping the icon, so keyboard focus stays on the marker.
      const selected = location.id === selectedId;
      const marker = markersRef.current.get(location.id);
      marker?.setZIndexOffset(selected ? 1000 : 0);
      marker?.getElement()?.classList.toggle("is-selected", selected);
    }
    const marker = selectedId ? markersRef.current.get(selectedId) : undefined;
    if (instance && marker) instance.panTo(marker.getLatLng(), { animate: true });
  }, [selectedId, locations]);

  return (
    <div
      ref={containerRef}
      // Important: Leaflet's own stylesheet loads later and sets a grey background.
      className="bg-background! h-full w-full font-[inherit]!"
      role="application"
      aria-label={`${map.name} interactive map. Use arrow keys to pan, plus and minus to zoom, Tab to reach markers.`}
    />
  );
}
