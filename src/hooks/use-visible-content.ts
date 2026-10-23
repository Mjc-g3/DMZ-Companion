"use client";

import { useMemo } from "react";

import { useProgressState } from "@/providers/progress-provider";
import type { Versioned } from "@/types/content";

/** Filters out mock records when the user has turned mock data off. */
export function useVisibleContent<T extends Versioned>(list: T[]): T[] {
  const state = useProgressState();
  const showMock = state.progress?.settings.showMockData ?? true;
  return useMemo(
    () => (showMock ? list : list.filter((entry) => entry.meta.verification !== "mock")),
    [list, showMock],
  );
}
