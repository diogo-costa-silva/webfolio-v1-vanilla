# Changelog

## [Unreleased]

### Fixed
- Projects page "Clear all" button did nothing. Two causes: the tech-checkbox selector
  used a non-existent `#techFilterDropdown` (real id is `#techMenu`), and a call to the
  undefined `updateTechCount()` threw a `ReferenceError` that aborted `applyFilters()`, so
  the grid never re-rendered. Same bug also broke removing a single technology chip.
  Fixed both selectors and replaced the undefined call with `updateTechDropdownValue()`.
