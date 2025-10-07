# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with **pure HTML, CSS, and JavaScript**. No frameworks, no build process, no SSG - intentionally simple for maximum deployment speed and maintainability.

**Live Site:** https://diogo-costa-silva.github.io

**Architecture Philosophy:** 99% of updates involve editing JSON files (skills, projects, translations). The 1% trade-off is ~1000 lines of duplicated HTML (header/footer across 7 files) to avoid build complexity.

## Commands

### Local Development

use VS Code Live Server (Recommended)
Runs at http://127.0.0.1:5500


### Git Identity Management

```bash
# Set git identity for diogo-costa-silva account (REQUIRED before commits)
gset-dcs

# Verify identity
git config user.name   # Should show: Diogo Silva
git config user.email  # Should show: 92042225+diogo-costa-silva@users.noreply.github.com
```

### Deployment

```bash
# Standard deployment workflow
gset-dcs                                   # Set correct identity
git add .                                  # Stage changes
git commit -m "feat: description"          # Commit (use conventional commits)
git push origin main                       # Deploy

# GitHub Actions automatically deploys to GitHub Pages (30-60 seconds)
```

### Monitoring Deployments

```bash
# View latest workflow runs
gh run list --repo diogo-costa-silva/diogo-costa-silva.github.io --limit 5

# Watch live deployment (get run-id from list above)
gh run view <run-id> --repo diogo-costa-silva/diogo-costa-silva.github.io
```

## Project Structure

```
website-v3/
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design system (CSS custom properties)
│   │   ├── layout.css         # Header, footer, grid
│   │   ├── components.css     # Reusable components
│   │   └── pages/             # Page-specific styles
│   ├── js/
│   │   ├── main.js            # Entry point - initializes all modules
│   │   ├── navigation.js      # Header behavior, mobile menu, progress bar
│   │   ├── theme.js           # Dark/light mode + localStorage
│   │   ├── color.js           # Color theme switcher (blue/red/green)
│   │   ├── language.js        # PT/EN switcher + translations loader
│   │   ├── skills.js          # Skills JSON loader + rendering
│   │   ├── projects.js        # Projects JSON loader + filtering
│   │   ├── github-api.js      # GitHub API integration (stars, commits)
│   │   └── contact.js         # Form validation + EmailJS
│   └── images/
├── data/
│   ├── skills.json            # ⭐ Edit to add/update skills
│   ├── projects.json          # ⭐ Edit to add/update projects
│   └── translations.json      # PT/EN translations (i18n)
├── *.html                     # 7 pages (index, about, skills, projects, contact, resume, 404)
└── .github/workflows/static.yml  # GitHub Actions deployment
```

## Architecture

### JavaScript Module System

Entry point is `main.js`, which initializes modules in this **specific order** (critical):

```javascript
// Order matters!
initColor();      // 1. Color theme (must run first)
initTheme();      // 2. Dark/light mode (must run second)
initLanguage();   // 3. Load translations (before rendering)
initHeader();     // 4. Navigation
initFooter();     // 5. Footer
initAnimations(); // 6. Scroll animations
initBackToTop();  // 7. Back-to-top button
initModals();     // 8. Modal dialogs

// Page-specific (conditional)
initHero();       // Homepage only
initSkills();     // Homepage + skills page
initProjects();   // Homepage (6 recent) + projects page (all)
initContact();    // Contact page only
```

### Data-Driven Content

Projects and skills are **loaded from JSON at runtime**:

- **Homepage:** Shows 6 most recent projects (fetched via GitHub API by last commit date)
- **Projects Page:** Shows all projects with GitHub stats (stars, last commit), enriched via API
- **Skills Page:** Renders from `skills.json` with proficiency bars and DevIcon icons

### GitHub API Integration

`github-api.js` handles:
- Caching (1 hour) to reduce API calls
- Rate limit handling (falls back gracefully)
- Enriching projects with stars, watchers, forks, last commit date
- Sorting by recency for homepage display

### Multi-Language Support

Translations in `data/translations.json`:
```json
{
  "en": { "nav.home": "Home", ... },
  "pt": { "nav.home": "Início", ... }
}
```

All translatable elements have `data-i18n="key"` attributes. The `language.js` module updates them dynamically.

### Theme System

**Three independent systems:**

1. **Dark/Light Mode** (`theme.js`)
   - Toggles `data-theme="dark"` on `<html>`
   - Persisted in `localStorage`

