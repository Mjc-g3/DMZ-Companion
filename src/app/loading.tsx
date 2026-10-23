import { PageContainer } from "@/components/common/page-header";
import { ListSkeleton } from "@/components/common/states";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContainer>
      <Skeleton className="h-8 w-48" />
      <ListSkeleton />
    </PageContainer>
  );
}
