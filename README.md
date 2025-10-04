# Portfolio Website v3

Modern, responsive portfolio website built with vanilla HTML, CSS, and JavaScript. Features dark/light theme, multi-language support (PT/EN), and a clean blue design system.

**Live Site:** [https://dipedilans.github.io](https://dipedilans.github.io)

---

## Overview

Personal portfolio showcasing Platform Engineering and Big Data expertise. Built with **pure HTML** (no frameworks, no build process) for maximum simplicity and instant deployment.

### Key Features

- ✅ **Pure HTML/CSS/JS** - No build step, no SSG, no frameworks
- ✅ **Dark/Light Theme** - Persistent user preference
- ✅ **Multi-language** - Portuguese/English support
- ✅ **Fully Responsive** - Mobile-first design (320px to 1920px+)
- ✅ **SEO Optimized** - Sitemap, robots.txt, semantic HTML
- ✅ **Performance** - Lazy loading, optimized assets
- ✅ **Data-Driven** - Skills and projects loaded from JSON files

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Markup** | HTML5 (semantic elements) |
| **Styling** | CSS3 (custom properties, BEM naming) |
| **Scripting** | Vanilla JavaScript (ES6 modules) |
| **Icons** | DevIcons CDN |
| **Fonts** | Google Fonts (Inter, Fira Code) |
| **Email** | EmailJS (contact form) |
| **Hosting** | GitHub Pages |
| **Version Control** | Git + GitHub |

**No frameworks. No build process. No dependencies.**

---

## Project Structure

```
website-v3/
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design system (colors, spacing)
│   │   ├── layout.css         # Header, footer, grid
│   │   ├── components.css     # Reusable components
│   │   └── pages/             # Page-specific styles
│   ├── js/
│   │   ├── main.js            # Entry point
│   │   ├── navigation.js      # Header, mobile menu
│   │   ├── theme.js           # Dark/light mode
│   │   ├── language.js        # PT/EN switcher
│   │   ├── skills.js          # Skills display
│   │   └── projects.js        # Project filtering
│   ├── images/
│   │   ├── favicon.svg
│   │   └── profile.png
│   └── docs/
│       └── cv.pdf
├── data/
│   ├── skills.json            # ⭐ Edit this to add skills
│   ├── projects.json          # ⭐ Edit this to add projects
│   └── translations.json      # PT/EN translations
├── index.html                 # Homepage
├── skills.html                # Skills page
├── projects.html              # Projects portfolio
├── about.html                 # About me
├── contact.html               # Contact form
├── resume.html                # CV/Resume
├── 404.html                   # Error page
├── robots.txt                 # SEO
├── sitemap.xml                # SEO
└── .nojekyll                  # Disable GitHub Pages Jekyll
```

---

## Architecture Decision

### Why Pure HTML?

This project **deliberately avoids** static site generators (Jekyll, Hugo, etc.) for maximum simplicity:

**99% of updates** involve editing JSON files:
- Add skill → Edit `data/skills.json` (1 file)
- Add project → Edit `data/projects.json` (1 file)
- Change content → Edit `data/translations.json` (1 file)

**1% of updates** involve editing HTML (navigation changes):
- Changing nav links requires editing all 7 HTML files
- **Trade-off accepted:** ~1000 lines of duplicated HTML (header/footer) for zero build complexity

**Benefits:**
- ✅ Direct deployment: `git push` → live (30 seconds)
- ✅ No build failures: HTML can't fail to compile
- ✅ Zero learning curve: Plain HTML/CSS/JS
- ✅ Live Server works: No Jekyll server needed
- ✅ Maximum simplicity: What you commit = what gets served

**Separation of Concerns:**
- **HTML** - Page structure (edit rarely)
- **JSON** - Dynamic data (edit frequently)
- **Vanilla JS** - Loads JSON and renders content
- **CSS** - Styling with design system variables

---

## Local Development

### Prerequisites

- Web browser
- Text editor (VS Code recommended)
- Git

### Run Locally

**Option 1: VS Code Live Server (Recommended)**

```bash
# Install Live Server extension in VS Code
# Right-click any HTML file → "Open with Live Server"
# Site runs at http://127.0.0.1:5500
```

**Option 2: Python HTTP Server**

```bash
cd /path/to/website-v3
python3 -m http.server 8000
# Visit http://localhost:8000
```

**That's it!** No `npm install`, no `bundle exec`, no build process.

---

## Adding Content

### Add a New Skill

Edit `data/skills.json`:

```json
{
  "name": "Docker",
  "icon": "devicon-docker-plain",
  "proficiency": 85,
  "years": "3+",
  "featured": true
}
```

Reload page. Done.

### Add a New Project

Edit `data/projects.json`:

```json
{
  "id": "my-awesome-project",
  "title": "My Awesome Project",
  "category": "Web Development",
  "status": "REAL",
  "difficulty": 3,
  "featured": true,
  "description": "Description here...",
  "technologies": ["React", "Node.js", "MongoDB"],
  "github": "https://github.com/username/repo",
  "demo": "https://demo-url.com",
  "image": "https://via.placeholder.com/400x300"
}
```

Reload page. Done.

### Update Translations

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

---

## Deployment

### Deploy to GitHub Pages (with GitHub Actions)

This project uses **GitHub Actions** for automated deployment. Every push to `main` triggers an automatic deployment.

**Initial Setup:**

```bash
# Set git identity (dipedilans account)
gset-dd

# Verify identity
git config user.name   # Should show: Dipe Dilans
git config user.email  # Should show: 157709256+dipedilans@users.noreply.github.com

# Create repository (if not exists)
gh repo create dipedilans.github.io --public

# Push code
git add .
git commit -m "feat: initial deployment"
git push -u origin main
```

**Enable GitHub Pages with GitHub Actions:**

1. Go to repo settings: https://github.com/dipedilans/dipedilans.github.io/settings/pages
2. **Source:** GitHub Actions
3. Workflow will automatically run on push

**Site goes live at:** https://dipedilans.github.io (within 30-60 seconds)

### GitHub Actions Workflow

The workflow (`.github/workflows/static.yml`) does:

1. **Checkout code** - Clones repository
2. **Setup Pages** - Configures GitHub Pages
3. **Upload artifact** - Prepares files for deployment
4. **Deploy** - Publishes to GitHub Pages

**Benefits:**
- ✅ **Visible history** - See all deployments in Actions tab
- ✅ **Better control** - Can add validation steps (HTML validation, link checking)
- ✅ **Learn CI/CD** - Practical experience with GitHub Actions
- ✅ **Future extensibility** - Easy to add build steps if needed

**View deployments:**
- Actions tab: https://github.com/dipedilans/dipedilans.github.io/actions
- Latest run: Shows status (✓ success, ✗ failure, ● in progress)

### Daily Updates

```bash
# 1. Make changes (edit HTML, JSON, CSS)
# 2. Test locally (Live Server)
# 3. Deploy:

gset-dd  # Set correct identity
git add .
git commit -m "feat: add new project to portfolio"
git push origin main

# GitHub Actions automatically:
# - Runs workflow
# - Validates deployment
# - Publishes to GitHub Pages
#
# Wait 30-60 seconds → Changes live!
```

**Monitor deployment:**

```bash
# View latest workflow runs
gh run list --repo dipedilans/dipedilans.github.io --limit 5

# Watch live deployment (get run ID from list above)
gh run view <run-id> --repo dipedilans/dipedilans.github.io
```

**Commit message types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - CSS/visual changes
- `perf:` - Performance improvements
- `chore:` - Maintenance
- `ci:` - CI/CD changes (GitHub Actions)

---

## Design System

### Colors

**Light Theme:**
- Primary: `#2196f3` (Blue 500)
- Background: `#ffffff`
- Text: `#212121`

**Dark Theme:**
- Primary: `#64b5f6` (Blue 300)
- Background: `#121212`
- Text: `#ffffff`

All colors defined in `assets/css/variables.css` as CSS custom properties.

### Typography

- **Primary Font:** Inter (sans-serif)
- **Monospace Font:** Fira Code
- **Base Size:** 16px (1rem)
- **Scale:** 0.75rem to 3rem

### Spacing

```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-xl: 2rem;      /* 32px */
--space-3xl: 4rem;     /* 64px */
```

### Breakpoints

- **Mobile:** 0-767px (base styles)
- **Tablet:** 768px-1023px (`@media (min-width: 768px)`)
- **Desktop:** 1024px+ (`@media (min-width: 1024px)`)

---

## JavaScript Modules

### Module Structure

```javascript
// main.js - Entry point
import { initHeader } from './navigation.js';
import { initTheme } from './theme.js';
import { initLanguage } from './language.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();      // Must run first
    initLanguage();   // Apply translations
    initHeader();     // Setup navigation
    // ... page-specific inits
});
```

### Key Modules

| Module | Responsibility |
|--------|---------------|
| `navigation.js` | Header scroll behavior, mobile menu, progress bar |
| `theme.js` | Dark/light mode toggle, localStorage persistence |
| `language.js` | PT/EN switcher, loads translations.json |
| `skills.js` | Loads skills.json, renders skill cards |
| `projects.js` | Loads projects.json, filtering, search |
| `contact.js` | Form validation, EmailJS integration |
| `animations.js` | Scroll animations, Intersection Observer |

---

## Mobile Navigation

**Mobile (<1024px):**
- Hamburger menu (☰) visible
- Desktop nav hidden
- Full-screen overlay menu

**Desktop (≥1024px):**
- Horizontal navigation visible
- Hamburger menu hidden
- Hover effects

**Smart Header:**
- Hides on scroll down
- Shows on scroll up
- Progress bar shows scroll position

---

## SEO & Performance

### SEO Features

- ✅ Semantic HTML5 elements
- ✅ Unique meta descriptions per page
- ✅ `robots.txt` configured
- ✅ `sitemap.xml` with all pages
- ✅ Open Graph meta tags
- ✅ Clean URL structure
- ✅ Fast loading times

### Performance Optimizations

- ✅ Lazy loading images (`loading="lazy"`)
- ✅ CSS custom properties (no preprocessor needed)
- ✅ ES6 modules (native browser support)
- ✅ Minimal external dependencies
- ✅ Optimized font loading (`font-display: swap`)
- ✅ No build process overhead

**Target Scores:**
- Desktop Lighthouse: >90
- Mobile Lighthouse: >85

---

## Browser Support

- ✅ Chrome/Edge (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Mobile browsers (iOS Safari 12+, Chrome Mobile)

---

## Troubleshooting

### Changes Not Appearing on Live Site

```bash
# 1. Wait 1-2 minutes for GitHub Pages deployment
# 2. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
# 3. Check deployment status:
gh run list --repo dipedilans/dipedilans.github.io
```

### CSS/JS Not Loading

Check file paths are relative:

```html
<!-- ✅ Correct -->
<link rel="stylesheet" href="assets/css/main.css">

<!-- ❌ Wrong -->
<link rel="stylesheet" href="/assets/css/main.css">
```

### Wrong Git Identity

```bash
# Verify current identity
git config user.name
git config user.email

# Fix if wrong
gset-dd  # For dipedilans account
# or
gset-dcs  # For diogo-costa-silva account
```

---

## Migration to Custom Domain (Future)

When ready for professional deployment:

1. **Buy domain** (e.g., `diogosilva.dev`)
2. **Create CNAME file:**
   ```bash
   echo "diogosilva.dev" > CNAME
   git add CNAME
   git commit -m "feat: add custom domain"
   git push origin main
   ```

3. **Configure DNS at registrar:**
   - Add A records pointing to GitHub IPs
   - Add CNAME record: `www` → `dipedilans.github.io`

4. **Enable HTTPS** in GitHub Pages settings

5. Site accessible at `https://diogosilva.dev`

---

## Project Principles

### Do's ✅

- Keep it simple and clean
- Edit JSON files for content updates
- Test on real mobile devices
- Use semantic HTML
- Follow BEM naming for CSS
- Make regular small commits
- Ensure accessibility

### Don'ts ❌

- Over-engineer solutions
- Add unnecessary dependencies
- Forget mobile users
- Use `!important` in CSS
- Skip testing before deploy
- Ignore console errors

---

## Quick Reference

### Essential Commands

```bash
# Local development
# Use VS Code Live Server or python3 -m http.server 8000

# Deploy
gset-dd                                    # Set identity
git add .                                  # Stage changes
git commit -m "feat: description"          # Commit
git push origin main                       # Deploy

# View live site
open https://dipedilans.github.io
```

### Important Files to Edit

- **Add skills:** `data/skills.json`
- **Add projects:** `data/projects.json`
- **Change text:** `data/translations.json`
- **Change styles:** `assets/css/variables.css`
- **Update CV:** Replace `assets/docs/cv.pdf`

### Important URLs

- **Live Site:** https://dipedilans.github.io
- **Repository:** https://github.com/dipedilans/dipedilans.github.io
- **GitHub Pages Settings:** https://github.com/dipedilans/dipedilans.github.io/settings/pages

---

## License

Personal portfolio project. Content © 2025 Diogo Silva. Code free to reference for learning.

---

**Built with vanilla HTML, CSS, and JavaScript. No frameworks. No build process. Maximum simplicity.**
