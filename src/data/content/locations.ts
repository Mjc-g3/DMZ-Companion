import type { GameLocation } from "@/types/game";
import { MOCK_META } from "./meta";

/** MOCK: fictional points on the placeholder grid, not real Hajin locations. */
export const locations: GameLocation[] = [
  { id: "loc-alpha", mapId: "hajin", name: "Sample Landmark Alpha", kind: "landmark", position: { x: 520, y: 480 }, meta: MOCK_META },
  { id: "loc-bravo", mapId: "hajin", name: "Sample Landmark Bravo", kind: "landmark", position: { x: 1460, y: 620 }, meta: MOCK_META },
  { id: "loc-charlie", mapId: "hajin", name: "Sample Loot Cache Charlie", kind: "loot", position: { x: 980, y: 1010 }, meta: MOCK_META },
  { id: "loc-delta", mapId: "hajin", name: "Sample Loot Cache Delta", kind: "loot", position: { x: 1720, y: 1500 }, meta: MOCK_META },
  { id: "loc-echo", mapId: "hajin", name: "Sample Exfil Echo", kind: "extraction", position: { x: 300, y: 1760 }, meta: MOCK_META },
  { id: "loc-foxtrot", mapId: "hajin", name: "Sample Exfil Foxtrot", kind: "extraction", position: { x: 1800, y: 260 }, meta: MOCK_META },
  { id: "loc-golf", mapId: "hajin", name: "Sample Objective Golf", kind: "mission", position: { x: 1240, y: 1380 }, meta: MOCK_META },
  { id: "loc-hotel", mapId: "hajin", name: "Sample Vendor Hotel", kind: "vendor", position: { x: 760, y: 1560 }, meta: MOCK_META },
  { id: "loc-india", mapId: "hajin", name: "Sample Hazard Zone India", kind: "hazard", position: { x: 1500, y: 980 }, meta: MOCK_META },
];
