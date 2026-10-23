import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { MapView } from "@/features/map/map-view";

export const metadata: Metadata = { title: "Interactive Map" };

export default function MapPage() {
  return (
    <Suspense fallback={<Skeleton className="m-4 h-[60dvh] flex-1" />}>
      <MapView />
    </Suspense>
  );
}
