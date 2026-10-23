import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/states";

export const metadata: Metadata = { title: "Wiki & Guides" };

export default function WikiPage() {
  return (
    <PageContainer>
      <PageHeader title="Wiki & Guides" description="Where to find items and how DMZ systems work." />
      <EmptyState
        icon={BookOpen}
        title="Coming in Phase 4"
        description="Until then, open any item on the Items & Loot page to see where it is found and what it is used for."
      />
    </PageContainer>
  );
}
