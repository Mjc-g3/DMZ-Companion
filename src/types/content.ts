/**
 * Shared metadata for every piece of game content.
 *
 * Game data is community-maintained and changes with patches, so every record
 * says how trustworthy it is and where it came from.
 */

/** How far a record has been checked against the game. */
export type VerificationStatus =
  /** Placeholder data for development. Never real game information. */
  | "mock"
  /** Taken from a source but not yet confirmed in game. */
  | "unverified"
  /** Confirmed in game or by a trusted primary source. */
  | "verified";

export interface ContentSource {
  /** Human-readable source name, e.g. "In-game observation". */
  label: string;
  url?: string;
  /** ISO date the source was last checked. */
  retrievedAt?: string;
}

export interface ContentMeta {
  verification: VerificationStatus;
  sources: ContentSource[];
  /** Content version (see GameDataBundle.version) that last changed this record. */
  updatedIn: string;
  notes?: string;
}

export interface Versioned {
  meta: ContentMeta;
}

/** An entity id. Ids are stable across content versions. */
export type EntityId = string;

export interface ItemQuantity {
  itemId: EntityId;
  quantity: number;
}
