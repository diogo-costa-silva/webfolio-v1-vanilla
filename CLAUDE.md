# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Rules

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.

2. The plan should have a list of todo items that you can check off as you complete them

3. Before you begin working, check in with me and I will verify the plan.

4. Then, begin working on the todo items, marking them as complete as you go.

5. Please every step of the way just give me a high level explanation of what changes you made

6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.

7. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.

8. All resulting products (code, documentation, comments, variable names, etc.) must be written in English.

## Design Philosophy & Guidelines

### Visual Hierarchy Principles
- **Equal importance:** All projects and skills have equal visual weight - no artificial hierarchies
- **Uniform grids:** Consistent card sizes, spacing, and styling across all content
- **Let content speak:** Quality of work > visual tricks
- **No featured items:** Avoid creating visual distinctions that don't add value

### UX Priorities (in order)
1. **Search functionality** must be fast, intuitive, and accurate
2. **Filters** must work perfectly (alone or combined with search)
3. **Mobile-first** responsive design (test on real devices)
4. **Accessibility** (keyboard nav, ARIA labels, color contrast)
5. **Performance** (lazy loading, minimal JS, optimized assets)

### Code Principles
- **Reuse existing utilities** (`.gap-xl`, `.grid`, etc.) - don't create new CSS variables unless absolutely necessary
- **Keep JavaScript simple** and readable - avoid over-engineering
- **Progressive enhancement** - site must work without JavaScript
- **BEM naming** for CSS classes
- **Consistent spacing** using `var(--space-*)` tokens

