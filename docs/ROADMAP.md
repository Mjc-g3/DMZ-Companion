# Roadmap

Each phase ends with a green build, lint, typecheck and tests, plus a manual check on
desktop and a phone-sized viewport.

## Phase 1: Foundation (done)

- Next.js App Router shell, dark tactical theme, responsive sidebar and mobile drawer
- Typed data model for maps, locations, items, missions, recipes and FOB upgrades, with
  verification status, sources and content versioning
- Clearly labelled mock data; placeholder map image
- Local progress persistence behind a repository interface, cross-tab sync,
  export / import / reset
- Dashboard with progress stats, active missions and tracked items
- Mission tracker: objectives, status, prerequisites/locking, search and filters
- Item tracker: collected and tracked state, search and filters, item detail with
  where-to-find, mission, crafting and FOB relationships
- Leaflet `CRS.Simple` map: image overlay, markers by kind, layer toggles, location
  search, selection panel, deep links from items (`/map?location=…`)
- PWA manifest, icons and offline service worker
- Loading, empty and error states; keyboard-accessible controls; unit tests

## Phase 2: Real data and map

- Source the Hajin map image (licence-compatible) and real locations
- Content contribution guide and validation script (schema + references)
- Map: marker clustering, custom marker icons, URL state for filters and zoom
- Persist list filters in the URL

## Phase 3: Crafting and FOB

- FOB upgrade planner: requirements, prerequisites, built state
- Crafting requirements and "total materials needed" across tracked goals

## Phase 4: Wiki and guides

- Item and location pages with where-to-find guides
- Guide articles (MDX or database-backed)

## Phase 5: Accounts and sync

- Supabase implementations of `GameDataRepository` and `ProgressRepository`
- Sign-in, cloud progress sync with merge from local data
- Content admin workflow for verifying records
