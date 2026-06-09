# Changelog

> Policy: keep a running `[Unreleased]` section, one bullet per change; cut a dated
> section when a version is tagged.

## [Unreleased]

### Changed
- **Phase 0 (hygiene):** fixed inverted `.gitignore` rule — now ignores the
  machine-local `.claude/settings.local.json` instead of the shared `settings.json`.
- **Phase 0 (deploy):** added a source sanity check to the deploy workflow that aborts
  before wiping production if any required page is missing or empty.
- Bumped `actions/checkout@v4` → `@v5` in the deploy workflow (and the embedded
  `static.yml`) to run on Node.js 24, clearing the Node 20 deprecation warning.
- **Phase 2 (architecture):** translations are now fetched once and cached in
  `language.js` (`getTranslationsData()`); `hero/contact/skills/projects` import it instead
  of each fetching `translations.json` — 8 fetches per page reduced to 1.
- **Phase 2 (robustness):** all data fetches use root-relative `/data/...` paths and no
  longer pass `cache:'no-cache'`, so normal HTTP caching applies.
- **Phase 2 (perf):** added a blocking anti-FOUC `<head>` script on all 7 pages that sets
  `data-theme`/`data-color` before CSS (also honours OS dark mode on first visit), removing
  the theme flash on navigation; optimised the profile photo (PNG 778 KB → JPEG 112 KB).
- **Phase 4 (a11y):** header toggle buttons are now 44×44 px touch targets; added a
  visible keyboard `:focus-visible` ring and a box-shadow focus ring on form inputs; added
  a skip-to-content link on every page; `aria-current="page"` on the active nav link; the
  yellow theme uses readable amber action tokens with dark text on primary buttons.
- **Phase 2 (robustness):** added visible error states for the projects and skills grids
  (instead of a silent empty grid), an 8s timeout on GitHub requests, and a 1-hour cache for
  the projects-page GitHub enrichment so each visit doesn't re-hit the API budget.
- **Phase 3 (cleanup):** `skills.js` now uses event delegation (one listener instead of
  clone-and-replace on every language change/resize), removed the 220-line stale
  `getInlineSkills()` fallback and dead `renderDots()`, and the skill modal closes on Escape;
  gated info `console.log`s behind a `DEBUG` flag in `projects.js`/`github-api.js`; added null
  guards in `color.js`.
- **Phase 4 (SEO/data):** per-page Open Graph/Twitter/canonical tags on all 7 pages, a
  `Person` JSON-LD block on the homepage, and fixed `tech-icons.json` (lowercased keys to
  match the generated tech slugs + added missing icons) so project-card icons resolve.
- **Phase 5 (CSS):** routed the two hardcoded dropdown `z-index: 1000` through the
  `--z-dropdown` token and added a `--z-tooltip` token.

### Fixed (cont.)
- The projects "Loading…" results count never resolved on initial render (it only updated on
  filter interaction); now resolves to the real count after the first render. Browser-verified.
- **Mobile menu** only covered its own height (page showed through). Root cause: `.header`'s
  `will-change: transform` made it the containing block for the fixed `.nav--mobile`, so
  `bottom:0` measured against the 64px header. Now uses an explicit `calc(100dvh - header)`
  height → proper full-screen overlay. Browser-verified.
- **Projects grid** could overflow horizontally at ≤375px (`minmax(350px,1fr)`); now
  `minmax(min(350px,100%),1fr)`.
- Nav `@media` rules collided at exactly 1024px (both min- and max-width fired) → mobile
  block is now `max-width: 1023.98px`.
- Touch targets: the hamburger (40→44px) and header buttons at ≤480px (36→44px) now meet
  the 44px minimum; mobile nav links got an explicit 44px hit area.

### Added (cont.)
- **Phase 6 — Roadmap (integrated):** the `data.roadmap` ideas (emitted by the portfolio
  hub) are now merged **into the main projects grid** as regular, **filterable** cards with a
  `planned`/`idea`/`building` status badge — so they sit among the projects and the existing
  Category/Status/Technology filters apply (you can filter to just "Planned"). They render
  with an icon placeholder (no repo image), an "Em Breve"/"Soon" button (no demo/repo), and
  **no speculative dates**. Added `roadmapToProjects()`, an `escapeHtml()` helper (now applied
  to card title/description/tags), `.badge--neutral`, an image-placeholder style, and
  `status.idea`/`status.building` + `projects.filter.idea`/`building` keys (PT+EN). Bumped the
  GitHub-enrichment cache key so returning visitors pick up the merged set.
- **Phase 3/4 (cont.):** keyboard-operable modal triggers (Enter/Space + role/tabindex via
  `modal.js`); scroll-reveal now reveals immediately under `prefers-reduced-motion` or when
  `IntersectionObserver` is unavailable (no flash of invisible content); carousel guard for
  zero testimonials.
- **i18n (M14):** project descriptions are now bilingual — added `project.<id>.description`
  keys (PT+EN) which `renderProjects()` already prefers, so cards translate in PT.
- **CSS (5.2):** the 5 color-picker swatch hexes (blue/red/green/orange/yellow), previously
  duplicated across `.color-indicator` and `.color-circle`, are now `--swatch-*` tokens.
- **Docs (5.4):** `MIGRATION-GUIDE.md` (a completed one-off migration) moved to `docs/archive/`.

### Added
- `assets/images/profile.jpg` (optimised). The old `assets/images/profile.png` is now
  unreferenced and can be removed (`git rm assets/images/profile.png`).
- `docs/audit-2026-06-09.md` and `docs/intervention-plan-2026-06-09.md`.

### Fixed
- **Phase 1 (SEO):** unified the canonical domain to `https://diogo-costa-silva.github.io`
  across `sitemap.xml`, `robots.txt`, and the `index.html` Open Graph/Twitter tags
  (previously a mix of `dipedilans.github.io` and `diogosilva.dev`); pointed `og:image`
  at an image that actually exists and added `og:type`, twitter image/description, and a
  canonical link on the homepage.
- **Phase 1 (i18n):** the resume Experience & Education timeline now translates to PT —
  wired all 32 hardcoded strings (titles, companies, dates, descriptions, achievements)
  to the existing `resume.exp*`/`resume.edu*` keys.
- **Phase 1 (i18n):** the 404 page body now translates (added 11 `error.*` keys EN+PT and
  `data-i18n`/`data-i18n-placeholder` attributes).
- **Phase 1 (i18n):** footer tagline now translates on all 7 pages (was missing on 5);
  the projects filter default value "All" now translates (static markup + the two
  selection handlers in `projects.js`).
- **Phase 1 (content):** the contact page's three social links pointed at `#` — now point
  at the real GitHub/LinkedIn/Twitter profiles with `rel="noopener"`.
- Projects page "Clear all" button did nothing. Two causes: the tech-checkbox selector
  used a non-existent `#techFilterDropdown` (real id is `#techMenu`), and a call to the
  undefined `updateTechCount()` threw a `ReferenceError` that aborted `applyFilters()`, so
  the grid never re-rendered. Same bug also broke removing a single technology chip.
  Fixed both selectors and replaced the undefined call with `updateTechDropdownValue()`.
