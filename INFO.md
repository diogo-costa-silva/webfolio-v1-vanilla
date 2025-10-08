# INFO.md - Technical Documentation

**Portfolio Website Technical Architecture & Design Decisions**

For casual visitors and quick-start guide, see [README.md](README.md).

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design System](#design-system)
3. [JavaScript Architecture](#javascript-architecture)
4. [Data-Driven Content](#data-driven-content)
5. [GitHub API Integration](#github-api-integration)
6. [Advanced Features](#advanced-features)
7. [Performance & Optimization](#performance--optimization)
8. [Deployment Pipeline](#deployment-pipeline)
9. [Development Guidelines](#development-guidelines)
10. [Project Statistics](#project-statistics)

---

## Architecture Overview

### Project Philosophy

This portfolio is built on a **radical simplicity principle**: zero build process, zero dependencies, zero complexity.

### The Fundamental Trade-off

**Accept:** ~1000 lines of duplicated HTML (header/footer across 7 pages)
**Gain:** Zero build complexity, instant deployment, maximum maintainability

#### Why This Trade-off Makes Sense

- **99% of updates** = Edit JSON files (`data/*.json`)
- **1% of updates** = Edit HTML (navigation changes require updating 7 files)

#### Benefits of Zero Build Process

✅ **Direct deployment:** `git push` → live in 30-60 seconds
✅ **No build failures:** What you write is what you deploy
✅ **Zero dependencies:** No `node_modules`, no version conflicts
✅ **Works offline:** Open `index.html` directly in browser
✅ **Maximum simplicity:** Any developer can understand the codebase instantly
✅ **No tooling knowledge:** No Webpack, Vite, or Babel configuration needed

#### Drawbacks (Accepted)

❌ **Header/footer duplication:** Navigation changes require editing 7 HTML files
❌ **No TypeScript:** Pure JavaScript with JSDoc comments
❌ **No component reusability:** HTML structure duplicated across pages
❌ **Manual consistency:** CSS class names must be manually kept consistent

**Verdict:** For a portfolio website with infrequent navigation changes, the simplicity benefits massively outweigh the duplication cost.

### Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Markup** | HTML5 (semantic) | Accessibility, SEO, no templating needed |
| **Styling** | CSS3 (custom properties) | Native theming, no preprocessor complexity |
| **Scripting** | Vanilla JavaScript (ES6 modules) | Native browser support, no transpilation |
| **Icons** | DevIcons CDN | 2000+ tech icons, no local assets |
| **Hosting** | GitHub Pages | Free, fast, integrated with repo |
| **CI/CD** | GitHub Actions | Automatic deployment on push |

### File Structure

```
diogo-costa-silva.github.io/
├── assets/
│   ├── css/
│   │   ├── reset.css                 # Browser normalization
│   │   ├── variables.css             # Design tokens (265 lines)
│   │   ├── base.css                  # Typography, base styles
│   │   ├── layout.css                # Header, footer, grid systems
│   │   ├── components.css            # Reusable components
│   │   ├── utilities.css             # Helper classes
│   │   ├── animations.css            # Keyframes, transitions
│   │   └── pages/
│   │       ├── home.css              # Homepage-specific
│   │       ├── skills.css            # Skills page
│   │       ├── projects.css          # Projects page
│   │       ├── about.css             # About page
│   │       ├── contact.css           # Contact page
│   │       ├── resume.css            # Resume page
│   │       └── 404.css               # 404 error page
│   ├── js/
│   │   ├── main.js                   # Entry point, orchestrator
│   │   ├── color.js                  # Color theme system
│   │   ├── theme.js                  # Dark/light mode
│   │   ├── language.js               # PT/EN switcher
│   │   ├── navigation.js             # Header behavior
│   │   ├── footer.js                 # Footer setup
│   │   ├── animations.js             # Scroll observers
│   │   ├── back-to-top.js            # Back to top button
│   │   ├── modal.js                  # Modal system
│   │   ├── hero.js                   # Homepage hero (typewriter)
│   │   ├── projects.js               # Project filtering/display
│   │   ├── github-api.js             # GitHub integration
│   │   ├── skills.js                 # Skills rendering
│   │   ├── contact.js                # Contact form
│   │   └── testimonials.js           # Testimonials carousel
│   └── images/
├── data/
│   ├── skills.json                   # Skills database
│   ├── projects.json                 # Projects database
│   ├── tech-icons.json               # Technology icon mappings
│   └── translations.json             # PT/EN translations
├── index.html                        # Homepage
├── skills.html                       # Skills showcase
├── projects.html                     # Projects portfolio
├── about.html                        # About me
├── contact.html                      # Contact form
├── resume.html                       # CV/Resume
├── 404.html                          # Error page
├── README.md                         # Casual visitors
├── INFO.md                           # Technical documentation (this file)
└── CLAUDE.md                         # Development instructions for Claude Code

**Total:** 41 files (7 HTML, 15 JS, 14 CSS, 4 JSON, 1 workflow)
```

---

## Design System

### CSS Architecture

The design system is built entirely with **CSS custom properties** (CSS variables), enabling:
- Runtime theme switching (no CSS rebuilding)
- Consistent design tokens across the entire site
- Easy customization for future themes

### Variables Structure (`variables.css` - 265 lines)

#### 1. Color Palette

**Primary Colors (Blue Theme):**
```css
--primary-50: #e3f2fd;
--primary-100: #bbdefb;
/* ... 10 shades total ... */
--primary-900: #0d47a1;
```

**Additional Color Themes:**
- Red theme (`[data-color="red"]`)
- Green theme (`[data-color="green"]`)
- Orange theme (`[data-color="orange"]`)
- Yellow theme (`[data-color="yellow"]`)

Each theme overrides the `--primary-*` variables.

#### 2. Semantic Colors

```css
:root {
  --bg-primary: #ffffff;        /* Light mode */
  --bg-secondary: var(--gray-50);
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-700);
  --border-color: var(--gray-200);
  --link-color: var(--primary-600);
}

[data-theme="dark"] {
  --bg-primary: #121212;        /* Dark mode */
  --bg-secondary: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: var(--gray-300);
  --border-color: var(--gray-800);
  --link-color: var(--primary-400);
}
```

#### 3. Typography Scale

```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */
--text-7xl: 4.5rem;     /* 72px */
```

#### 4. Spacing Scale

```css
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 1rem;       /* 16px */
--space-lg: 1.5rem;     /* 24px */
--space-xl: 2rem;       /* 32px */
--space-2xl: 3rem;      /* 48px */
--space-3xl: 4rem;      /* 64px */
--space-4xl: 6rem;      /* 96px */
--space-5xl: 8rem;      /* 128px */
```

#### 5. Border Radius

```css
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 1rem;
--radius-xl: 1.5rem;
--radius-full: 50%;
```

#### 6. Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

Dark mode has stronger shadows:
```css
[data-theme="dark"] {
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
}
```

#### 7. Transitions

```css
--transition-fast: 150ms ease;
--transition-base: 300ms ease;
--transition-slow: 500ms ease;
--transition-card: transform var(--transition-base), box-shadow var(--transition-base);
```

### Responsive Breakpoints

```css
/* Mobile: 0-767px (base styles, no media query) */
/* Tablet: 768px-1023px */
@media (min-width: 768px) { ... }

/* Desktop: 1024px+ */
@media (min-width: 1024px) { ... }
```

Container padding adjusts per breakpoint:
- Mobile: `1.5rem`
- Tablet: `2.5rem`
- Desktop: `3rem`
- Large desktop (1440px+): `4rem`

---

## JavaScript Architecture

### Module System

The project uses **native ES6 modules** (`type="module"`), eliminating the need for bundlers.

#### Import/Export Example

```javascript
// language.js
export function getCurrentLanguage() { ... }
export function setLanguage(lang) { ... }

// main.js
import { getCurrentLanguage } from './language.js';
```

**Benefits:**
- Native browser support (no Babel/Webpack)
- Explicit dependencies
- Tree-shaking by browser
- Scoped variables (no global namespace pollution)

### Critical Initialization Order

**Order matters!** The initialization sequence in `main.js` is critical:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    initColor();        // ✅ MUST run first (establishes color system)
    initTheme();        // ✅ Dark/light mode
    initLanguage();     // ✅ Loads translations - MUST run before page-specific
    initHeader();       // Navigation setup
    initFooter();       // Footer setup
    initAnimations();   // Scroll observers
    initBackToTop();    // Back to top button
    initModals();       // Modal system

    // Page-specific initialization (depends on language being loaded)
    const currentPage = getCurrentPage();
    initPageSpecific(currentPage);
});
```

#### Why This Order?

1. **`initColor()` first:** Establishes `data-color` attribute on `<html>`, which CSS depends on
2. **`initTheme()` second:** Applies dark/light mode based on saved preference
3. **`initLanguage()` before page-specific:** Page modules need translations loaded
4. **Page-specific last:** May depend on language, theme, and color being set

**⚠️ Never change this order!** Breaking it will cause:
- Flash of unstyled content (FOUC)
- Translations not applying to dynamic content
- Theme flickering

### Event-Driven Communication

Modules communicate via **CustomEvents** (Pub/Sub pattern):

```javascript
// language.js - Publisher
function setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    loadTranslations(lang);

    // Notify all subscribers
    window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang }
    }));
}

// projects.js - Subscriber
export function initProjects() {
    loadTranslationsAndProjects();

    // Listen for language changes and re-render
    window.addEventListener('languageChanged', async () => {
        await loadTranslationsAndProjects();
    });
}
```

**Benefits:**
- Loose coupling between modules
- Easy to add new listeners
- No circular dependencies
- Clear event flow

### State Management

**LocalStorage Strategy:**

| Key | Purpose | Lifetime |
|-----|---------|----------|
| `theme` | Dark/light preference | Persistent |
| `language` | PT/EN preference | Persistent |
| `color` | Primary color theme | Persistent |
| `github_projects_cache` | GitHub API data | 1 hour |

**Example:**
```javascript
// Save
localStorage.setItem('theme', 'dark');

// Retrieve
const theme = localStorage.getItem('theme') || 'light';
```

---

## Data-Driven Content

### JSON Structure

All dynamic content lives in `data/*.json` files:

#### 1. Skills (`data/skills.json`)

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

**Fields:**
- `name`: Display name
- `icon`: DevIcon class (from CDN)
- `proficiency`: 0-100 (renders as progress bar)
- `years`: Experience duration
- `featured`: Show on homepage
- `category`: devops, frontend, backend, data-science, etc.

#### 2. Projects (`data/projects.json`)

```json
{
  "id": 1,
  "title": "MotoGP Analytics Dashboard",
  "category": "data-science",
  "description": "Interactive dashboard analyzing MotoGP race data...",
  "technologies": ["Python", "Jupyter", "Pandas", "Plotly"],
  "status": "completed",
  "difficulty": "intermediate",
  "featured": true,
  "github": "https://github.com/diogo-costa-silva/motogp-analytics",
  "demo": "#",
  "image": "https://images.unsplash.com/photo-...",
  "isReal": true
}
```

**Fields:**
- `id`: Unique identifier
- `title`: Project name
- `category`: data-science, web-dev, backend, devops, mobile
- `description`: Short description
- `technologies`: Array of tech names (mapped to DevIcons)
- `status`: completed, in-progress, planned
- `difficulty`: novice, beginner, intermediate, advanced, expert
- `featured`: Show on homepage
- `github`: Repository URL (or `#` if private)
- `demo`: Live demo URL (or `#` if none)
- `image`: Project thumbnail
- `isReal`: true = real project, false = portfolio demo project

#### 3. Tech Icons (`data/tech-icons.json`)

Maps technology names to DevIcon CSS classes:

```json
{
  "Python": "devicon-python-plain colored",
  "React": "devicon-react-original colored",
  "Docker": "devicon-docker-plain colored",
  "JavaScript": "devicon-javascript-plain colored"
}
```

**90+ mappings** covering most popular technologies.

#### 4. Translations (`data/translations.json`)

```json
{
  "en": {
    "nav.home": "Home",
    "nav.about": "About",
    "hero.greeting": "Hello, I'm"
  },
  "pt": {
    "nav.home": "Início",
    "nav.about": "Sobre",
    "hero.greeting": "Olá, sou"
  }
}
```

### i18n System

**How it works:**

1. HTML elements have `data-i18n` attributes:
```html
<a href="about.html" data-i18n="nav.about">About</a>
```

2. Language module fetches translations and applies them:
```javascript
function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}
```

3. Dynamic content (projects, skills) uses translation keys:
```javascript
const titleKey = `project.${project.id}.title`;
const projectTitle = translations[titleKey] || project.title;
```

**Special attributes:**
- `data-i18n`: Translates `textContent`
- `data-i18n-placeholder`: Translates `placeholder` attribute

---

## GitHub API Integration

### Architecture

The GitHub API integration enriches projects with real-time data:
- ⭐ Stars
- 👀 Watchers
- 🍴 Forks
- 🕐 Last commit date

### Caching Strategy

**1-hour localStorage cache** to minimize API requests:

```javascript
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

function getFromCache() {
    const cached = localStorage.getItem('github_projects_cache');
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
        return data;
    }

    return null; // Cache expired
}
```

**Why 1 hour?**
- GitHub API rate limit: 60 requests/hour (unauthenticated)
- Portfolio updates are infrequent
- Balances freshness vs. rate limiting

### Rate Limiting Handling

```javascript
async function fetchRepoData(githubUrl) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

    // Handle rate limiting
    if (response.status === 403 || response.status === 429) {
        console.warn('GitHub API rate limit reached');
        return { success: false, rateLimited: true };
    }

    // Handle 404 (private repo or doesn't exist)
    if (response.status === 404) {
        return { success: false };
    }

    const data = await response.json();
    return {
        stars: data.stargazers_count || 0,
        watchers: data.watchers_count || 0,
        forks: data.forks_count || 0,
        lastCommit: data.pushed_at ? new Date(data.pushed_at) : null,
        success: true
    };
}
```

### Parallel Fetching

**All GitHub requests happen in parallel** for performance:

```javascript
export async function enrichProjectsWithGitHubData(projects) {
    const projectsWithGitHub = projects.filter(p =>
        p.isReal && p.github && p.github !== '#'
    );

    // Fetch all repos in parallel
    const promises = projectsWithGitHub.map(async project => {
        const result = await fetchRepoData(project.github);
        return { ...project, ...result };
    });

    return await Promise.all(promises);
}
```

**Impact:**
- 6 repos × 500ms sequential = **3000ms**
- 6 repos in parallel = **~500ms**
- **6x speedup**

### Recent Projects Algorithm

Homepage shows **6 most recently updated projects** from GitHub:

```javascript
export async function getRecentProjects(projects, limit = 6) {
    // Try cache first
    const cached = getFromCache();
    if (cached) return cached.slice(0, limit);

    // Fetch fresh data
    const enriched = await enrichProjectsWithGitHubData(projects);

    // Filter only real projects with successful GitHub data
    const withGitHubData = enriched.filter(p =>
        p.isReal && p.lastCommitDate && p.githubDataSuccess
    );

    // Sort by last commit date (most recent first)
    const sorted = withGitHubData.sort((a, b) => {
        return new Date(b.lastCommitDate) - new Date(a.lastCommitDate);
    });

    const topProjects = sorted.slice(0, limit);
    saveToCache(topProjects);
    return topProjects;
}
```

**Fallback:** If API fails, shows featured projects instead.

---

## Advanced Features

### Multi-Filter System

The projects page implements an **advanced filtering system** with multi-select and AND logic.

#### Filter State

```javascript
const filterState = {
    categories: [],      // Multi-select categories
    statuses: [],        // Multi-select statuses
    technologies: [],    // Multi-select technologies
    realOnly: false,     // Toggle for real projects only
    searchTerm: ''       // Search input
};
```

#### Filter Logic (AND)

**All filters apply simultaneously:**

```javascript
function applyFilters() {
    projectCards.forEach(card => {
        const matchesCategory = filterState.categories.length === 0 ||
            filterState.categories.includes(card.dataset.category);

        const matchesStatus = filterState.statuses.length === 0 ||
            filterState.statuses.includes(card.dataset.status);

        const matchesTech = filterState.technologies.length === 0 ||
            filterState.technologies.some(tech =>
                card.dataset.technologies.split(',').includes(tech)
            );

        const matchesReal = !filterState.realOnly ||
            card.dataset.real === 'true';

        const matchesSearch = filterState.searchTerm === '' ||
            title.includes(filterState.searchTerm) ||
            description.includes(filterState.searchTerm);

        // Show only if ALL conditions match
        if (matchesCategory && matchesStatus && matchesTech &&
            matchesReal && matchesSearch) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
```

#### Dynamic Counts

Filter buttons show **live counts** that update as filters change:

```javascript
function updateAllCounts() {
    const visibleCards = document.querySelectorAll(
        '.project-card[style=""], .project-card:not([style*="display: none"])'
    );

    // Update category counts
    document.querySelectorAll('[data-filter]').forEach(btn => {
        const filter = btn.dataset.filter;
        const count = visibleCards.filter(card =>
            card.dataset.category === filter
        ).length;
        btn.querySelector('.filter-count').textContent = ` (${count})`;
    });
}
```

#### Filter Chips

Active filters appear as **removable chips**:

```javascript
function updateAppliedFilters() {
    const chips = [];

    filterState.categories.forEach(cat => {
        chips.push({ type: 'category', value: cat, label: cat });
    });

    filterState.technologies.forEach(tech => {
        chips.push({ type: 'technology', value: tech, label: tech });
    });

    if (filterState.realOnly) {
        chips.push({ type: 'realOnly', label: 'Real Projects Only' });
    }

    chipsContainer.innerHTML = chips.map(chip => `
        <div class="filter-chip">
            <span>${chip.label}</span>
            <button data-type="${chip.type}" data-value="${chip.value}">×</button>
        </div>
    `).join('');
}
```

### Technology Icon Mapping

**Dynamic icon rendering** based on technology name:

```javascript
// tech-icons.json
{
  "Python": "devicon-python-plain colored",
  "React": "devicon-react-original colored"
}

// projects.js
function getTechIcon(tech) {
    return techIconMap[tech] || 'devicon-devicon-plain';
}
```

Rendered in project cards:
```html
<i class="devicon-python-plain colored"></i> Python
```

---

## Performance & Optimization

### Lazy Loading

**Images lazy load** as they enter viewport:

```html
<img src="project.jpg" loading="lazy" alt="Project">
```

Browser-native, no JavaScript needed.

### Scroll Animations

**IntersectionObserver** for efficient scroll-triggered animations:

```javascript
export function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Stop observing
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}
```

**Why IntersectionObserver?**
- Native API, no libraries
- Performant (runs off main thread)
- Fire-and-forget (unobserve after animation)

### LocalStorage Persistence

**3 persistent preferences:**
```javascript
// Theme
localStorage.setItem('theme', 'dark');

// Language
localStorage.setItem('language', 'pt');

// Color
localStorage.setItem('color', 'blue');
```

**1 cached data:**
```javascript
// GitHub projects (1 hour TTL)
localStorage.setItem('github_projects_cache', JSON.stringify({
    data: projects,
    timestamp: Date.now()
}));
```

### Parallel API Requests

**Homepage optimization:**
```javascript
// BAD: Sequential loading
const translations = await fetch('data/translations.json');
const projects = await fetch('data/projects.json');
const skills = await fetch('data/skills.json');

// GOOD: Parallel loading
const [translations, projects, skills] = await Promise.all([
    fetch('data/translations.json'),
    fetch('data/projects.json'),
    fetch('data/skills.json')
]);
```

---

## Deployment Pipeline

### GitHub Actions Workflow

**File:** `.github/workflows/static.yml`

**Triggers:**
- Every push to `main` branch
- Manual dispatch via Actions tab

**Steps:**
1. **Checkout code** - `actions/checkout@v4`
2. **Setup Pages** - `actions/configure-pages@v4`
3. **Upload artifact** - Entire repo as static files
4. **Deploy to GitHub Pages** - `actions/deploy-pages@v4`

**Deployment time:** 30-60 seconds from push to live.

### Workflow File

```yaml
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Deployment Process

1. Developer pushes to `main`:
   ```bash
   git add .
   git commit -m "feat: add new project"
   git push origin main
   ```

2. GitHub Actions automatically triggers

3. Workflow uploads entire repo as artifact

4. GitHub Pages deploys artifact

5. Site is live in 30-60 seconds

**No build step = No build failures!**

---

## Development Guidelines

### Git Workflow

**Branch:** All work happens on `main` (single-branch strategy)

**Commit Convention:**
```
type: description

Examples:
feat: add dark mode toggle
fix: correct mobile navigation overlap
refactor: simplify filter logic
docs: update README with new features
style: improve button hover states
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring (no behavior change)
- `docs`: Documentation changes
- `style`: CSS/visual changes
- `chore`: Maintenance tasks

### Testing Checklist

Before pushing:

- [ ] **Browsers:** Test in Chrome, Firefox, Safari
- [ ] **Mobile:** Test responsive design (DevTools mobile view)
- [ ] **Theme:** Toggle dark/light mode, verify no flashes
- [ ] **Language:** Switch PT/EN, verify all text updates
- [ ] **Filters:** Test all filter combinations on projects page
- [ ] **Console:** No JavaScript errors in browser console
- [ ] **Links:** All navigation links work
- [ ] **Images:** All images load (check relative paths)
- [ ] **Performance:** Lighthouse score > 90

### Common Pitfalls

#### 1. Initialization Order

**❌ WRONG:**
```javascript
initHeader();
initLanguage();  // Too late! Header text won't translate
```

**✅ CORRECT:**
```javascript
initLanguage();  // Load translations first
initHeader();    // Then render header with translations
```

#### 2. Absolute Paths

**❌ WRONG:**
```html
<link rel="stylesheet" href="/assets/css/main.css">
```

**✅ CORRECT:**
```html
<link rel="stylesheet" href="assets/css/main.css">
```

**Why:** GitHub Pages may deploy to subdirectory, breaking absolute paths.

#### 3. JSON Syntax

**❌ WRONG:**
```json
{
  "title": "Project",
  "tags": ["Python", "Docker"],  // ← Trailing comma breaks JSON!
}
```

**✅ CORRECT:**
```json
{
  "title": "Project",
  "tags": ["Python", "Docker"]
}
```

#### 4. Missing Translation Keys

**❌ WRONG:**
```javascript
const title = translations[`project.${project.id}.title`];
// Breaks if key doesn't exist
```

**✅ CORRECT:**
```javascript
const title = translations[`project.${project.id}.title`] || project.title;
// Fallback to default
```

### Navigation Changes

**Changing navigation requires updating 7 files:**
1. `index.html`
2. `skills.html`
3. `projects.html`
4. `about.html`
5. `contact.html`
6. `resume.html`
7. `404.html`

**Search & replace recommended:**
```bash
# Find navigation in all HTML files
grep -n "nav__list" *.html

# Use editor's find-and-replace across files
```

---

## Project Statistics

### File Count Breakdown

| Type | Count | Purpose |
|------|-------|---------|
| **HTML** | 7 | Pages (index, skills, projects, about, contact, resume, 404) |
| **JavaScript** | 15 | Modules (main, theme, language, projects, etc.) |
| **CSS** | 14 | Styles (reset, variables, base, layout, components, utilities, animations, 7 page-specific) |
| **JSON** | 4 | Data (skills, projects, tech-icons, translations) |
| **Workflow** | 1 | GitHub Actions deployment |
| **Documentation** | 3 | README, INFO, CLAUDE |
| **Total** | **41** | Excluding images |

### Lines of Code (Approximate)

| Category | Lines | Notes |
|----------|-------|-------|
| **CSS** | ~3,500 | Includes 265 lines in `variables.css` |
| **JavaScript** | ~2,500 | Largest file: `projects.js` (~850 lines) |
| **HTML** | ~1,400 | ~200 lines per page × 7 pages |
| **JSON** | ~800 | Projects data is largest |
| **Total** | **~8,200** | Excluding comments and blank lines |

### Module Dependencies

```
main.js
├── color.js (standalone)
├── theme.js (standalone)
├── language.js (standalone)
│   └── translations.json
├── navigation.js (standalone)
├── footer.js (standalone)
├── animations.js (standalone)
├── back-to-top.js (standalone)
├── modal.js (standalone)
├── hero.js (depends on language)
├── projects.js (depends on language, github-api)
│   ├── github-api.js
│   ├── projects.json
│   └── tech-icons.json
├── skills.js (depends on language)
│   └── skills.json
├── contact.js (depends on language)
└── testimonials.js (depends on language)
```

**Key insight:** Most modules are standalone, only page-specific modules depend on `language.js`.

### Browser Support

**Minimum browser versions:**
- Chrome/Edge: 89+ (ES6 modules, custom properties)
- Firefox: 89+
- Safari: 14+
- Mobile Safari: iOS 14+
- Chrome Mobile: 89+

**Features used:**
- ES6 modules (`import/export`)
- CSS custom properties (variables)
- `fetch` API
- `localStorage`
- `IntersectionObserver`
- `CustomEvent`
- Async/await

**Progressive enhancement:**
- Works without JavaScript (HTML/CSS only)
- Works offline (cached in browser)
- Lazy loading is native (`loading="lazy"`)

---

## Conclusion

This portfolio demonstrates that **modern web development doesn't require complex tooling**. By embracing browser-native features (ES6 modules, CSS custom properties, IntersectionObserver), we achieve:

✅ **Zero build process**
✅ **Zero dependencies**
✅ **Instant deployment**
✅ **Maximum simplicity**
✅ **Professional features** (dark mode, i18n, dynamic filtering, GitHub integration)

The trade-off (HTML duplication) is **minimal** for a portfolio site with infrequent navigation changes, while the **benefits are massive** for maintainability and developer experience.

---

**For casual visitors:** See [README.md](README.md)
**For Claude Code:** See [CLAUDE.md](CLAUDE.md)
**For questions:** Open an issue on GitHub
