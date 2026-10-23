import type { Item } from "@/types/game";
import { MOCK_META } from "./meta";

/** MOCK: fictional items for building the tracker, not real MW4 DMZ items. */
export const items: Item[] = [
  { id: "item-circuit-board", name: "Sample Circuit Board", category: "material", rarity: "common", foundAt: ["loc-charlie", "loc-delta"], collectible: true, meta: MOCK_META },
  { id: "item-copper-wire", name: "Sample Copper Wire", category: "material", rarity: "common", foundAt: ["loc-charlie"], collectible: true, meta: MOCK_META },
  { id: "item-fuel-canister", name: "Sample Fuel Canister", category: "material", rarity: "uncommon", foundAt: ["loc-delta", "loc-bravo"], collectible: true, meta: MOCK_META },
  { id: "item-optics-kit", name: "Sample Optics Kit", category: "material", rarity: "rare", foundAt: ["loc-bravo"], collectible: true, meta: MOCK_META },
  { id: "item-gold-watch", name: "Sample Gold Watch", category: "valuable", rarity: "rare", foundAt: ["loc-alpha", "loc-delta"], collectible: true, meta: MOCK_META },
  { id: "item-data-drive", name: "Sample Data Drive", category: "intel", rarity: "uncommon", foundAt: ["loc-golf"], collectible: true, meta: MOCK_META },
  { id: "item-encrypted-ledger", name: "Sample Encrypted Ledger", category: "intel", rarity: "epic", foundAt: ["loc-golf", "loc-bravo"], collectible: true, meta: MOCK_META },
  { id: "item-storage-key", name: "Sample Storage Key", category: "key", rarity: "uncommon", foundAt: ["loc-alpha"], collectible: true, meta: MOCK_META },
  { id: "item-vault-key", name: "Sample Vault Key", category: "key", rarity: "legendary", foundAt: ["loc-india"], collectible: true, meta: MOCK_META },
  { id: "item-armor-plate", name: "Sample Armor Plate", category: "equipment", rarity: "common", foundAt: ["loc-hotel", "loc-charlie"], collectible: false, meta: MOCK_META },
  { id: "item-gas-mask", name: "Sample Gas Mask", category: "equipment", rarity: "uncommon", foundAt: ["loc-hotel"], collectible: false, meta: MOCK_META },
  { id: "item-medkit", name: "Sample Medkit", category: "consumable", rarity: "common", foundAt: ["loc-hotel", "loc-charlie", "loc-delta"], collectible: false, meta: MOCK_META },
  { id: "item-assault-rifle", name: "Sample Assault Rifle", category: "weapon", rarity: "rare", foundAt: ["loc-india"], collectible: true, meta: MOCK_META },
  { id: "item-marksman-rifle", name: "Sample Marksman Rifle", category: "weapon", rarity: "epic", foundAt: ["loc-india", "loc-bravo"], collectible: true, meta: MOCK_META },
];
