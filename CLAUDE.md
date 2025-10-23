# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pure HTML/CSS/JavaScript portfolio website with **zero build process**. Content is data-driven through JSON files, enabling quick updates without touching HTML. Deployed via GitHub Actions to GitHub Pages.

**Live Site:** https://diogo-costa-silva.github.io


## Coding Principles

- **Simplicity First:** Make every code change as simple as possible. Avoid massive or complex changes. Each change should impact minimal code.
- **High-Level Explanations:** Provide clear, concise explanations of changes made at each step.
- **English Only:** All code, documentation, comments, and variable names must be written in English.


## Git

- Keep commits simple, descriptive, and sequential
- Use conventional commit format: `feat:`, `fix:`, `style:`, etc.


## MCPs

Use available MCPs whenever possible:

Chrome Dev Tools: to test all aspects of the website, take screenshots, and analyze them to make decisions and propose approaches based on these findings.



## Development Commands

### Local Development

No npm install needed - pure HTML
VS Code Live Server (recommended)
Runs at http://127.0.0.1:5500


### Git Identity Management
```bash
# Verify current identity before commits
git config user.name
git config user.email

# Set identity (use aliases if configured)
gset-dd   # For dipedilans account
gset-dcs  # For diogo-costa-silva account
```

### Deployment
```bash
# Every push to main triggers automatic GitHub Actions deployment
git add .
git commit -m "feat: description"
git push origin main

# Monitor deployment
gh run list --limit 5
gh run view <run-id>
```

## Architecture

### Deployment Architecture

This repository is part of a **source → deploy** architecture:

```
┌────────────────────────────┐
│  webfolio-v1-vanilla       │  Source Repository (this is where development happens)
│  github.com/diogo-costa-   │
│  silva/webfolio-v1-vanilla │
│                            │
│  • All source code         │
│  • Development history     │
│  • GitHub Actions workflow │
└─────────────┬──────────────┘
              │
              │ Automated deployment via GitHub Actions
              │ Triggers on: push to main
              │
              ▼
┌────────────────────────────┐
│  diogo-costa-silva.        │  Deployment Repository (GitHub Pages target)
│  github.io                 │
│                            │
│  • Receives deployed code  │
│  • Clean deployment history│
│  • Serves GitHub Pages     │
└────────────────────────────┘
              │
              │
              ▼
     https://diogo-costa-silva.github.io
```

**Key Points:**
- **Source repo:** `webfolio-v1-vanilla` - All development work happens here
- **Deploy repo:** `diogo-costa-silva.github.io` - Only receives automated deployments
- **Workflow:** `.github/workflows/deploy-from-source.yml` handles deployment
- **Authentication:** Uses Personal Access Token stored in `DEPLOY_TOKEN` secret
- **Future flexibility:** Easy to switch to different tech stack (create `webfolio-v2-react` and point workflow there)

**Versioning Strategy:**
- `webfolio-v0-jekyll` - Original Jekyll template (archived)
- `webfolio-v1-vanilla` - Current: Pure HTML/CSS/JS built from scratch
- `webfolio-v2-react` - Future: Potential React version
- `webfolio-v3-nextjs` - Future: Potential Next.js version

To switch deployment source, simply:
1. Create new version repo (e.g., `webfolio-v2-react`)
2. Add same `DEPLOY_TOKEN` secret
3. Add same workflow file pointing to `diogo-costa-silva.github.io`
4. Deploy repo automatically receives new content

### Core Design Philosophy

**Trade-off:** ~1000 lines of duplicated HTML (header/footer across 7 pages) in exchange for zero build complexity.

- **99% of updates** = Edit JSON files (`data/*.json`)
- **1% of updates** = Edit HTML (navigation changes require updating all 7 pages)

### Module Initialization Order

Critical initialization sequence in `assets/js/main.js`:

```javascript
initColor();        // Must run first (establishes color system)
initTheme();        // Applies dark/light mode
initLanguage();     // Loads translations, must run before page-specific
initHeader();       // Navigation setup
initFooter();       // Footer setup
initAnimations();   // Scroll observers
initBackToTop();    // Back to top button
initModals();       // Modal system
// Then page-specific: initHero(), initProjects(), etc.
```

**Never change this order** - language must initialize before page-specific modules that use translations.

