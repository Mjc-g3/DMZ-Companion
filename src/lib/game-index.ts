import type {
  EntityId,
  FobUpgrade,
  GameDataBundle,
  GameLocation,
  GameMap,
  Item,
  Mission,
  Recipe,
} from "@/types/game";

/** Lookup tables and reverse relationships derived from a GameDataBundle. */
export interface GameIndex {
  bundle: GameDataBundle;
  mapsById: Map<EntityId, GameMap>;
  locationsById: Map<EntityId, GameLocation>;
  itemsById: Map<EntityId, Item>;
  missionsById: Map<EntityId, Mission>;
  /** Missions whose objectives reference an item. */
  missionsByItem: Map<EntityId, Mission[]>;
  /** Missions whose objectives reference a location. */
  missionsByLocation: Map<EntityId, Mission[]>;
  /** Items found at a location. */
  itemsByLocation: Map<EntityId, Item[]>;
  /** Recipes that use an item as an input. */
  recipesByInput: Map<EntityId, Recipe[]>;
  /** FOB upgrades that require an item. */
  upgradesByItem: Map<EntityId, FobUpgrade[]>;
}

function byId<T extends { id: EntityId }>(list: T[]): Map<EntityId, T> {
  return new Map(list.map((entry) => [entry.id, entry]));
}

function push<T>(map: Map<EntityId, T[]>, key: EntityId, value: T) {
  const list = map.get(key);
  if (!list) map.set(key, [value]);
  else if (!list.includes(value)) list.push(value);
}

export function buildGameIndex(bundle: GameDataBundle): GameIndex {
  const missionsByItem = new Map<EntityId, Mission[]>();
  const missionsByLocation = new Map<EntityId, Mission[]>();
  for (const mission of bundle.missions) {
    for (const objective of mission.objectives) {
      if (objective.locationId) push(missionsByLocation, objective.locationId, mission);
      for (const { itemId } of objective.items ?? []) push(missionsByItem, itemId, mission);
    }
  }

  const itemsByLocation = new Map<EntityId, Item[]>();
  for (const item of bundle.items) {
    for (const locationId of item.foundAt) push(itemsByLocation, locationId, item);
  }

  const recipesByInput = new Map<EntityId, Recipe[]>();
  for (const recipe of bundle.recipes) {
    for (const { itemId } of recipe.inputs) push(recipesByInput, itemId, recipe);
  }

  const upgradesByItem = new Map<EntityId, FobUpgrade[]>();
  for (const upgrade of bundle.fobUpgrades) {
    for (const { itemId } of upgrade.requirements) push(upgradesByItem, itemId, upgrade);
  }

  return {
    bundle,
    mapsById: byId(bundle.maps),
    locationsById: byId(bundle.locations),
    itemsById: byId(bundle.items),
    missionsById: byId(bundle.missions),
    missionsByItem,
    missionsByLocation,
    itemsByLocation,
    recipesByInput,
    upgradesByItem,
  };
}

/** Lists references to ids that do not exist. Used by tests to keep content consistent. */
export function findBrokenReferences(bundle: GameDataBundle): string[] {
  const index = buildGameIndex(bundle);
  const errors: string[] = [];
  const check = (ok: boolean, message: string) => {
    if (!ok) errors.push(message);
  };

  for (const location of bundle.locations) {
    check(index.mapsById.has(location.mapId), `location ${location.id}: unknown map ${location.mapId}`);
  }
  for (const item of bundle.items) {
    for (const id of item.foundAt) check(index.locationsById.has(id), `item ${item.id}: unknown location ${id}`);
  }
  for (const mission of bundle.missions) {
    if (mission.mapId) check(index.mapsById.has(mission.mapId), `mission ${mission.id}: unknown map ${mission.mapId}`);
    for (const id of mission.prerequisites) check(index.missionsById.has(id), `mission ${mission.id}: unknown prerequisite ${id}`);
    for (const objective of mission.objectives) {
      if (objective.locationId) {
        check(index.locationsById.has(objective.locationId), `mission ${mission.id}/${objective.id}: unknown location ${objective.locationId}`);
      }
      for (const { itemId } of objective.items ?? []) {
        check(index.itemsById.has(itemId), `mission ${mission.id}/${objective.id}: unknown item ${itemId}`);
      }
    }
    for (const reward of mission.rewards) {
      if (reward.itemId) check(index.itemsById.has(reward.itemId), `mission ${mission.id}: unknown reward item ${reward.itemId}`);
    }
  }
  for (const recipe of bundle.recipes) {
    check(index.itemsById.has(recipe.outputItemId), `recipe ${recipe.id}: unknown output ${recipe.outputItemId}`);
    for (const { itemId } of recipe.inputs) check(index.itemsById.has(itemId), `recipe ${recipe.id}: unknown input ${itemId}`);
  }
  const upgradeIds = new Set(bundle.fobUpgrades.map((u) => u.id));
  for (const upgrade of bundle.fobUpgrades) {
    for (const { itemId } of upgrade.requirements) check(index.itemsById.has(itemId), `upgrade ${upgrade.id}: unknown item ${itemId}`);
    for (const id of upgrade.prerequisites) check(upgradeIds.has(id), `upgrade ${upgrade.id}: unknown prerequisite ${id}`);
  }
  return errors;
}
