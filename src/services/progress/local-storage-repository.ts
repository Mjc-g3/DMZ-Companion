import type { ProgressRepository } from "./repository";

export const PROGRESS_STORAGE_KEY = "dmz-companion:progress";

export function createLocalStorageRepository(storage: Storage): ProgressRepository {
  return {
    async load() {
      const raw = storage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as unknown;
      } catch {
        return null;
      }
    },
    async save(progress) {
      storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    },
    async clear() {
      storage.removeItem(PROGRESS_STORAGE_KEY);
    },
  };
}
