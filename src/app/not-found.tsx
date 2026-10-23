import Link from "next/link";

import { PageContainer } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageContainer>
      <EmptyState
        title="Page not found"
        description="That page does not exist."
        action={
          <Button asChild variant="outline">
            <Link href="/">Back to dashboard</Link>
          </Button>
        }
      />
    </PageContainer>
  );
}
