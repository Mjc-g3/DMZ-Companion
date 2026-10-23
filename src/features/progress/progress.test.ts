import { describe, expect, it } from "vitest";

import { gameData } from "@/data/content";
import { filterItems, DEFAULT_ITEM_FILTERS } from "@/features/items/filter";
import { filterMissions, DEFAULT_MISSION_FILTERS } from "@/features/missions/filter";
import { createLocalStorageRepository } from "@/services/progress/local-storage-repository";
import type { Mission } from "@/types/game";
import {
  createEmptyProgress,
  getMissionProgress,
  isMissionAvailable,
  setMissionStatus,
  toggleItemCollected,
  toggleItemTracked,
  toggleObjective,
} from "./logic";
import { parseProgress } from "./schema";
import { computeStats } from "./stats";
import { createProgressStore } from "./store";

const mission: Mission = gameData.missions[0];
const follower = gameData.missions.find((m) => m.prerequisites.includes(mission.id))!;
const empty = () => createEmptyProgress("test");

describe("mission progress", () => {
  it("derives status from objectives", () => {
    let p = toggleObjective(empty(), mission, mission.objectives[0].id);
    expect(getMissionProgress(p, mission.id).status).toBe("in_progress");
    for (const o of mission.objectives.slice(1)) p = toggleObjective(p, mission, o.id);
    expect(getMissionProgress(p, mission.id).status).toBe("completed");
    p = toggleObjective(p, mission, mission.objectives[0].id);
    expect(getMissionProgress(p, mission.id).status).toBe("in_progress");
  });

  it("fills and clears objectives when status is set directly", () => {
    let p = setMissionStatus(empty(), mission, "completed");
    expect(getMissionProgress(p, mission.id).completedObjectives).toHaveLength(mission.objectives.length);
    p = setMissionStatus(p, mission, "not_started");
    expect(getMissionProgress(p, mission.id).completedObjectives).toEqual([]);
  });

  it("unlocks missions once prerequisites are complete", () => {
    expect(isMissionAvailable(empty(), follower)).toBe(false);
    expect(isMissionAvailable(setMissionStatus(empty(), mission, "completed"), follower)).toBe(true);
  });

  it("does not mutate the previous state", () => {
    const before = empty();
    toggleObjective(before, mission, mission.objectives[0].id);
    expect(before.missions).toEqual({});
  });
});

describe("items and stats", () => {
  it("toggles collected and tracked independently", () => {
    const id = gameData.items[0].id;
    const p = toggleItemTracked(toggleItemCollected(empty(), id), id);
    expect(p.items[id]).toMatchObject({ collected: true, tracked: true });
    expect(toggleItemCollected(p, id).items[id]).toMatchObject({ collected: false, tracked: true });
  });

  it("computes dashboard stats", () => {
    const item = gameData.items.find((i) => i.collectible)!;
    const p = toggleItemCollected(setMissionStatus(empty(), mission, "completed"), item.id);
    const stats = computeStats(p, gameData.missions, gameData.items);
    expect(stats.missions.completed).toBe(1);
    expect(stats.collection.collected).toBe(1);
    expect(stats.objectives.completed).toBe(mission.objectives.length);
  });
});

describe("filters", () => {
  it("filters missions by search, status and lock state", () => {
    const p = empty();
    expect(filterMissions(gameData.missions, p, { ...DEFAULT_MISSION_FILTERS, query: "wire run" })).toHaveLength(1);
    const locked = filterMissions(gameData.missions, p, { ...DEFAULT_MISSION_FILTERS, status: "locked" });
    expect(locked.every((m) => m.prerequisites.length > 0)).toBe(true);
    expect(locked).toContain(follower);
  });

  it("filters items by category, status and location name", () => {
    const p = empty();
    const materials = filterItems(gameData.items, p, { ...DEFAULT_ITEM_FILTERS, category: "material" });
    expect(materials.length).toBeGreaterThan(0);
    expect(materials.every((i) => i.category === "material")).toBe(true);
    expect(filterItems(gameData.items, p, { ...DEFAULT_ITEM_FILTERS, status: "tracked" })).toEqual([]);
    const byLocation = filterItems(gameData.items, p, { ...DEFAULT_ITEM_FILTERS, query: "vendor hotel" }, (id) =>
      gameData.locations.find((l) => l.id === id)?.name ?? id,
    );
    expect(byLocation.map((i) => i.id)).toContain("item-medkit");
  });
});

describe("persistence", () => {
  it("falls back to empty progress for invalid input", () => {
    expect(parseProgress(null, "v").missions).toEqual({});
    expect(parseProgress({ schemaVersion: 99 }, "v").missions).toEqual({});
    expect(parseProgress({ schemaVersion: 1, settings: { showMockData: false } }, "v").settings.showMockData).toBe(false);
  });

  it("round-trips through the localStorage repository via the store", async () => {
    const data = new Map<string, string>();
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    } as Storage;
    data.set("dmz-companion:progress", "{not json");

    const store = createProgressStore(createLocalStorageRepository(storage), "v");
    await store.hydrate();
    expect(store.getSnapshot().status).toBe("ready");

    store.update((p) => toggleItemTracked(p, "item-medkit"));
    await Promise.resolve();
    const reloaded = createProgressStore(createLocalStorageRepository(storage), "v");
    await reloaded.hydrate();
    expect(reloaded.getSnapshot().progress?.items["item-medkit"]?.tracked).toBe(true);

    await reloaded.reset();
    expect(data.size).toBe(0);
  });
});
