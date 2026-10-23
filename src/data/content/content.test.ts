import { describe, expect, it } from "vitest";

import { findBrokenReferences } from "@/lib/game-index";
import { gameData } from "./index";

describe("bundled game content", () => {
  it("has no references to missing records", () => {
    expect(findBrokenReferences(gameData)).toEqual([]);
  });

  it("has unique ids per collection", () => {
    const collections = {
      maps: gameData.maps,
      locations: gameData.locations,
      items: gameData.items,
      missions: gameData.missions,
      recipes: gameData.recipes,
      fobUpgrades: gameData.fobUpgrades,
    };
    for (const [name, list] of Object.entries(collections)) {
      const ids = list.map((entry) => entry.id);
      expect(new Set(ids).size, name).toBe(ids.length);
    }
  });

  it("labels every record with a source", () => {
    const all = [
      ...gameData.maps,
      ...gameData.locations,
      ...gameData.items,
      ...gameData.missions,
      ...gameData.recipes,
      ...gameData.fobUpgrades,
    ];
    for (const entry of all) expect(entry.meta.sources.length, entry.id).toBeGreaterThan(0);
  });

  it("keeps locations inside their map image", () => {
    for (const location of gameData.locations) {
      const map = gameData.maps.find((m) => m.id === location.mapId)!;
      expect(location.position.x).toBeGreaterThanOrEqual(0);
      expect(location.position.y).toBeGreaterThanOrEqual(0);
      expect(location.position.x).toBeLessThanOrEqual(map.image.width);
      expect(location.position.y).toBeLessThanOrEqual(map.image.height);
    }
  });
});
