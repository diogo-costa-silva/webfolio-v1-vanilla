# Changelog

## [Unreleased]

### Changed
- Bumped `actions/checkout@v4` → `@v5` in the deploy workflow (and the embedded
  `static.yml`) to run on Node.js 24, clearing the Node 20 deprecation warning.

### Fixed
- Projects page "Clear all" button did nothing. Two causes: the tech-checkbox selector
  used a non-existent `#techFilterDropdown` (real id is `#techMenu`), and a call to the
  undefined `updateTechCount()` threw a `ReferenceError` that aborted `applyFilters()`, so
  the grid never re-rendered. Same bug also broke removing a single technology chip.
  Fixed both selectors and replaced the undefined call with `updateTechDropdownValue()`.