### Color Theme System

Five color themes available via header dropdown (persists to localStorage):

| Theme | Primary Color | Hex Code | Usage |
|-------|--------------|----------|-------|
| **Blue** (default) | Material Blue | `#2196f3` | Default theme |
| **Red** | Material Red | `#f44336` | Alternative theme |
| **Green** | Material Green | `#4caf50` | Alternative theme |
| **Orange** | Material Orange | `#ff9800` | Alternative theme |
| **Yellow** | Bright Yellow | `#ffeb3b` | Alternative theme |

- Themes defined in `assets/css/variables.css` using `[data-color="..."]` selectors
- Applied via `data-color` attribute on `<html>` element
- Initialized by `initColor()` which **must run first** (before theme/language)
- Color preference persists across sessions via localStorage
- Changes all primary color variants (50-900 shades)

### Data Flow Architecture

1. **Static Structure (HTML)**: Page skeleton with `data-i18n` attributes
2. **Dynamic Content (JSON)**: Skills, projects, translations loaded at runtime
3. **Client Rendering (JS)**: Modules fetch JSON and inject into DOM
4. **User Preferences (localStorage)**: Theme and language persist across sessions

### Key Modules

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| `language.js` | PT/EN switching | `getCurrentLanguage()`, `setLanguage()` |
| `projects.js` | Project filtering/display | `initProjects()`, filters by category/status/tech |
| `github-api.js` | Fetch repo stats | `enrichProjectsWithGitHubData()` (1hr cache) |
| `theme.js` | Dark/light mode | `initTheme()`, persists to localStorage |
| `navigation.js` | Header behavior | Smart hide/show on scroll, mobile menu |
| `skills.js` | Skills rendering | Loads `data/skills.json`, displays with icons |
| `contact.js` | Contact form | EmailJS integration, validation |
| `animations.js` | Scroll effects | IntersectionObserver for fade-ins |

### Multi-Filter System (`projects.js`)

Advanced filtering state object:
```javascript
filterState = {
    categories: [],      // Multi-select categories
    statuses: [],        // Multi-select statuses
    technologies: [],    // Multi-select technologies
    realOnly: false,     // Toggle for real projects only
    searchTerm: ''       // Search input
}
```

All filters apply simultaneously (AND logic). Projects must match ALL active filters.

### GitHub API Integration

- **Caching:** 1-hour localStorage cache (`CACHE_DURATION = 3600000ms`)
- **Rate Limiting:** Gracefully handles 403/429 responses
- **Enrichment:** Adds stars, watchers, forks, lastCommit to projects
- **Function:** `getRecentProjects()` returns 6 most recently updated repos

### Technology Icon Mapping

Technology icons are loaded from `data/tech-icons.json`, which maps technology names to DevIcon CSS classes:
```json
{
  "Python": "devicon-python-plain colored",
  "React": "devicon-react-original colored",
  "Docker": "devicon-docker-plain colored"
  // 70+ technology mappings
}
```

When adding new technologies to `data/projects.json`, ensure they exist in `data/tech-icons.json` or add them. Icons are loaded from the DevIcon CDN.

## Content Updates

### Add/Edit Skills
Edit `data/skills.json`:
```json
{
  "name": "Docker",
  "icon": "devicon-docker-plain",
  "proficiency": 85,
  "years": "3+",
  "featured": true,
  "category": "devops"
}
```

### Add/Edit Projects
Edit `data/projects.json`:
```json
{
  "id": 1,
  "title": "Project Name",
  "category": "data-science",
  "status": "completed",
  "difficulty": "intermediate",
  "featured": true,
  "technologies": ["Python", "Docker"],
  "github": "https://github.com/user/repo",
  "demo": "#",
  "description": "Description...",
  "image": "https://...",
  "isReal": true
}
```

**Important:** If adding new technologies, check if they exist in `data/tech-icons.json` or add them.

### Update Translations
Edit `data/translations.json`:
```json
{
  "en": { "nav.home": "Home", "hero.greeting": "Hello" },
  "pt": { "nav.home": "Início", "hero.greeting": "Olá" }
}
```

HTML elements with `data-i18n="nav.home"` will automatically update.

### Navigation Changes

**Warning:** Requires editing all 7 HTML files (index, skills, projects, about, contact, resume, 404). Header/footer are duplicated across all pages.

