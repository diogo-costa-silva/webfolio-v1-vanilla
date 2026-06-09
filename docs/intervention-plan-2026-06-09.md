# Incremental Intervention Plan — webfolio-v1-vanilla

**Date:** 2026-06-09
**Companion to:** `audit-2026-06-09.md` (issue IDs H1–H5, M1–M21 below refer to it)
**Principle:** small, reversible, branch-per-change steps; `main` always deployable; **stay pure HTML/CSS/vanilla JS — no framework, no build step.**

---

## 0. CRITICAL REVISION (2026-06-09) — this repo is part of a multi-repo pipeline

The original audit treated `webfolio-v1-vanilla` as a standalone, hand-edited repo. That is **only partly true**. There is a separate source-of-truth monorepo, `~/Projects/portfolio`, that **generates** part of this repo's data.

### Data pipeline

```
GitHub repo topics  ┐
portfolio/data/overrides.json  ├─ sync.mjs ─► portfolio/data/projects.json (canonical)
portfolio/data/roadmap.json    ┘                         │
portfolio/data/taxonomy.json (vocab validation)          │
                                                         ├─ adapter-v1-vanilla.mjs ─► webfolio-v1-vanilla/data/projects.json  ({projects, roadmap})
                                                         ├─ adapter-portfolio-readme.mjs ─► portfolio/README.md
                                                         └─ adapter-profile-readme.mjs   ─► diogo-costa-silva/README.md ("Currently exploring")
```

### What is generated vs hand-maintained (authoritative)

| `webfolio-v1-vanilla/data/` file | Ownership | Edit it here? |
|---|---|---|
| **`projects.json`** | **GENERATED** by `portfolio/tools/adapter-v1-vanilla.mjs` (`writeFileSync`, line 54) — **fully overwritten** on every `npm run build:webfolio-v1`. Committed as a build artifact. | **NO.** Edit `portfolio/data/overrides.json` (projects) or `portfolio/data/roadmap.json` (roadmap), then `npm run sync && npm run build:webfolio-v1 -- <this>/data/projects.json`. |
| `translations.json` | Hand-maintained (hub has no knowledge of it) | Yes — edit here |
| `skills.json` | Hand-maintained (likely — no "from hub" commit; **confirm** before treating as generated) | Yes — edit here (verify) |
| `tech-icons.json` | Hand-maintained | Yes — edit here |

CLAUDE.md's rule "99% of content changes = edit `data/*.json`" must gain a caveat: **`projects.json` (incl. its `roadmap[]`) is generated upstream — never hand-edit it.** Recommend adding this to CLAUDE.md.

### Corrections to existing plan items

- **Step 4.5 (M14 — bilingual project descriptions): MOVED / REFRAMED.** Do **not** add `{en,pt}` to `projects.json` (overwritten on next sync). Two valid options: (a) keep descriptions in `translations.json` under `project.<id>.description` keys — `renderProjects()` already prefers `translations[descriptionKey]` over `project.description`, so this is the consistent, hand-owned path; or (b) extend the **hub** (`overrides.json` schema + adapter) to emit bilingual fields. Recommend (a). The **skills** half of M14 (`skills.json levelLabel/experience`) stays valid **iff** `skills.json` is hand-maintained (verify first).
- **Step 4.6 (M13 — tech-icons case mismatch): DIRECTION CONFIRMED, scope clarified.** The lowercase tech slugs live in the **generated** `projects.json`, so they cannot be hand-fixed here. Fix the **hand-owned** side: align `tech-icons.json` keys to the generator's lowercase slugs and add missing entries. (If a slug itself is wrong, fix it in `portfolio` overrides/taxonomy.)
- Everything else in the plan is unaffected — H1, H3, H4, H5, M1–M12, M15–M21, all U* touch HTML/CSS/JS/`translations.json`, none of which the hub generates.

### NEW workstream — render the roadmap on the site (the real pending follow-up)

