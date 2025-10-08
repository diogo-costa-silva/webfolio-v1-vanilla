# Portfolio Website

Modern, responsive portfolio built with pure HTML, CSS, and JavaScript. **No frameworks, no build process** - just clean, performant web development.

**Live Site:** [https://diogo-costa-silva.github.io](https://diogo-costa-silva.github.io)

---

## ✨ Features

- 🎨 **Dark/Light Theme** - Persistent user preference
- 🌍 **Multi-language** - Portuguese/English support
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Performance** - Lazy loading, optimized assets
- 📊 **Data-Driven** - JSON-based content management
- 🎯 **SEO Optimized** - Semantic HTML, sitemap, meta tags

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Markup** | HTML5 (semantic) |
| **Styling** | CSS3 (custom properties, BEM) |
| **Scripting** | Vanilla JavaScript (ES6 modules) |
| **Icons** | DevIcons CDN |
| **Hosting** | GitHub Pages |
| **CI/CD** | GitHub Actions |

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/diogo-costa-silva/diogo-costa-silva.github.io.git
cd diogo-costa-silva.github.io

# Run locally (VS Code Live Server recommended)
# Or use Python:
python3 -m http.server 8000

# Visit http://localhost:8000
```

**No npm install needed!** Just open the HTML files in a browser or use any HTTP server.

---

## 📝 Content Updates

<details>
<summary><strong>Add/Edit Skills</strong></summary>

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

</details>

<details>
<summary><strong>Add/Edit Projects</strong></summary>

Edit `data/projects.json`:

```json
{
  "id": 1,
  "title": "Project Name",
  "category": "data-science",
  "status": "completed",
  "technologies": ["Python", "Docker"],
  "github": "https://github.com/user/repo",
  "description": "Description...",
  "featured": true
}
```

</details>

<details>
<summary><strong>Update Translations</strong></summary>

Edit `data/translations.json`:

```json
{
  "en": { "nav.home": "Home" },
  "pt": { "nav.home": "Início" }
}
```

HTML elements with `data-i18n="nav.home"` update automatically.

</details>

---

## 🏗️ Project Structure

<details>
<summary><strong>View folder structure</strong></summary>

```
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design system
│   │   ├── components.css     # Reusable components
│   │   └── pages/             # Page-specific styles
│   ├── js/
│   │   ├── main.js            # Entry point
│   │   ├── theme.js           # Dark/light mode
│   │   ├── language.js        # PT/EN switcher
│   │   └── projects.js        # Project filtering
│   └── images/
├── data/
│   ├── skills.json            # ⭐ Edit to add skills
│   ├── projects.json          # ⭐ Edit to add projects
│   └── translations.json      # PT/EN translations
├── index.html                 # Homepage
├── skills.html                # Skills page
├── projects.html              # Projects portfolio
├── about.html                 # About me
├── contact.html               # Contact form
└── resume.html                # CV/Resume
```

</details>

---

## 🎯 Architecture

<details>
<summary><strong>Design Philosophy</strong></summary>

**Trade-off:** ~1000 lines of duplicated HTML (header/footer across 7 pages) in exchange for **zero build complexity**.

- **99% of updates** = Edit JSON files
- **1% of updates** = Edit HTML (navigation changes)

**Benefits:**
- ✅ Direct deployment: `git push` → live (30 seconds)
- ✅ No build failures
- ✅ Zero dependencies
- ✅ Works offline
- ✅ Maximum simplicity

</details>

<details>
<summary><strong>Module System</strong></summary>

Critical initialization order in `assets/js/main.js`:

```javascript
initColor();        // Must run first (color system)
initTheme();        // Dark/light mode
initLanguage();     // Loads translations
initHeader();       // Navigation
// Then page-specific modules...
```

**Never change this order** - language must initialize before page-specific modules.

</details>

---

## 🚢 Deployment

Automatic deployment via **GitHub Actions** on every push to `main`:

```bash
git add .
git commit -m "feat: add new project"
git push origin main

# GitHub Actions automatically deploys to GitHub Pages
# Live in 30-60 seconds!
```

<details>
<summary><strong>Manual Deployment Setup</strong></summary>

1. Enable GitHub Pages in repo settings
2. Source: **GitHub Actions**
3. Workflow file: `.github/workflows/static.yml`
4. Every push to `main` triggers deployment

Monitor deployment:
```bash
gh run list --limit 5
```

</details>

---

## 📱 Browser Support

- ✅ Chrome/Edge (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Mobile browsers (iOS 12+, Chrome Mobile)

---

## 📄 License

Personal portfolio project. Content © 2025 Diogo Silva.

---

**Built with vanilla HTML, CSS, and JavaScript. No frameworks. No build process. Maximum simplicity.**
