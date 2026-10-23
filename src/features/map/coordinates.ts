import type { MapImage } from "@/types/game";

/**
 * Converts image pixel coordinates (origin top-left) to Leaflet CRS.Simple
 * [lat, lng] (origin bottom-left), so data can be authored in image pixels.
 */
export function pixelToLatLng(image: Pick<MapImage, "height">, position: { x: number; y: number }): [number, number] {
  return [image.height - position.y, position.x];
}

export function imageBounds(image: Pick<MapImage, "width" | "height">): [[number, number], [number, number]] {
  return [
    [0, 0],
    [image.height, image.width],
  ];
}
