import type { EntityId, ItemQuantity, Versioned } from "./content";

export type { EntityId, ItemQuantity } from "./content";

// ---------------------------------------------------------------------------
// Maps and locations
// ---------------------------------------------------------------------------

export interface MapImage {
  url: string;
  /** Native pixel size. Leaflet CRS.Simple coordinates use these units. */
  width: number;
  height: number;
  isPlaceholder: boolean;
  attribution?: string;
}

export interface GameMap extends Versioned {
  id: EntityId;
  name: string;
  description?: string;
  image: MapImage;
}

export const LOCATION_KINDS = [
  "landmark",
  "extraction",
  "loot",
  "mission",
  "vendor",
  "hazard",
] as const;
export type LocationKind = (typeof LOCATION_KINDS)[number];

export interface GameLocation extends Versioned {
  id: EntityId;
  mapId: EntityId;
  name: string;
  kind: LocationKind;
  /** Position in map image pixels: x from the left, y from the top. */
  position: { x: number; y: number };
  description?: string;
}

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

export const ITEM_CATEGORIES = [
  "weapon",
  "equipment",
  "key",
  "material",
  "valuable",
  "intel",
  "consumable",
] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export const ITEM_RARITIES = ["common", "uncommon", "rare", "epic", "legendary"] as const;
export type ItemRarity = (typeof ITEM_RARITIES)[number];

export interface Item extends Versioned {
  id: EntityId;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  description?: string;
  /** Where the item can be found. Feeds the "where to find" guides. */
  foundAt: EntityId[];
  /** Whether the item counts toward collection progress. */
  collectible: boolean;
}

// ---------------------------------------------------------------------------
// Missions
// ---------------------------------------------------------------------------

export interface MissionObjective {
  id: EntityId;
  description: string;
  locationId?: EntityId;
  /** Items to find, hand in or use for this objective. */
  items?: ItemQuantity[];
}

export interface MissionReward {
  label: string;
  itemId?: EntityId;
  quantity?: number;
}

export interface Mission extends Versioned {
  id: EntityId;
  name: string;
  faction: string;
  tier: number;
  description?: string;
  mapId?: EntityId;
  objectives: MissionObjective[];
  rewards: MissionReward[];
  /** Missions that must be completed first. */
  prerequisites: EntityId[];
}

// ---------------------------------------------------------------------------
// Crafting and FOB (data model only in Phase 1)
// ---------------------------------------------------------------------------

export interface Recipe extends Versioned {
  id: EntityId;
  outputItemId: EntityId;
  outputQuantity: number;
  inputs: ItemQuantity[];
}

export interface FobUpgrade extends Versioned {
  id: EntityId;
  name: string;
  tier: number;
  description?: string;
  requirements: ItemQuantity[];
  prerequisites: EntityId[];
}

// ---------------------------------------------------------------------------
// Bundle
// ---------------------------------------------------------------------------

/** All shared game data for one content version. */
export interface GameDataBundle {
  /** Content version, semver. Bump when any record changes. */
  version: string;
  /** Game build or season the content targets. */
  gameVersion: string;
  updatedAt: string;
  maps: GameMap[];
  locations: GameLocation[];
  items: Item[];
  missions: Mission[];
  recipes: Recipe[];
  fobUpgrades: FobUpgrade[];
}
