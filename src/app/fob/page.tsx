import type { Metadata } from "next";
import { Warehouse } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/states";

export const metadata: Metadata = { title: "FOB Upgrades" };

export default function FobPage() {
  return (
    <PageContainer>
      <PageHeader title="FOB Upgrades" description="Plan upgrades and the materials they need." />
      <EmptyState
        icon={Warehouse}
        title="Coming in Phase 3"
        description="The data model for upgrades and their item requirements is in place. The planner will be built once verified upgrade data is available."
      />
    </PageContainer>
  );
}
