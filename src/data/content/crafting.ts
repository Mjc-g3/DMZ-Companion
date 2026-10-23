import type { FobUpgrade, Recipe } from "@/types/game";
import { MOCK_META } from "./meta";

/** MOCK: fictional recipes to exercise item relationships. */
export const recipes: Recipe[] = [
  {
    id: "recipe-armor-plate",
    outputItemId: "item-armor-plate",
    outputQuantity: 1,
    inputs: [
      { itemId: "item-copper-wire", quantity: 2 },
      { itemId: "item-circuit-board", quantity: 1 },
    ],
    meta: MOCK_META,
  },
];

/** MOCK: fictional FOB upgrades. The FOB page arrives in a later phase. */
export const fobUpgrades: FobUpgrade[] = [
  {
    id: "fob-sample-workbench",
    name: "Sample Workbench",
    tier: 1,
    requirements: [
      { itemId: "item-circuit-board", quantity: 4 },
      { itemId: "item-fuel-canister", quantity: 2 },
    ],
    prerequisites: [],
    meta: MOCK_META,
  },
  {
    id: "fob-sample-armory",
    name: "Sample Armory",
    tier: 2,
    requirements: [
      { itemId: "item-optics-kit", quantity: 1 },
      { itemId: "item-copper-wire", quantity: 5 },
    ],
    prerequisites: ["fob-sample-workbench"],
    meta: MOCK_META,
  },
];
