"use client";

import { useEffect } from "react";

import { PageContainer } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/states";
import { Button } from "@/components/ui/button";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer>
      <ErrorState
        description="This page failed to load. Your saved progress is not affected."
        action={<Button onClick={() => retry()}>Try again</Button>}
      />
    </PageContainer>
  );
}