2. **Color Theme** (`color.js`)
   - Switches primary color (blue/red/green)
   - Updates CSS custom properties dynamically
   - Persisted in `localStorage`

3. **CSS Variables** (`variables.css`)
   - All colors, spacing, typography defined as custom properties
   - Scoped to `:root` and `[data-theme="dark"]`

### Project Filtering (Projects Page)

Advanced multi-filter system with AND logic:
- **Categories:** data-science, machine-learning, web-dev, backend, devops, automation, mobile
- **Statuses:** completed, in-progress, planned
- **Technologies:** Multi-select checkboxes (auto-populated from projects)
- **Real/Demo Toggle:** Show only `isReal: true` projects
- **Search:** Text search across title + description

All filters work together (AND logic). Applied filters shown as removable chips.

## Content Updates

### Add a New Project

Edit `data/projects.json`:

```json
{
  "id": "unique-slug",
  "title": "Project Title",
  "category": "web-dev",           // See categories above
  "status": "completed",           // completed | in-progress | planned
  "difficulty": "intermediate",    // novice | beginner | intermediate | advanced | expert
  "featured": true,
  "isReal": true,                  // true for real projects, false for demos
  "description": "Short description...",
  "technologies": ["React", "Node.js"],
  "github": "https://github.com/username/repo",  // or "#" if unavailable
  "demo": "https://demo-url.com",                // or "#" if unavailable
  "image": "https://image-url.jpg"
}
```

**Important:**
- If `github` is a valid URL and `isReal: true`, GitHub API will fetch stars/commits
- Homepage shows 6 most recent projects (by `lastCommitDate` from GitHub API)
- Projects page shows all projects with filtering enabled

### Add Translations for Projects

Edit `data/translations.json`:

```json
{
  "en": {
    "project.unique-slug.title": "English Title",
    "project.unique-slug.description": "English description..."
  },
  "pt": {
    "project.unique-slug.title": "Título em Português",
    "project.unique-slug.description": "Descrição em português..."
  }
}
```

### Add a New Skill

Edit `data/skills.json`:

```json
{
  "name": "Docker",
  "icon": "devicon-docker-plain colored",  // See DevIcon docs
  "proficiency": 85,                       // 0-100
  "years": "3+",
  "category": "devops",
  "featured": true
}
```

## Deployment

### GitHub Pages with GitHub Actions

Every push to `main` triggers automatic deployment via `.github/workflows/static.yml`:

1. Checkout code
2. Setup Pages
3. Upload artifact (entire repo)
4. Deploy to GitHub Pages

**Workflow file:** `.github/workflows/static.yml`

**Key points:**
- No build step (pure HTML)
- Deploys in 30-60 seconds
- View status: https://github.com/diogo-costa-silva/diogo-costa-silva.github.io/actions

### Commit Message Convention

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - CSS/visual changes
- `perf:` - Performance improvements
- `refactor:` - Code restructuring
- `chore:` - Maintenance
- `ci:` - CI/CD changes

## Design System

### CSS Custom Properties

All design tokens in `assets/css/variables.css`:

```css
/* Colors */
--primary-500: #2196f3;  /* Blue (default) */
--gray-900: #212121;     /* Dark text */

/* Typography */
--font-primary: 'Inter', sans-serif;
--font-mono: 'Fira Code', monospace;
--text-base: 1rem;       /* 16px */

/* Spacing */
--space-md: 1rem;        /* 16px */
--space-xl: 2rem;        /* 32px */
--space-3xl: 4rem;       /* 64px */

/* Layout */
--container-max: 1280px;
--header-height: 64px;
```

### Responsive Breakpoints

```css
/* Mobile-first */
/* Base: 0-767px (no media query) */

/* Tablet: 768px+ */
@media (min-width: 768px) { ... }

/* Desktop: 1024px+ */
@media (min-width: 1024px) { ... }
```

### BEM Naming Convention

```css
.project-card { }                  /* Block */
.project-card__title { }           /* Element */
.project-card--featured { }        /* Modifier */
```

## Navigation Structure

### Header (Duplicated in all 7 HTML files)

```html
<header id="header" class="header">
  <!-- Logo -->
  <!-- Desktop Nav (≥1024px) -->
  <!-- Mobile Hamburger (<1024px) -->
  <!-- Controls: Language | Theme | Color -->
</header>
```

