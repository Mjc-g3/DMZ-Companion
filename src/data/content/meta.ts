import type { ContentMeta } from "@/types/content";

/** Current content version. Bump when any record in src/data/content changes. */
export const CONTENT_VERSION = "0.1.0";

/**
 * Meta for development placeholders. Every record using this is fictional and
 * must be replaced with sourced data before it is shown as real.
 */
export const MOCK_META: ContentMeta = {
  verification: "mock",
  sources: [{ label: "Development placeholder, not game data" }],
  updatedIn: CONTENT_VERSION,
};