The hub already emits `data.roadmap` into this repo's `projects.json`, but **nothing renders it** (`projects.js` reads only `data.projects`; zero references to `roadmap` anywhere). This is a site-side feature, safe to build here (the hub never overwrites JS/HTML/CSS/translations). Minimal, pattern-reusing steps:

1. **`projects.html`** — add `<section class="roadmap">` after `#projectsGrid` with `<h2 data-i18n="roadmap.title">` and an empty `#roadmapGrid`.
2. **`projects.js`** — where `data.projects` is in scope (around line 153), also call a new `renderRoadmap(data.roadmap, roadmapGrid)`, modeled on `renderProjects()` but simpler (fields: `problem`, `why`, `target`, `horizon`; `link` is `"#"`; no GitHub stats). Reuse `getCategoryIcon()`, `getCategoryDisplayName()`, `getTechIcon()`.
3. **Badges** — extend `getStatusBadge()` (idea/planned/building) and `getStatusDisplayName()`. Reuse `.badge--info/--warning`; **define `.badge--neutral`** if used (it's referenced for `archived` but not defined in CSS — pre-existing gap).
4. **`translations.json`** — add PT+EN for `roadmap.title` (+ subtitle), `status.idea`, `status.building`, `projects.filter.idea`, `projects.filter.building`. Reuse existing `status.planned`, `projects.filter.planned`.

Add this as **Phase 6 — Roadmap render** (independent, shippable). It does not touch generated data.

### Git untangling (current real state, 2026-06-09)

| Repo | Branch | State | Action |
|---|---|---|---|
| `webfolio-v1-vanilla` | `chore/phase-0-hygiene` | **All audit work UNCOMMITTED** (23 modified + 4 new) tangled with Gemini's generated `data/projects.json` roadmap change. HEAD still `7246eb8`. Sandbox can't commit (mount blocks git writes + stale `index.lock`). | Untangle on **your Mac** (see below). |
| `portfolio` | `feat/roadmap-wishlist` | roadmap commits `fee647e`+`59290cc` **committed AND pushed**. Clean. | Open PR → main when ready. |
| `diogo-costa-silva` (profile) | `feat/featured-projects` | `f624b03` committed, **NOT pushed**. | Push + PR. |
| `diogo-costa-silva.github.io` (prod) | `main` | Clean; CI-managed; local clone behind 7 (just `git fetch`). | No manual action. |

**Recommended untangle for `webfolio-v1-vanilla` (run on your Mac, where git works):**

```bash
cd ~/Projects/webfolio-v1-vanilla
rm -f .git/index.lock                 # clear the stale lock the sandbox left
git switch main                       # leave the misnamed phase-0 branch
git branch -d chore/phase-0-hygiene   # (empty — it has no commits)

# 1) Commit the generated projects.json roadmap SEPARATELY (it's a build artifact).
#    Prefer regenerating it from the hub so it's reproducible:
#    (cd ~/Projects/portfolio && npm run sync && npm run build:webfolio-v1 -- ~/Projects/webfolio-v1-vanilla/data/projects.json)
git switch -c chore/sync-roadmap-data
git add data/projects.json
git commit -m "chore(data): sync generated projects.json with roadmap from hub"

# 2) Commit the audit work on its own branch, grouped (see commit script in §1 QA / below).
git switch main
git switch -c chore/v1-hardening-2026-06
git add -A   # everything else (audit changes)
#   …then split into logical commits with `git add -p` / the grouped script.
```

Keep the two concerns on separate branches/PRs so the generated-data change never mixes with the hand-authored hardening work.

---

## 0.5. Execution status (2026-06-09)

What was actually applied to the working tree this session (all **uncommitted**, on branch `chore/phase-0-hygiene`, verified via JS syntax checks, JSON parity, and a local serve test — **not** yet browser-smoke-tested, because the dev session can't reach a browser).

Legend: ✅ done · ◑ partial · ⏸ deferred (ready, needs a local browser smoke test) · ⤴ reframed by the pipeline (§0) · ☐ not started · 👤 your action (GitHub settings / git, which the sandbox can't do)

| Step | Issue | Status | Notes |
|---|---|---|---|
| 0.1 fix `.gitignore` | M16 | ✅ | |
| 0.2 prune stale branches | M20 | 👤 | git writes blocked in sandbox |
| 0.3 branch protection | — | 👤 | GitHub settings |
| 0.4 deploy sanity check | M18 | ✅ | aborts before wiping prod |
| 0.5 changelog policy | M17 | ✅ | policy adopted + maintained |
| 1.1 canonical domains | H1 | ✅ | sitemap/robots/og + og:image fixed |
| 1.2 resume timeline i18n | H2 | ✅ | 32 elements wired |
| 1.3 footer tagline + contact links | M9 | ✅ | 5 footers + 3 real social links |
| 1.4 404 i18n | M21 | ✅ | 11 `error.*` keys EN+PT |
| 1.5 filter "All" i18n | U3 | ✅ | static + 2 JS handlers |
| 2.1 central translations | M1 | ✅ | cached promise; 8 fetches → 1 |
| 2.2 remove setTimeout races | M4 | ⏸ | risky without runtime test |
| 2.3 root-relative paths (+ drop no-cache) | H4, M3(part) | ✅ | 8 fetches |
| 2.4 loading / error states | H5, U2 | ⏸ | needs browser smoke test |
| 2.5 GitHub projects cache + timeout | M3 | ⏸ | needs browser smoke test |
| 2.6 anti-FOUC head script | H3 | ✅ | 7 pages (also covers 5.3) |
| 2.7 optimize profile image | M19 | ✅ | 778 KB → 112 KB; old PNG orphaned (`git rm`) |
| 3.1 null guards | M6 | ◑ | language.js done; color.js + testimonials.js pending |
| 3.2 skills event delegation | M5 | ☐ | |
| 3.3 remove inline skills fallback | M2 | ☐ | |
| 3.4 remove dead code | Low | ☐ | |
| 3.5 escapeHtml helper | M7 | ☐ | |
| 3.6 quiet console | M8 | ◑ | language.js done; rest pending |
| 3.7 single modal keydown | Low | ☐ | |
| 4.1 skip link + aria-current | M10 | ✅ | 7 pages + `a11y.skip` key + aria-current |
| 4.2 keyboard modal triggers | M10 | ☐ | volunteer cards → buttons |
| 4.3 focus rings + contrast | M12, U4 | ✅ | focus-visible, input ring, amber yellow + dark text |
| 4.4 OG/canonical per page + JSON-LD | M11 | ◑ | index OG/canonical done; other 6 pages + JSON-LD pending |
| 4.5 bilingual project descriptions | M14 | ⤴ | move to `translations.json` `project.<id>.description` or the hub — NOT `projects.json` |
| 4.6 tech-icons fix | M13 | ⤴☐ | fix `tech-icons.json` (hand-owned) only; not started |
| 4.7 touch targets ≥44px | U1 | ✅ | header buttons |
| 4.8 mobile menu full overlay | U5 | ☐ | |
| 4.9 scroll-reveal fallback | U6 | ☐ | |
| 5.1 z-index tokens | M15 | ☐ | |
| 5.2 swatch tokens | Low | ☐ | |
| 5.3 prefers-color-scheme first visit | Low | ✅ | done via the 2.6 anti-FOUC script |
| 5.4 archive/trim docs | Low | ☐ | |
| 5.5 header drift-guard / strategy | — | ☐ | documented in audit §4 only |
| 6.x render roadmap section | — (new) | ☐ | see §0 |

**Update (later in the session — browser-verified against `localhost:8000`):** the three ⏸ items and most ☐ items are now **done and verified in Chrome** (skills render + modal-via-delegation + Escape; projects loading/error states; GitHub cache + 8s timeout; the "Loading…" count now resolves on first render; console clean). Newly completed: 2.4 ✅, 2.5 ✅, 3.2 ✅, 3.3 ✅, 3.6 ✅, 4.4 ✅, 4.6 ✅ (tech-icons), 5.1 ✅ (z-index tokens). Partial: 2.2/M4 ◑ (skills `setTimeout`s removed; one in `language.js` left intentionally), 3.4 ◑ (`getInlineSkills`/`renderDots` removed; a couple of dead helpers remain), 3.7 ◑ (skills modal Escape added; `modal.js` not unified).

**Updated tally:** ~28 done, ~4 partial, 2 reframed (M13 done / M14 pending content), ~5 not started (4.2 keyboard modal triggers, 4.8 mobile-menu overlay, 4.9 scroll-reveal, 5.2 swatch tokens, 5.4 archive docs; M7 escapeHtml), 2 your-action (git/GitHub settings).

**Update 2 (browser-verified):** Phase 6 (roadmap render) ✅ shipped — distinct dashed cards, status badges, Problem/Why, **no speculative dates** on unstarted ideas (per agreement). Also done & verified: 4.2 keyboard modal triggers ✅, U5/4.8 full-screen mobile menu ✅ (root cause was `.header { will-change:transform }` trapping the fixed overlay — fixed with `100dvh` height), U6/4.9 reduced-motion/no-IO reveal fallback ✅, M7 `escapeHtml` ✅, mobile grid overflow ✅, 1024px breakpoint collision ✅, ≤480px touch targets ✅, +5 missing `status.*`/`filter.*` i18n keys ✅ (257/257 parity). A 3-agent UI/UX audit drove these fixes.

**Update 3 — all remaining items closed:** swatch-color tokens (5.2) ✅, `MIGRATION-GUIDE.md` archived via `git mv` in the commit script (5.4) ✅, and **M14** bilingual project descriptions ✅ (`project.<id>.description` PT+EN keys for all 8 projects; 265/265 parity). **Nothing left in the plan** — every H/M/U/phase item is done, deferred-to-you (git/GitHub settings), or intentionally upstream (the generated `projects.json`).

**Why this is safe to keep:** every applied change is hand-owned (HTML/CSS/JS/`translations.json`); none touched the generated `projects.json`. The pipeline discovery (§0) changes only the **not-yet-done** M13/M14.

---

## 1. How this plan is meant to be run

The plan is ordered by **(impact ÷ risk)**: visible correctness fixes first, then the robustness keystone, then hardening, then accessibility/data, then polish. Each phase is independent and shippable on its own — you can stop after any phase and the site is strictly better.

**Each item = one short-lived branch → one PR → merge → auto-deploy.** Do not batch unrelated changes into one branch.

### Git workflow per change

```bash
git switch main && git pull
git switch -c fix/seo-canonical-domains      # type/<slug>, one logical change
# ...edit, test locally (python3 -m http.server 8000)...
git add -p                                    # review every hunk; never `git add -A` blindly
git commit -m "fix(seo): unify canonical domain to diogo-costa-silva.github.io"
git push -u origin fix/seo-canonical-domains
# open PR -> run QA gates -> squash-merge -> branch auto-deletes
```

Branch types: `feat|fix|refactor|chore|docs|style|i18n/<slug>` (matches existing convention). Conventional-commit subjects. **No AI co-authorship trailers.** Update `CHANGELOG.md` `[Unreleased]` in the same PR.

### QA gates (run on every PR before merge)

Per the user's request, the **code-reviewer** and **frontend-designer** skills are wired in as gates:

1. **`/review`** (code-review skill) on the PR diff — logic, edge cases, vanilla-JS hygiene, no build-step creep.
2. **`/design-critique`** + **`/accessibility-review`** (design skills) for any PR that changes UI/markup/CSS — contrast, focus, keyboard, hierarchy.
3. **Manual smoke test** (the regression checklist in §4) — the 7 pages × PT/EN × light/dark, console clean, no 404s.
4. **CHANGELOG** updated; commit message conventional.

For higher-risk phases (2 and 3) a verification sub-agent can diff the before/after and re-run the smoke checklist.

---

## 2. Phase 0 — Safety net & repo hygiene (do first, zero user-facing risk)

Goal: make `main` safe to iterate on rapidly. No HTML/CSS/JS behavior changes.

| Step | Branch | Action | Issue |
|------|--------|--------|-------|
| 0.1 | `chore/fix-gitignore` | Invert the rule: ignore `.claude/settings.local.json` (or `.claude/*.local.json`); un-ignore & commit `.claude/settings.json`. | M16 |
| 0.2 | `chore/prune-branches` | Delete 3 merged local + 6 merged remote branches; enable **Automatically delete head branches** in GitHub settings. | M20 |
| 0.3 | — (GitHub settings) | Protect `main`: require PR before merge + require the deploy check to pass. | — |
| 0.4 | `ci/harden-deploy` | Add a pre-copy sanity check (`test -s index.html` and assert a few key files exist before the `rm -rf`); document switching `DEPLOY_TOKEN` to a **fine-grained PAT** scoped to `diogo-costa-silva.github.io` (`contents: write`) with an expiry. | M18 |
| 0.5 | `docs/changelog-policy` | Decide: keep `CHANGELOG.md` as a per-PR `[Unreleased]` log **or** remove the rule from CLAUDE.md. (Recommended: keep it, one bullet per PR.) | M17 |

**Exit criteria:** branch protection on, stale branches gone, deploy has a guard, `.gitignore` correct.

---

## 3. Phase 1 — Visible correctness & SEO (high impact, low risk)

Goal: fix what a recruiter or a PT-speaking visitor actually sees. Mostly content/markup, no architecture change.

| Step | Branch | Action | Issue |
|------|--------|--------|-------|
| 1.1 | `fix/seo-canonical-domains` | Replace **all** domain references with `https://diogo-costa-silva.github.io` in `sitemap.xml`, `robots.txt`, and `index.html` `og:url`. Refresh `sitemap.xml` `<lastmod>`. | H1 |
| 1.2 | `i18n/resume-timeline` | Wire every hardcoded string in the resume Experience/Education timeline to its existing `resume.exp*` / `resume.edu*` key via `data-i18n`. No new translations needed — they exist. **Verify in PT live.** | H2 |
| 1.3 | `fix/footer-tagline-i18n` | Add `data-i18n="footer.tagline"` to the 5 pages missing it; give the contact-page social links real `href`s (or remove them). | M9 |
| 1.4 | `i18n/404-page` | Add `data-i18n` to the 404 body strings; add `nav404.*` keys (PT+EN) for "Page Not Found", the message, the buttons, "Popular Pages". | M21 |
| 1.5 | `i18n/filter-values` | Translate the filter default values "All" (`.filter-dropdown__value` for Category/Status) — labels already translate, values don't. | U3 |

**Exit criteria:** one canonical domain everywhere; resume + footer + 404 fully bilingual; PT/EN smoke test passes on every page.

---

## 4. Phase 2 — Robustness keystone (the highest-leverage refactor)

Goal: one foundational change (centralized translations) plus the robustness fixes it unlocks. Do 2.1 first — the rest build on it.

| Step | Branch | Action | Issue |
|------|--------|--------|-------|
| 2.1 | `refactor/central-translations` | Make `core/language.js` own translations: fetch once, cache in a module variable, `export getTranslations()` / `t(key)`. Replace the 5 duplicated `loadTranslations()` copies with imports. Drop `cache:'no-cache'`. | M1 |
| 2.2 | `refactor/remove-init-timeouts` | Remove the magic `setTimeout`s; sequence rendering on the real translations-ready promise / `languageChanged` event from 2.1. | M4 |
| 2.3 | `fix/root-relative-paths` | Switch all `fetch('data/…')` to root-relative `fetch('/data/…')` (safe at the domain apex). Add a one-line comment documenting the apex assumption. | H4 |
| 2.4 | `feat/loading-error-states` | Add visible loading skeletons + empty/error messages for projects and skills; resolve the projects "Loading…" button to a normal state. | H5 |
| 2.5 | `fix/github-cache-projects` | Cache the projects-page GitHub enrichment (reuse the homepage cache mechanism, separate key); add an `AbortController` timeout that falls back gracefully. | M3, Low (timeout) |
| 2.6 | `feat/anti-fouc-theme` | Add a tiny blocking inline `<head>` script (per page) that reads `localStorage` and sets `data-theme`/`data-color` synchronously before CSS; simplify `initTheme()`/`initColor()` to just wire toggles. | H3 |
| 2.7 | `perf/optimize-profile-image` | Resize/compress `profile.png` (→ WebP or optimized PNG); update `<img>` references; consider `loading="lazy"` for the about image. | M19 |

**Exit criteria:** `translations.json` fetched **once** per page (verify in network panel); no `setTimeout` race patches; data loads from root-relative paths with visible loading/error states; no theme flash on navigation; profile image < ~150 KB.

---

## 5. Phase 3 — JS hardening & cleanup

Goal: remove fragility and dead weight; tidy for a recruiter-visible repo.

| Step | Branch | Action | Issue |
|------|--------|--------|-------|
| 3.1 | `fix/null-guards` | Guard `colorDropdown`/`languageToggle` together with their toggles; bail early in outside-click listeners when elements are absent; add `if (!cards.length) return;` to the carousel and skip autoplay for a single card. | M6 |
| 3.2 | `refactor/skills-event-delegation` | Replace clone-and-replace with one delegated `click` listener on the skills grid (`e.target.closest('.skill-item')`); remove the resize re-clone. | M5 |
| 3.3 | `refactor/remove-inline-skills-fallback` | Delete the 220-line `getInlineSkills()`; on failure show the same error state as projects (from 2.4). | M2 |
| 3.4 | `chore/remove-dead-code` | Remove `renderDots`, `initMobileSwipe`, `github-api.js clearCache`; delete dead `#root`/`#__next` CSS and the unused `--footer-height` token. | Low |
| 3.5 | `refactor/escape-html-helper` | Add a small `escapeHtml()` and use it for interpolated `innerHTML`; fix the `data-skill` quoting (e.g. store an id/index, look up the object instead of embedding JSON). | M7 |
| 3.6 | `chore/quiet-console` | Gate info `console.log`s behind a `const DEBUG=false`; keep `console.error/warn` for real failures; translate the one hardcoded PT `aria-label`; standardize code comments to English. | M8, Low |
| 3.7 | `refactor/single-modal-keydown` | Move the modal Escape handler to one shared document listener instead of one per Modal instance. | Low |

**Exit criteria:** no unguarded DOM derefs; no clone-and-replace; no dead code; clean console in production; consistent comment language.

---

## 6. Phase 4 — Accessibility & data model

Goal: meet WCAG 2.1 AA basics and finish the bilingual data layer.

| Step | Branch | Action | Issue |
|------|--------|--------|-------|
| 4.1 | `a11y/skip-link-aria-current` | Add a visually-hidden-until-focus skip link + `<main id="main">`; add `aria-current="page"` to active nav (set from `location.pathname`). | M10 |
| 4.2 | `a11y/keyboard-modal-triggers` | Convert clickable `<div data-modal-trigger>` to `<button>` (or `role="button"` + `tabindex=0` + Enter/Space). | M10 |
| 4.3 | `a11y/focus-and-contrast` | Restore visible `box-shadow` focus rings where `outline:none` is used (inputs compute no outline AND no box-shadow today); darken the yellow theme's action tokens (or dark text on primary) to pass contrast. | M12, U4, Low |
| 4.7 | `a11y/touch-targets` | Bump the header toggle buttons (theme/language/color) and language-dropdown rows to ≥44×44 px (padding, not just icon size). | U1 |
| 4.8 | `a11y/mobile-menu-overlay` | Give the mobile menu a full-height/solid backdrop so page content doesn't show through beneath it; optionally trap focus while open. | U5 |
| 4.9 | `fix/scroll-reveal-fallback` | Ensure scroll-revealed content is visible without JS / under `prefers-reduced-motion` and isn't left at `opacity:0` on fast scroll (avoid flash of invisible content). | U6 |
| 4.4 | `feat/og-canonical-per-page` | Add per-page OG/Twitter tags + `rel="canonical"`; add a `Person` JSON-LD block to `index.html`. | M11, Low |
| 4.5 | `data/bilingual-projects-skills` | Make `projects.json` `description` and `skills.json` `levelLabel`/`experience` bilingual (`{en,pt}` or map to existing `levels.*`/`experience.*` keys); update render JS to pick by language. | M14 |
| 4.6 | `data/fix-tech-icons` | Align `tech-icons.json` key case with `projects.json` slugs (lowercase) and add the missing entries (`eda`, `groq`, `ollama`, `postgis`, `geopandas`, …); normalize lookups. | M13 |

**Exit criteria:** keyboard-operable everything, visible focus, AA contrast in all 4 color themes, every page shares a correct preview, all visible content translates including skills/projects data.

---

## 7. Phase 5 — Polish & docs

| Step | Branch | Action | Issue |
|------|--------|--------|-------|
| 5.1 | `refactor/z-index-tokens` | Route dropdown/modal stacking through the `--z-*` scale so dropdowns can't cover modals. | M15 |
| 5.2 | `refactor/swatch-tokens` | Define the 5 swatch colors once as named tokens; reuse for indicator + circle. | Low |
| 5.3 | `feat/prefers-color-scheme` | Honor OS dark mode on first visit (before any stored choice). | Low |
| 5.4 | `docs/archive-and-trim` | Move `MIGRATION-GUIDE.md` to `docs/archive/`; trim/split `INFO.md`; keep README lean. | Low |
| 5.5 | `docs/decide-header-strategy` | Decide header/footer duplication strategy: ship the **drift-guard script** (Option C) now; document Option A/B (JS partials) as a future v2. | (audit §4) |

---

## 8. Regression smoke checklist (run before every merge)

- [ ] All 7 pages load with no console errors and no failed (non-200) requests.
- [ ] Toggle PT ↔ EN on every page — **all** visible text switches (headers, nav, body, resume timeline, skills labels, 404, footer tagline).
- [ ] Toggle light ↔ dark and all 4 color themes — no flash on navigation; readable contrast.
- [ ] Projects + skills show a loading state, then content; simulate a failed fetch (DevTools offline) → a visible error message, not an empty page.
- [ ] Keyboard-only: skip link works, all controls reachable and operable, visible focus, modals open/close with Enter/Escape.
- [ ] `translations.json` fetched once (network panel).

---

## 9. Suggested sequencing & "stop points"

1. **Phase 0 + Phase 1** in one sitting → the site is correct and professional (biggest visible wins). Safe stop point.
2. **Phase 2** next session → the site is robust. Safe stop point.
3. **Phase 3**, then **Phase 4**, then **Phase 5** as time allows — each independently shippable.

Tag **`v1.0.0`** after Phase 2 (correct + robust), and **`v1.1.0`** after Phase 4 (accessible + fully bilingual). Cut a dated CHANGELOG section at each tag.

Nothing in this plan introduces a framework, bundler, or build step. The architecture stays exactly as designed — this is hardening, de-duplication, and finishing, not a rewrite.