Files to update: `index.html`, `skills.html`, `projects.html`, `about.html`, `contact.html`, `resume.html`, `404.html`

## CSS Architecture

### Design System Variables
All design tokens in `assets/css/variables.css`:
```css
/* Colors */
--primary: #2196f3;
--text-primary: #212121;

/* Dark theme (prefers-color-scheme or .dark-theme) */
[data-theme="dark"] {
  --primary: #64b5f6;
  --text-primary: #ffffff;
}

/* Spacing scale */
--space-xs: 0.25rem;  /* 4px */
--space-md: 1rem;     /* 16px */
--space-3xl: 4rem;    /* 64px */
```

### File Structure
- `reset.css` - Browser normalization
- `variables.css` - Design tokens (edit here for global changes)
- `base.css` - Typography, base styles
- `layout.css` - Header, footer, grid systems
- `components.css` - Reusable components (buttons, cards)
- `utilities.css` - Helper classes
- `animations.css` - Keyframes, transitions
- `pages/*.css` - Page-specific overrides

### Responsive Breakpoints
```css
/* Mobile: 0-767px (base styles, no media query) */
/* Tablet: 768px-1023px */
@media (min-width: 768px) { ... }

/* Desktop: 1024px+ */
@media (min-width: 1024px) { ... }
```

## GitHub Actions Deployment

### Current Deployment Model (Post-Migration)

**This repository (`diogo-costa-silva.github.io`) is a deployment target, not a source.**

Deployment flow:
1. **Developer pushes to:** `webfolio-v1-vanilla` repository
2. **GitHub Actions runs in:** `webfolio-v1-vanilla` (workflow: `deploy-from-source.yml`)
3. **Workflow deploys to:** This repository (`diogo-costa-silva.github.io`)
4. **GitHub Pages serves from:** This repository automatically

**Workflow file location:** `webfolio-v1-vanilla/.github/workflows/deploy-from-source.yml`

**This repo's workflow:** `.github/workflows/static.yml` (standard GitHub Pages workflow)
- Triggers automatically when content is pushed by the source workflow
- No manual intervention needed

### Legacy Deployment Model (Pre-Migration)

Before migration, this repository contained both source and deployment:
- Workflow: `.github/workflows/static.yml`
- Triggered on every push to `main` in this repo
- Deployed directly to GitHub Pages

### Deployment Time

End-to-end deployment: 60-90 seconds
- Source workflow: 30-45 seconds (clone, copy, push)
- Pages deployment: 30-45 seconds (build, deploy)

## Important Constraints

1. **No Build Process:** Everything must work directly in browser - no Webpack, Vite, or preprocessors
2. **ES6 Modules:** Use `import/export`, scripts load with `type="module"`
3. **Relative Paths:** All asset paths must be relative (no leading `/`)
4. **Duplicate HTML:** Accept header/footer duplication - changing nav = edit 7 files
5. **DevIcon CDN Dependency:** All technology icons load from `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css`. Icons are mapped in `data/tech-icons.json`. When adding technologies, verify they exist in the [DevIcon library](https://devicon.dev/). CDN failure or offline mode shows fallback text only.

## Testing Checklist

Before pushing changes:
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test mobile responsive (DevTools mobile view)
- [ ] Verify dark/light theme toggle works
- [ ] Verify PT/EN language switching works
- [ ] Check browser console for errors
- [ ] Validate all links work (especially relative paths)
- [ ] Test project filters (category, status, tech, search)

## Common Issues

### Images/CSS Not Loading
- Verify paths are relative: `assets/css/main.css` not `/assets/css/main.css`
- Check file exists in repository
- Hard refresh browser (Cmd+Shift+R)

### Translations Not Applying
- Ensure `initLanguage()` runs before page-specific modules
- Check `data-i18n` attribute matches key in `translations.json`
- Verify JSON syntax is valid (trailing commas break JSON)

### GitHub API Rate Limiting
- API uses 1-hour cache to minimize requests
- Rate limit: 60 requests/hour (unauthenticated)
- If limited, cached data continues to display

### Project Filters Not Working
- Verify filter values match project data exactly (case-sensitive)
- Check `filterState` object in browser console
- Ensure `initProjects()` is called for the page
