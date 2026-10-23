"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";

import { createProgressStore, type ProgressState, type ProgressStore } from "@/features/progress/store";
import {
  createLocalStorageRepository,
  PROGRESS_STORAGE_KEY,
} from "@/services/progress/local-storage-repository";
import type { ProgressRepository } from "@/services/progress/repository";

const ProgressContext = createContext<ProgressStore | null>(null);

const SERVER_STATE: ProgressState = { status: "loading", progress: null, error: null };

/** Resolves localStorage on first use so the store can be created during SSR. */
const browserRepository: ProgressRepository = {
  load: () => createLocalStorageRepository(window.localStorage).load(),
  save: (progress) => createLocalStorageRepository(window.localStorage).save(progress),
  clear: () => createLocalStorageRepository(window.localStorage).clear(),
};

export function ProgressProvider({
  contentVersion,
  children,
}: {
  contentVersion: string;
  children: React.ReactNode;
}) {
  const [store] = useState(() => createProgressStore(browserRepository, contentVersion));

  useEffect(() => {
    void store.hydrate();
    // Keep several open tabs (e.g. phone and desktop browser windows) in sync.
    const onStorage = (event: StorageEvent) => {
      if (event.key === PROGRESS_STORAGE_KEY) void store.hydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [store]);

  return <ProgressContext.Provider value={store}>{children}</ProgressContext.Provider>;
}

export function useProgressStore(): ProgressStore {
  const store = useContext(ProgressContext);
  if (!store) throw new Error("useProgressStore must be used inside ProgressProvider");
  return store;
}

export function useProgressState(): ProgressState {
  const store = useProgressStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => SERVER_STATE);
}