**Smart Header Behavior:**
- Hides on scroll down
- Shows on scroll up
- Progress bar indicates scroll position
- Mobile: Full-screen overlay menu

### Footer (Duplicated in all 7 HTML files)

Contains:
- Social links (GitHub, LinkedIn, Email)
- Quick navigation links
- Copyright notice
- Auto-updating year

## Important Files to Modify

### For Content Updates
- `data/skills.json` - Add/edit skills
- `data/projects.json` - Add/edit projects
- `data/translations.json` - Add/edit text (PT/EN)

### For Styling
- `assets/css/variables.css` - Design tokens
- `assets/css/components.css` - Component styles
- `assets/css/pages/*.css` - Page-specific styles

### For Functionality
- `assets/js/main.js` - Initialization order
- `assets/js/projects.js` - Project filtering logic
- `assets/js/github-api.js` - GitHub API integration

### For Deployment
- `.github/workflows/static.yml` - GitHub Actions workflow

## HTML Structure (All Pages)

Each HTML file follows this pattern:

```html
<!DOCTYPE html>
<html lang="pt">
<head>
  <!-- Meta tags -->
  <!-- CSS: reset → variables → base → layout → components → utilities → animations → page-specific -->
  <!-- Google Fonts -->
</head>
<body>
  <!-- Progress Bar -->
  <!-- Header (exact duplicate on all pages) -->

  <!-- Main Content (unique per page) -->
  <main>...</main>

  <!-- Footer (exact duplicate on all pages) -->
  <!-- Back to Top Button -->

  <!-- DevIcons CDN -->
  <!-- JS Modules (type="module") -->
  <script type="module" src="assets/js/main.js"></script>
</body>
</html>
```

## Troubleshooting

### Changes Not Appearing on Live Site
1. Wait 1-2 minutes for GitHub Pages deployment
2. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
3. Check deployment status: `gh run list --repo diogo-costa-silva/diogo-costa-silva.github.io`

### Wrong Git Identity
```bash
git config user.name   # Verify current identity
gset-dcs               # Fix if wrong
```

### CSS/JS Not Loading
- Ensure paths are **relative** (no leading `/`)
- Correct: `href="assets/css/main.css"`
- Wrong: `href="/assets/css/main.css"`

### GitHub API Rate Limiting
- Caching reduces calls (1 hour cache)
- Falls back gracefully (no stats shown)
- Max 60 requests/hour (unauthenticated)

## Key Differences from Typical Web Projects

1. **No Build Process:** Direct deployment, no npm, no bundler
2. **Duplicated HTML:** Header/footer repeated in 7 files (intentional trade-off)
3. **Runtime Data Loading:** JSON loaded dynamically via fetch()
4. **GitHub API Integration:** Real-time stats for projects
5. **No Routing:** Multi-page site (not SPA)
6. **ES6 Modules:** Native browser support, no transpiling

## Pages

1. **index.html** - Homepage (hero, featured skills, 6 recent projects, testimonials)
2. **about.html** - About me, experience, education
3. **skills.html** - All skills with proficiency levels
4. **projects.html** - All projects with advanced filtering
5. **contact.html** - Contact form (EmailJS integration)
6. **resume.html** - Downloadable CV, professional summary
7. **404.html** - Custom error page

## External Dependencies

- **DevIcons CDN:** Technology icons (https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css)
- **Google Fonts:** Inter (UI), Fira Code (monospace)
- **EmailJS:** Contact form backend (loaded in contact.html only)
- **GitHub API:** Repository stats (stars, commits)

## Future Migration Path

When ready for custom domain:

```bash
# 1. Create CNAME file
echo "diogosilva.dev" > CNAME
git add CNAME
git commit -m "feat: add custom domain"
git push origin main

# 2. Configure DNS at registrar
# - Add A records pointing to GitHub IPs
# - Add CNAME record: www → diogo-costa-silva.github.io

# 3. Enable HTTPS in GitHub Pages settings
```

## Critical Rules

1. **Always run `gset-dcs` before committing** (sets correct git identity)
2. **Test locally before deploying** (Live Server or Python HTTP server)
3. **Edit JSON for content, not HTML** (skills, projects, translations)
4. **Maintain initialization order in main.js** (color → theme → language → rest)
5. **Use relative paths in HTML** (no leading `/`)
6. **Follow BEM naming for CSS** (block__element--modifier)
7. **Keep duplicated HTML in sync** (header/footer across 7 files)
