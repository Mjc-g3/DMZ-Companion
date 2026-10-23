import type { ProgressRepository } from "@/services/progress/repository";
import type { UserProgress } from "@/types/progress";
import { createEmptyProgress } from "./logic";
import { parseProgress } from "./schema";

export type ProgressState =
  | { status: "loading"; progress: null; error: null }
  | { status: "ready"; progress: UserProgress; error: null }
  | { status: "error"; progress: UserProgress; error: string };

/**
 * Small subscribable store for useSyncExternalStore. Holds progress in memory
 * and writes through to the repository on every change.
 */
export function createProgressStore(repository: ProgressRepository, contentVersion: string) {
  let state: ProgressState = { status: "loading", progress: null, error: null };
  const listeners = new Set<() => void>();

  const emit = (next: ProgressState) => {
    state = next;
    for (const listener of listeners) listener();
  };

  const persist = async (progress: UserProgress) => {
    try {
      await repository.save(progress);
      if (state.status === "error") emit({ status: "ready", progress, error: null });
    } catch (error) {
      emit({ status: "error", progress, error: describe(error, "Could not save progress") });
    }
  };

  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async hydrate() {
      try {
        const raw = await repository.load();
        emit({ status: "ready", progress: parseProgress(raw, contentVersion), error: null });
      } catch (error) {
        emit({
          status: "error",
          progress: createEmptyProgress(contentVersion),
          error: describe(error, "Could not load saved progress"),
        });
      }
    },
    update(updater: (progress: UserProgress) => UserProgress) {
      if (state.status === "loading") return;
      const progress = updater(state.progress);
      emit({ status: state.status, progress, error: state.error } as ProgressState);
      void persist(progress);
    },
    async replace(raw: unknown) {
      const progress = parseProgress(raw, contentVersion);
      emit({ status: "ready", progress, error: null });
      await persist(progress);
    },
    async reset() {
      await repository.clear();
      emit({ status: "ready", progress: createEmptyProgress(contentVersion), error: null });
    },
  };
}

export type ProgressStore = ReturnType<typeof createProgressStore>;

function describe(error: unknown, fallback: string) {
  return error instanceof Error ? `${fallback}: ${error.message}` : fallback;
}