### Color System
- **Primary blue:** `--primary-600` (#1e88e5)
- **Maintain light/dark mode** consistency
- **Semantic colors** for states (`--success`, `--warning`, `--error`)
- **Never use `!important`** - use specificity correctly

---

## Project Overview

Pure HTML/CSS/JavaScript portfolio website with **no build process, no frameworks, no SSG**. Content is data-driven through JSON files. Deployed via GitHub Actions to GitHub Pages.

**Live Site:** https://dipedilans.github.io

## Development Commands

### Local Development
```bash
# Use VS Code Live Server extension
# Visit http://127.0.0.1:5500/
```

**No build process. No npm install. No bundling.**

### Deployment
```bash
# Always set correct git identity first
gset-dd

# Verify identity
git config user.name   # Should show: Dipe Dilans
git config user.email  # Should show: 157709256+dipedilans@users.noreply.github.com

# Deploy
git add .
git commit -m "feat: description"
git push origin main

# GitHub Actions automatically deploys to https://dipedilans.github.io
# Monitor deployment:
gh run list --repo dipedilans/dipedilans.github.io --limit 5
```

**Commit message types:** `feat:`, `fix:`, `docs:`, `style:`, `perf:`, `chore:`, `ci:`

## Architecture

### Core Design Philosophy

**Trade-off:** ~1000 lines of duplicated HTML (header/footer across 7 pages) for zero build complexity.

**Why no SSG?** 99% of updates edit JSON files (skills, projects, translations). The 1% case (nav changes) doesn't justify build complexity.

### Module System

**Initialization order is critical** (see `assets/js/main.js`):

1. `initTheme()` - Must run first (loads dark/light mode from localStorage)
2. `initLanguage()` - Loads translations and applies to DOM
3. `initHeader()` - Sets up navigation
4. `initFooter()` - Sets up footer year
5. `initAnimations()` - Intersection Observer for scroll effects
6. Page-specific inits (hero, skills, projects, contact, testimonials)

**Module responsibilities:**
- `navigation.js` - Smart header (hides on scroll down, shows on scroll up), mobile menu, progress bar
- `theme.js` - Dark/light toggle, localStorage persistence
- `language.js` - PT/EN switcher, fetches/applies `data/translations.json`
- `skills.js` - Fetches `data/skills.json`, renders skill cards with categories
- `projects.js` - Fetches `data/projects.json`, filtering, search
- `contact.js` - Form validation, EmailJS integration
- `animations.js` - Scroll-triggered animations via Intersection Observer

### Data Files (Edit These for Content)

**Most common updates happen here:**

- `data/skills.json` - Skills organized by categories (languages-core, data-science, big-data, cloud-infrastructure, devops, backend-apis)
- `data/projects.json` - Projects with status (REAL/FICTITIOUS), difficulty (1-5), featured flag
- `data/translations.json` - All UI text in PT and EN (navigation keys like `nav.home`, page content, etc.)

**Skill schema:**
```json
{
  "name": "Python",
  "level": 5,              // 1-5 scale
  "levelLabel": "Expert",  // Beginner/Intermediate/Advanced/Expert
  "experience": "6+ years",
  "featured": true         // Show on homepage
}
```

**Project schema:**
```json
{
  "id": "unique-id",
  "title": "Project Name",
  "category": "Web Development",  // For filtering
  "status": "REAL",               // REAL or FICTITIOUS
  "difficulty": 3,                // 1-5 stars
  "featured": true,               // Show on homepage
  "description": "...",
  "technologies": ["React", "Node.js"],
  "github": "https://github.com/...",
  "demo": "https://...",
  "image": "https://..."
}
```

### CSS Architecture

**Design system in `assets/css/variables.css`:**
- CSS custom properties for colors (light/dark themes)
- Spacing scale (`--space-xs` to `--space-3xl`)
- Typography (Inter + Fira Code)
- Breakpoints: Mobile (0-767px), Tablet (768-1023px), Desktop (1024px+)

**CSS organization:**
- `reset.css` - Browser normalization
- `base.css` - Base typography, global styles
- `variables.css` - Design tokens
- `layout.css` - Header, footer, grid
- `components.css` - Reusable components (buttons, cards)
- `utilities.css` - Utility classes
- `animations.css` - Keyframes, transitions
- `pages/*.css` - Page-specific styles

**BEM naming convention used throughout.**

### Responsive Behavior

**Mobile (<1024px):**
- Hamburger menu (☰)
- Full-screen overlay navigation
- Stacked layouts

**Desktop (≥1024px):**
- Horizontal navigation
- Hover effects
- Multi-column layouts

**Smart header behavior:**
- Hides on scroll down (adds `header-hidden` class)
- Shows on scroll up
- Progress bar shows page scroll position

## Common Tasks

### Adding a New Skill

Edit `data/skills.json` in the appropriate category:
```json
{
  "name": "Docker",
  "level": 4,
  "levelLabel": "Advanced",
  "experience": "4+ years",
  "featured": true
}
```

### Adding a New Project

Edit `data/projects.json`:
```json
{
  "id": "my-project",
  "title": "My Project",
  "category": "Data Engineering",
  "status": "REAL",
  "difficulty": 4,
  "featured": true,
  "description": "Description in English",
  "technologies": ["Python", "Spark", "Azure"],
  "github": "https://github.com/username/repo",
  "demo": null,
  "image": "https://via.placeholder.com/400x300"
}
```

### Updating Text/Translations

Edit `data/translations.json`:
```json
{
  "en": {
    "nav.home": "Home",
    "hero.greeting": "Hello"
  },
  "pt": {
    "nav.home": "Início",
    "hero.greeting": "Olá"
  }
}
```

### Changing Navigation (Rare)

**This requires editing all 7 HTML files:** `index.html`, `about.html`, `skills.html`, `projects.html`, `resume.html`, `contact.html`, `404.html`

Search for `<nav class="nav-links">` and update consistently across all files.

### Updating CV/Resume

Replace `assets/docs/cv.pdf` with new PDF file (keep same filename).

## GitHub Pages Deployment

**GitHub Actions workflow:** `.github/workflows/static.yml`

**Process:**
1. Push to `main` branch triggers workflow
2. Checkout code → Setup Pages → Upload artifact → Deploy
3. Site live at https://dipedilans.github.io (30-60 seconds)

**View deployment status:**
```bash
gh run list --repo dipedilans/dipedilans.github.io
gh run view <run-id> --repo dipedilans/dipedilans.github.io
```

**Note:** `.nojekyll` file disables Jekyll processing (GitHub Pages default). We serve pure HTML.

## File Structure

```
website-v3/
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design system
│   │   ├── layout.css         # Header/footer
│   │   ├── components.css     # Reusable UI
│   │   ├── pages/*.css        # Page-specific
│   ├── js/
│   │   ├── main.js            # Entry point
│   │   ├── navigation.js      # Header logic
│   │   ├── theme.js           # Dark/light mode
│   │   ├── language.js        # PT/EN switcher
│   │   ├── skills.js          # Skills rendering
│   │   └── projects.js        # Projects filtering
│   ├── images/
│   │   ├── favicon.svg
│   │   └── profile.png
│   └── docs/
│       └── cv.pdf
├── data/
│   ├── skills.json            # ⭐ Edit for skills
│   ├── projects.json          # ⭐ Edit for projects
│   └── translations.json      # ⭐ Edit for text
├── index.html                 # Homepage
├── skills.html
├── projects.html
├── about.html
├── contact.html
├── resume.html
├── 404.html
├── robots.txt                 # SEO
├── sitemap.xml                # SEO
└── .nojekyll                  # Disable Jekyll
```

## Important Notes

- **All file paths are relative** (not absolute `/assets/...`). Required for GitHub Pages.
- **No `!important` in CSS** - Use specificity correctly.
- **Test on mobile devices** - Primary audience may be mobile.
- **localStorage used for:** theme preference (`theme`), language preference (`language`).
- **EmailJS integration** in `contact.js` - Form submissions handled client-side.
- **DevIcons CDN** used for technology icons (e.g., `devicon-python-plain`).

## Troubleshooting

### Changes not appearing on live site
1. Wait 1-2 minutes for GitHub Actions deployment
2. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
3. Check deployment: `gh run list --repo dipedilans/dipedilans.github.io`

### CSS/JS not loading
Check paths are relative: `assets/css/main.css` not `/assets/css/main.css`

### Wrong git identity
```bash
git config user.name
git config user.email
# If wrong:
gset-dd  # Sets dipedilans identity
```

## Performance & SEO

- Semantic HTML5 elements
- Lazy loading images (`loading="lazy"`)
- Optimized fonts (`font-display: swap`)
- Clean URL structure
- `sitemap.xml` and `robots.txt` configured
- No build overhead (instant deployment)
