import type { GameMap } from "@/types/game";
import { CONTENT_VERSION } from "./meta";

export const maps: GameMap[] = [
  {
    id: "hajin",
    name: "Hajin",
    description:
      "Map image is a placeholder grid until a properly sourced Hajin map asset is provided.",
    image: {
      url: "/maps/placeholder-grid.svg",
      width: 2048,
      height: 2048,
      isPlaceholder: true,
    },
    meta: {
      verification: "unverified",
      sources: [{ label: "Project brief (map name only)" }],
      updatedIn: CONTENT_VERSION,
    },
  },
];
