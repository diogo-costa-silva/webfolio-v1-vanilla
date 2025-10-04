# Website Architecture Documentation

**Last Updated:** 2025-01-04
**Project:** Personal Portfolio Website v3
**Author:** Diogo Silva
**Deploy Target:** https://dipedilans.github.io

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Architectural Decision: Template System](#architectural-decision-template-system)
3. [Project Structure](#project-structure)
4. [CSS Architecture](#css-architecture)
5. [JavaScript Architecture](#javascript-architecture)
6. [Data Flow](#data-flow)
7. [Responsive Design Strategy](#responsive-design-strategy)
8. [Component Guidelines](#component-guidelines)
9. [Performance Strategy](#performance-strategy)
10. [Future Scalability](#future-scalability)

---

## Executive Summary

This document defines the complete architecture for the personal portfolio website. The primary goals are:

- ✅ **Maximum Simplicity** - Pure HTML, no build process
- ✅ **Maintainability** - Easy to update JSON data files (skills/projects)
- ✅ **Performance** - Fast loading, optimized assets
- ✅ **SEO** - Perfect crawlability and indexing
- ✅ **No Frameworks** - Vanilla JavaScript only
- ✅ **Accessibility** - WCAG 2.1 AA compliance

### Key Principles
1. **Mobile-First** - Design and code for mobile, enhance for desktop
2. **Progressive Enhancement** - Core functionality works without JavaScript
3. **Semantic HTML** - Proper use of HTML5 elements
4. **CSS Variables** - Centralized design system
5. **Modular JavaScript** - ES6 modules with clear responsibilities

---

## Architectural Decision: Template System

### The Problem

**Current State:**
- Header: ~94 lines duplicated across 7 pages = ~658 lines
- Footer: ~50 lines duplicated across 7 pages = ~350 lines
- **Total: ~1000 lines of duplicated code**

**Analysis:**
- 🟡 Changing navigation link = editing 7 files
- 🟡 Risk of inconsistencies between pages
- ✅ However: Header/footer rarely change (< 1% of updates)
- ✅ **99% of updates:** Adding skills/projects via JSON files

### Options Evaluated

#### Option 1: Web Components (Vanilla JS)
```html
<header-component></header-component>
```
**Verdict:** ❌ Rejected
- Requires JavaScript to render
- FOUC (Flash of Unstyled Content)
- SEO concerns (crawlers may not execute JS)
- Fails progressive enhancement principle

#### Option 2: Build Script (Node.js sync)
```javascript
// sync-templates.js - injects templates into HTML files
```
**Verdict:** ❌ Rejected
- Not industry standard (custom solution)
- Adds complexity for minimal benefit
- Developer must remember to run script

#### Option 3: Jekyll (Static Site Generator)
```liquid
{% include header.html %}
{{ content %}
{% include footer.html %}
```
**Verdict:** ❌ **REJECTED**

**Why NOT Jekyll:**
1. ❌ **Unnecessary complexity** - User won't modify HTML frequently
2. ❌ **Learning curve** - Liquid syntax for rare edits
3. ❌ **Local testing requires** `bundle exec jekyll serve`
4. ❌ **Overkill** - 7 pages, stable layout
5. ⚠️ **Build errors** can break deployment

#### Option 4: HTML Puro + JSON for Dynamic Content
```javascript
// data/skills.json - Update frequently
// data/projects.json - Update frequently
// *.html - Update rarely
```
**Verdict:** ✅ **SELECTED**

**Why HTML puro wins:**
1. ✅ **Zero learning curve** - Plain HTML
2. ✅ **Direct deployment** - git push → live (no build)
3. ✅ **99% of edits** are JSON files (skills/projects)
4. ✅ **Header/footer edits** are rare (acceptable duplication)
5. ✅ **Maximum simplicity** - What you see is what you deploy
6. ✅ **Live Server works** - No need for Jekyll server
7. ✅ **No build failures** - HTML can't fail to build

### Final Decision

**Use pure HTML with JSON files for dynamic content. Accept header/footer duplication as acceptable trade-off for simplicity.**

**Separation of Concerns:**
- **HTML** - Page structure (edit rarely)
- **JSON** - Dynamic data: skills, projects, translations (edit frequently)
- **Vanilla JavaScript** - Loads JSON and renders content dynamically
- **CSS** - Styling with CSS variables

**Why this works:**
- Adding skill = edit `data/skills.json` (1 file)
- Adding project = edit `data/projects.json` (1 file)
- Changing nav link = edit 7 HTML files (once per year)

**Trade-off accepted:** 1000 lines of duplicated HTML for maximum simplicity and zero build complexity.

---

## Project Structure

### Directory Tree
```
website-v3/
├── assets/                      # Static assets
│   ├── css/
│   │   ├── reset.css           # CSS reset
│   │   ├── variables.css       # Design system (colors, spacing, etc.)
│   │   ├── base.css            # Base typography and elements
│   │   ├── layout.css          # Header, footer, grid, containers
│   │   ├── components.css      # Buttons, cards, forms
│   │   ├── utilities.css       # Utility classes
│   │   ├── animations.css      # Transitions and animations
│   │   └── pages/              # Page-specific styles
│   │       ├── home.css
│   │       ├── skills.css
│   │       ├── projects.css
│   │       ├── about.css
│   │       ├── contact.css
│   │       ├── resume.css
│   │       └── 404.css
│   ├── js/
│   │   ├── main.js             # Entry point, initializes modules
│   │   ├── navigation.js       # Header scroll, mobile menu
│   │   ├── theme.js            # Dark/light mode toggle
│   │   ├── language.js         # PT/EN switcher
│   │   ├── animations.js       # Scroll animations (Intersection Observer)
│   │   ├── hero.js             # Typewriter effects
│   │   ├── projects.js         # Project filtering/search
│   │   ├── skills.js           # Skills display
│   │   ├── contact.js          # Form validation, EmailJS
│   │   └── testimonials.js     # Carousel functionality
│   ├── images/
│   │   ├── favicon.svg         # Favicon (SVG)
│   │   ├── favicon-32x32.png
│   │   ├── favicon-16x16.png
│   │   ├── apple-touch-icon.png
│   │   ├── profile.png         # Profile photo
│   │   └── projects/           # Project images
│   └── docs/
│       └── cv.pdf              # Resume PDF
├── data/                        # Application data (JSON) ← Edit these frequently!
│   ├── projects.json           # Projects data
│   ├── skills.json             # Skills and proficiency levels
│   └── translations.json       # i18n strings
├── index.html                   # Homepage
├── skills.html                  # Skills page
├── projects.html                # Projects page
├── about.html                   # About page
├── contact.html                 # Contact page
├── resume.html                  # Resume/CV page
├── 404.html                     # Error page
├── sitemap.xml                  # SEO sitemap (manual)
├── robots.txt                   # Search engine directives
├── CNAME                        # Custom domain (future)
├── README.md                    # Project README
├── ARCHITECTURE.md              # This file
├── CLAUDE.md                    # AI assistant guidelines
├── PRD.md                       # Product requirements
├── DEPLOYMENT.md                # Deployment guide
└── WEBSITE_AUDIT_2025.md        # Audit findings and fixes

```

### File Naming Conventions
- **HTML files:** `lowercase-with-hyphens.html`
- **CSS files:** `lowercase.css` or `page-name.css`
- **JS files:** `lowercase.js` (module name)
- **Images:** `descriptive-name.ext` (lowercase, hyphens)
- **Data files:** `name.json` (lowercase)

---

## CSS Architecture

### Design System Philosophy
**Single Source of Truth:** All design tokens defined in `variables.css`

### CSS Custom Properties Structure

#### 1. Colors
```css
:root {
    /* Primary palette (Blue theme) */
    --primary-50: #e3f2fd;
    --primary-500: #2196f3;  /* Main brand color */
    --primary-900: #0d47a1;

    /* Semantic colors (Light theme) */
    --bg-primary: #ffffff;
    --text-primary: var(--gray-900);
    --link-color: var(--primary-600);
}

[data-theme="dark"] {
    /* Dark theme overrides */
    --bg-primary: #121212;
    --text-primary: #ffffff;
}
```

#### 2. Typography
```css
:root {
    --font-primary: 'Inter', sans-serif;
    --font-mono: 'Fira Code', monospace;

    --text-xs: 0.75rem;    /* 12px */
    --text-base: 1rem;     /* 16px */
    --text-5xl: 3rem;      /* 48px */
}
```

#### 3. Spacing Scale
```css
:root {
    --space-xs: 0.25rem;   /* 4px */
    --space-sm: 0.5rem;    /* 8px */
    --space-md: 1rem;      /* 16px */
    --space-xl: 2rem;      /* 32px */
    --space-3xl: 4rem;     /* 64px */
}
```

#### 4. Component Tokens
```css
:root {
    --header-height: 64px;
    --container-max: 1200px;
    --radius-md: 0.5rem;
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition-base: 300ms ease;
}
```

### CSS File Loading Order (Critical!)
```html
<!-- Order matters for specificity -->
<link rel="stylesheet" href="assets/css/reset.css">       <!-- 1. Reset browser defaults -->
<link rel="stylesheet" href="assets/css/variables.css">   <!-- 2. Design system -->
<link rel="stylesheet" href="assets/css/base.css">        <!-- 3. Base elements -->
<link rel="stylesheet" href="assets/css/layout.css">      <!-- 4. Layout (header/footer/grid) -->
<link rel="stylesheet" href="assets/css/components.css">  <!-- 5. Reusable components -->
<link rel="stylesheet" href="assets/css/utilities.css">   <!-- 6. Utilities -->
<link rel="stylesheet" href="assets/css/animations.css">  <!-- 7. Animations -->
<link rel="stylesheet" href="assets/css/pages/X.css">     <!-- 8. Page-specific -->
```

### Naming Convention: BEM-like
```css
/* Block */
.card { }

/* Element (descendant) */
.card__title { }
.card__description { }

/* Modifier (variation) */
.card--featured { }
.card--large { }

/* State */
.card.is-active { }
.header.is-hidden { }
```

### Mobile-First Media Queries
```css
/* Base styles = Mobile (320px+) */
.element {
    font-size: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
    .element {
        font-size: 1.125rem;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .element {
        font-size: 1.25rem;
    }
}
```

**Standard Breakpoints:**
- Mobile: `0-767px` (base, no media query)
- Tablet: `768px-1023px` (`@media (min-width: 768px)`)
- Desktop: `1024px+` (`@media (min-width: 1024px)`)
- Large: `1440px+` (`@media (min-width: 1440px)`)

---

## JavaScript Architecture

### Module System: ES6 Modules

**Entry Point:** `assets/js/main.js`

```javascript
// main.js - Initializes all modules
import { initHeader } from './navigation.js';
import { initTheme } from './theme.js';
import { initLanguage } from './language.js';
// ... other imports

document.addEventListener('DOMContentLoaded', () => {
    initTheme();      // Must run first (reads localStorage)
    initLanguage();   // Applies translations
    initHeader();     // Sets up navigation
    // ... page-specific inits
});
```

### Module Responsibilities

#### `navigation.js`
- Header show/hide on scroll
- Progress bar update
- Mobile menu toggle
- Smooth scroll for anchor links
- Active link highlighting

#### `theme.js`
- Dark/light mode toggle
- System preference detection
- localStorage persistence
- Smooth theme transitions

#### `language.js`
- PT/EN language switching
- Loads `data/translations.json`
- Updates DOM with `data-i18n` attributes
- localStorage persistence

#### `animations.js`
- Intersection Observer setup
- Scroll-triggered animations
- Fade-in, slide-up effects

#### `hero.js`
- Typewriter effect for greetings
- Dynamic tagline rotation

#### `projects.js`
- Loads `data/projects.json`
- Category filtering
- Search functionality
- Renders project cards dynamically

#### `skills.js`
- Loads `data/skills.json`
- Renders skill categories
- Progress bar animations

#### `contact.js`
- Form validation
- EmailJS integration
- Success/error feedback

#### `testimonials.js`
- Carousel navigation
- Auto-rotation
- Touch/swipe support

### JavaScript Best Practices

**1. Defensive Programming**
```javascript
export function initHeader() {
    const header = document.getElementById('header');
    if (!header) {
        console.error('[Navigation] Header not found');
        return; // Fail gracefully
    }
    // ... proceed
}
```

**2. Event Listener Cleanup**
```javascript
// Always store references for cleanup
const handleResize = () => { /* ... */ };
window.addEventListener('resize', handleResize);

// Cleanup when needed
window.removeEventListener('resize', handleResize);
```

**3. Debounce/Throttle for Performance**
```javascript
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Execute after scrolling stops
    }, 100);
}, { passive: true }); // passive flag for better perf
```

**4. No Production Console Logs**
```javascript
// Development
console.log('[Debug] Value:', value);  // ❌ Remove before production

// Production (errors only)
console.error('[Module] Critical error:', error);  // ✅ Keep
```

---

## Data Flow

### JSON Data Sources

**Location:** `/data/` directory

#### 1. `projects.json`
```json
{
    "projects": [
        {
            "id": "motogp-analytics",
            "title": "MotoGP Analytics Dashboard",
            "category": "Data Science",
            "status": "REAL",
            "difficulty": 3,
            "featured": true,
            "description": "...",
            "technologies": ["Python", "Pandas", "Jupyter"],
            "github": "https://github.com/...",
            "demo": null
        }
    ]
}
```

#### 2. `skills.json`
```json
{
    "categories": [
        {
            "id": "languages",
            "icon": "💻",
            "title": "Languages & Core",
            "skills": [
                {
                    "name": "Python",
                    "icon": "devicon-python-plain",
                    "proficiency": 90,
                    "years": "6+",
                    "featured": true
                }
            ]
        }
    ]
}
```

#### 3. `translations.json`
```json
{
    "en": {
        "nav.home": "Home",
        "nav.about": "About",
        "hero.greeting": "Hello"
    },
    "pt": {
        "nav.home": "Início",
        "nav.about": "Sobre",
        "hero.greeting": "Olá"
    }
}
```

### Data Loading Pattern
```javascript
// Async load with fallback
async function loadData(url, fallback = []) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`[Data] Failed to load ${url}:`, error);
        return fallback; // Always have inline fallback
    }
}
```

---

## Responsive Design Strategy

### Mobile-First Approach

**Philosophy:** Design for mobile first, enhance for larger screens.

**Base (Mobile: 0-767px):**
- Single column layouts
- Hamburger menu
- Touch-friendly targets (min 44×44px)
- Simplified navigation
- Stacked components

**Tablet (768px-1023px):**
- 2-column layouts where appropriate
- Still use hamburger menu (easier UX)
- Slightly larger typography
- More whitespace

**Desktop (1024px+):**
- Horizontal navigation
- Multi-column layouts (2-3 columns)
- Hover states
- Larger imagery
- Side-by-side components

**Large Desktop (1440px+):**
- Max-width containers (1200px)
- Increased spacing
- Larger hero sections

### Critical Breakpoints
```css
/* Mobile-first base */
.grid { display: block; }

/* Tablet */
@media (min-width: 768px) {
    .grid { display: grid; grid-template-columns: 1fr 1fr; }
}

/* Desktop */
@media (min-width: 1024px) {
    .grid { grid-template-columns: 1fr 1fr 1fr; }
}
```

### Header Navigation Strategy

**Mobile (<1024px):**
- Desktop nav hidden (`display: none`)
- Mobile menu toggle visible (`display: flex`)
- `.nav--mobile` available (slide-down)

**Desktop (≥1024px):**
- Desktop nav visible (`display: flex`)
- Mobile toggle hidden (`display: none`)
- `.nav--mobile` disabled (`display: none`)

---

## Component Guidelines

### Header Component (duplicated in each HTML file)

**Structure:**
```html
<div class="progress-bar" id="progressBar"></div>

<header id="header" class="header">
    <div class="header__container">
        <a href="/" class="header__logo">DS</a>

        <!-- Desktop Nav (hidden on mobile) -->
        <nav class="nav">
            <ul class="nav__list">
                <li><a href="index.html" class="nav__link nav__link--active">Home</a></li>
                <li><a href="skills.html" class="nav__link">Skills</a></li>
                <li><a href="projects.html" class="nav__link">Projects</a></li>
                <!-- etc. -->
            </ul>
        </nav>

        <!-- Controls (language, theme, mobile toggle) -->
        <div class="header__controls">
            <button id="languageToggle">...</button>
            <button id="themeToggle">...</button>
            <button id="mobileMenuToggle" class="mobile-menu-toggle">...</button>
        </div>
    </div>

    <!-- Mobile Nav (shown on toggle click) -->
    <nav class="nav--mobile" id="mobileNav">
        <ul class="nav__list">
            <!-- Same links as desktop -->
        </ul>
    </nav>
</header>
```

**Active Link Logic:**
- Manually set in each HTML file with `nav__link--active` class
- Each page has its own active link
- No JavaScript needed for active states

### Footer Component (duplicated in each HTML file)

**Structure:**
```html
<footer class="footer">
    <div class="footer__container">
        <div class="footer__content">
            <!-- 3 columns: Brand, Quick Links, Connect -->
        </div>
        <div class="footer__bottom">
            <p>&copy; <span id="currentYear"></span> Diogo Silva.</p>
        </div>
    </div>
</footer>
```

**JavaScript:** Only for current year update (`main.js` sets `#currentYear`)

---

## Performance Strategy

### 1. Critical CSS
- Inline critical CSS for above-the-fold content (future optimization)
- Load non-critical CSS asynchronously

### 2. Image Optimization
```html
<!-- Lazy loading for below-the-fold images -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- Responsive images -->
<img srcset="image-400w.jpg 400w, image-800w.jpg 800w"
     sizes="(max-width: 768px) 100vw, 50vw"
     src="image-800w.jpg" alt="...">
```

### 3. Font Loading
```css
@font-face {
    font-family: 'Inter';
    font-display: swap; /* Prevent FOIT */
    src: url('...');
}
```

### 4. JavaScript Loading
```html
<!-- Main script as module (deferred by default) -->
<script src="assets/js/main.js" type="module"></script>
```

### 5. Asset Caching
```
# Future: .htaccess or _headers for Netlify
Cache-Control: max-age=31536000 for assets/css/* and assets/js/*
```

---

## Future Scalability

### Adding a New Page

**Step 1:** Duplicate an existing HTML file (e.g., `about.html`)
```bash
cp about.html newpage.html
```

**Step 2:** Update page-specific content
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Page Title - Diogo Silva</title>
    <!-- Copy all meta tags, CSS links from other pages -->
</head>
<body>
    <!-- Header (copy from any page, update active link) -->
    <header>
        <nav>
            <ul>
                <li><a href="newpage.html" class="nav__link--active">New Page</a></li>
            </ul>
        </nav>
    </header>

    <!-- Your new page content -->
    <main>
        <section class="page-hero">
            <h1>New Page Title</h1>
        </section>
    </main>

    <!-- Footer (copy from any page) -->
    <footer>...</footer>
</body>
</html>
```

**Step 3:** Add navigation link to ALL 7 existing HTML files
- Edit: `index.html`, `skills.html`, `projects.html`, `about.html`, `contact.html`, `resume.html`, `404.html`
- Add: `<li><a href="newpage.html" class="nav__link">New Page</a></li>`

**Step 4:** Add translations (`data/translations.json`)
```json
{
    "en": { "nav.newpage": "New Page" },
    "pt": { "nav.newpage": "Nova Página" }
}
```

**Step 5:** Create page-specific CSS if needed
```
assets/css/pages/newpage.css
```

**Note:** Yes, this requires editing 7 files for header/footer. This is the trade-off for maximum simplicity.

### Migration to Custom Domain
1. Add `CNAME` file with domain name
2. Configure DNS (A records to GitHub IPs)
3. Enable HTTPS in GitHub Pages settings
4. Update `_config.yml` with new `url`

### Migration to `diogo-costa-silva` Account
**Option 1:** GitHub repo transfer (recommended)
- Settings → Transfer ownership
- Maintains history, stars, issues

**Option 2:** Push to new remote
```bash
git remote set-url origin git@github.com:diogo-costa-silva/website.git
git push -u origin main
```

---

## Conclusion

This architecture prioritizes **maximum simplicity** over DRY principles:

✅ **Pure HTML** - No build process, no SSG, no frameworks
✅ **Vanilla JavaScript** handles interactivity (run-time)
✅ **CSS Variables** provide design system
✅ **JSON files** store frequently-edited data (skills/projects)
✅ **Mobile-first** CSS ensures responsive design
✅ **ES6 Modules** keep JavaScript organized

**Trade-off Accepted:**
- ~1000 lines of duplicated HTML (header/footer across 7 pages)
- Adding nav link = edit 7 files
- **Why it's OK:** 99% of updates are to `data/skills.json` and `data/projects.json` (1 file each)

**Result:** A fast, SEO-friendly website that anyone can edit with zero learning curve.

---

**Next Steps:** Follow `DEPLOYMENT.md` for publishing to GitHub Pages.
