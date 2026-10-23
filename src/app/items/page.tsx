import type { Metadata } from "next";

import { ItemsView } from "@/features/items/items-view";

export const metadata: Metadata = { title: "Items & Loot" };

export default function ItemsPage() {
  return <ItemsView />;
}
