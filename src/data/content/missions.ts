import type { Mission } from "@/types/game";
import { MOCK_META } from "./meta";

/** MOCK: fictional missions for building the tracker, not real MW4 DMZ missions. */
export const missions: Mission[] = [
  {
    id: "mission-sample-01",
    name: "Sample Mission 01: Supply Check",
    faction: "Sample Faction A",
    tier: 1,
    mapId: "hajin",
    description: "Placeholder mission used to test objective tracking.",
    objectives: [
      { id: "obj-1", description: "Visit Sample Landmark Alpha", locationId: "loc-alpha" },
      { id: "obj-2", description: "Collect 3 Sample Circuit Boards", items: [{ itemId: "item-circuit-board", quantity: 3 }] },
    ],
    rewards: [{ label: "Placeholder reward" }],
    prerequisites: [],
    meta: MOCK_META,
  },
  {
    id: "mission-sample-02",
    name: "Sample Mission 02: Wire Run",
    faction: "Sample Faction A",
    tier: 1,
    mapId: "hajin",
    objectives: [
      { id: "obj-1", description: "Collect 2 Sample Copper Wire", items: [{ itemId: "item-copper-wire", quantity: 2 }] },
      { id: "obj-2", description: "Extract at Sample Exfil Echo", locationId: "loc-echo" },
    ],
    rewards: [{ label: "Placeholder reward" }],
    prerequisites: ["mission-sample-01"],
    meta: MOCK_META,
  },
  {
    id: "mission-sample-03",
    name: "Sample Mission 03: Lockbox",
    faction: "Sample Faction A",
    tier: 2,
    mapId: "hajin",
    objectives: [
      { id: "obj-1", description: "Find the Sample Storage Key", items: [{ itemId: "item-storage-key", quantity: 1 }] },
      { id: "obj-2", description: "Search Sample Loot Cache Charlie", locationId: "loc-charlie" },
      { id: "obj-3", description: "Hand in a Sample Gold Watch", items: [{ itemId: "item-gold-watch", quantity: 1 }] },
    ],
    rewards: [{ label: "Placeholder reward" }],
    prerequisites: ["mission-sample-02"],
    meta: MOCK_META,
  },
  {
    id: "mission-sample-04",
    name: "Sample Mission 04: Signal Intel",
    faction: "Sample Faction B",
    tier: 1,
    mapId: "hajin",
    objectives: [
      { id: "obj-1", description: "Recover a Sample Data Drive at Sample Objective Golf", locationId: "loc-golf", items: [{ itemId: "item-data-drive", quantity: 1 }] },
    ],
    rewards: [{ label: "Placeholder reward" }],
    prerequisites: [],
    meta: MOCK_META,
  },
  {
    id: "mission-sample-05",
    name: "Sample Mission 05: Hazard Survey",
    faction: "Sample Faction B",
    tier: 2,
    mapId: "hajin",
    objectives: [
      { id: "obj-1", description: "Equip a Sample Gas Mask", items: [{ itemId: "item-gas-mask", quantity: 1 }] },
      { id: "obj-2", description: "Survey Sample Hazard Zone India", locationId: "loc-india" },
      { id: "obj-3", description: "Extract at Sample Exfil Foxtrot", locationId: "loc-foxtrot" },
    ],
    rewards: [{ label: "Placeholder reward" }],
    prerequisites: ["mission-sample-04"],
    meta: MOCK_META,
  },
  {
    id: "mission-sample-06",
    name: "Sample Mission 06: Ledger",
    faction: "Sample Faction B",
    tier: 3,
    mapId: "hajin",
    objectives: [
      { id: "obj-1", description: "Find a Sample Encrypted Ledger", items: [{ itemId: "item-encrypted-ledger", quantity: 1 }] },
      { id: "obj-2", description: "Deliver it to Sample Vendor Hotel", locationId: "loc-hotel" },
    ],
    rewards: [{ label: "Placeholder reward" }],
    prerequisites: ["mission-sample-05"],
    meta: MOCK_META,
  },
];
