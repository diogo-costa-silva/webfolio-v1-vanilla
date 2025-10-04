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

## Project Overview

This is a modern, multi-page portfolio website built with **pure HTML, CSS, and vanilla JavaScript** (no build process, no frameworks). Features a clean blue color palette, dark/light theme support, and multi-language functionality (PT/EN). The project follows the specifications in PRD.md and ARCHITECTURE.md, demonstrating Platform Engineering and Big Data expertise.

**Key Architectural Decision (2025-01):** Use pure HTML for maximum simplicity. Accepts ~1000 lines of header/footer duplication because 99% of updates are to JSON files (skills/projects). See ARCHITECTURE.md for full rationale.

## Commands

### Local Development

Use the server from the Live Server extension: http://127.0.0.1:5500/

### Testing & Validation
```bash
# Validate HTML
npx html-validate "*.html"

# Check CSS for issues
npx stylelint "assets/css/**/*.css"

# Check JavaScript
npx eslint "assets/js/**/*.js"
```

### Git Workflow
```bash
# Check status
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "type: description"

# Push to repository
git push origin main
```

## Architecture

### File Structure
- **Pure HTML pages** (7 pages: index, skills, projects, about, contact, resume, 404)
- **Header/footer duplicated** across pages (acceptable trade-off for simplicity)
- **Modular JavaScript** with ES6 modules for interactivity (run-time)
- **Organized CSS** with separation of concerns (variables, base, components, pages)
- **Data-driven content** using JSON files for projects, skills, and translations

**Complete structure:** See ARCHITECTURE.md for detailed directory tree

### Key Technologies
- **No Build System**: Static HTML, direct deployment
- **Frontend**: HTML5, CSS3 (custom properties), JavaScript ES6+
- **No Templating Engine**: Plain HTML
- **Libraries**: EmailJS (contact form only)
- **Icons**: Inline SVGs for performance
- **Fonts**: Inter (Google Fonts), Fira Code (monospace)

### JavaScript Module System
The project uses ES6 modules with a main entry point (`main.js`) that imports and initializes:
- `navigation.js` - Smart header with scroll behavior and mobile menu
- `theme.js` - Dark/light mode toggle with localStorage persistence
- `language.js` - PT/EN language switcher
- `animations.js` - Scroll animations and intersection observers
- `hero.js` - Typewriter effects for hero section
- `projects.js` - Project cards with filtering and search
- `skills.js` - Skills display with progress indicators
- `contact.js` - Form validation and EmailJS integration
- `testimonials.js` - Carousel functionality
- `footer.js` - Footer component logic

### CSS Architecture
- **Design System**: Uses CSS custom properties defined in `variables.css`
- **Color Scheme**: Blue-based palette with semantic colors
- **Dark Mode**: Implemented via `[data-theme="dark"]` attribute
- **Responsive**: Mobile-first approach with breakpoints at 480px, 768px, 1024px
- **BEM-like naming**: Component-based class naming (e.g., `.project-card__title`)

### Data Management
- **projects.json**: Contains 30 project entries with categories, status, and metadata
- **skills.json**: Organized by categories with proficiency levels
- **translations.json**: PT/EN translations for all UI text
- All data files have inline fallbacks in JavaScript for resilience

## Key Features

### Smart Header
- Hides on scroll down, shows on scroll up
- Progress bar showing page scroll percentage
- Mobile hamburger menu
- Theme and language toggles

### Hero Section
- Typewriter effect cycling through greetings and taglines
- Smooth scroll indicator
- CTA buttons for projects and CV download

### Projects System
- Filter by category (Data Science, Web Dev, Backend, DevOps, etc.)
- Search functionality
- Status badges (REAL, COMPLETED, IN PROGRESS, PLANNED)
- Difficulty indicators
- GitHub and demo links

### Skills Display
- Organized by categories
- Progress bars showing proficiency
- Experience years
- Featured skills on homepage

### Theme System
- Light/dark mode toggle
- Respects system preference
- Persists choice in localStorage
- Smooth transitions

### Internationalization
- PT/EN language support
- Dynamic content switching
- Persists language preference

## Development Guidelines

### When Adding New Features
1. Follow existing patterns in the codebase
2. Use CSS custom properties for styling
3. Ensure dark mode compatibility
4. Add translations to `translations.json`
5. Test on mobile devices
6. Maintain accessibility standards

### When Modifying JavaScript
1. Use ES6+ features consistently
2. Follow the modular pattern (export/import)
3. Add error handling with fallbacks
4. Ensure localStorage operations have try/catch
5. Test with both data sources (JSON and inline fallbacks)

### When Updating Styles
1. Use existing CSS variables
2. Maintain BEM-like naming convention
3. Ensure responsive behavior
4. Test in both light and dark themes
5. Check cross-browser compatibility

### Performance Considerations
- Images use lazy loading
- Intersection Observer for animations
- Debounced scroll events
- Minimal external dependencies
- Optimized font loading strategy

## Common Tasks

### Adding a New Project ⭐ (Most Common)
**This is your primary workflow - edit JSON, commit, push. Done!**

1. Edit `data/projects.json`
2. Add project object with all required fields:
   ```json
   {
       "id": "my-project",
       "title": "Project Name",
       "category": "Data Science",
       "status": "REAL",
       "difficulty": 3,
       "featured": true,
       "description": "Brief description",
       "technologies": ["Python", "Pandas"],
       "github": "https://github.com/user/repo",
       "demo": null
   }
   ```
3. Set `featured: true` to show on homepage
4. Use Unsplash/Pexels for placeholder images
5. **Commit and push** - site updates automatically!

### Adding a New Skill ⭐ (Most Common)
**This is your primary workflow - edit JSON, commit, push. Done!**

1. Edit `data/skills.json`
2. Add to appropriate category:
   ```json
   {
       "name": "Kubernetes",
       "icon": "devicon-kubernetes-plain",
       "proficiency": 85,
       "years": "3+",
       "featured": true
   }
   ```
3. Set `featured: true` for homepage display
4. Include proficiency level (0-100)
5. **Commit and push** - site updates automatically!

### Adding a New Page (Rare)
**Warning: This requires editing 7 HTML files. Only do if absolutely necessary.**

1. **Duplicate an existing HTML file**:
   ```bash
   cp about.html newpage.html
   ```

2. **Update page content** in `newpage.html`:
   - Change `<title>` tag
   - Update page-specific content
   - Set correct nav link as active (`nav__link--active`)

3. **Add navigation link to ALL 7 HTML files**:
   - Edit: `index.html`, `skills.html`, `projects.html`, `about.html`, `contact.html`, `resume.html`, `404.html`
   - Add to both desktop and mobile nav:
     ```html
     <li><a href="newpage.html" class="nav__link">New Page</a></li>
     ```

4. **Add translations** in `data/translations.json`:
   ```json
   {
       "en": { "nav.newpage": "New Page" },
       "pt": { "nav.newpage": "Nova Página" }
   }
   ```

5. **Create page-specific CSS** (optional):
   `assets/css/pages/newpage.css`

6. **Initialize page-specific JS** in `main.js` switch statement

**Trade-off:** Yes, editing 7 files is tedious. But it happens <1% of the time. Most updates are JSON files.

### Updating Translations
1. Edit `data/translations.json`
2. Add keys for both `en` and `pt` objects
3. Use `data-i18n` attribute in HTML elements
4. Translations are applied automatically

## Important Notes

- **No build process**: Pure HTML, direct deployment to GitHub Pages
- **Development server**: http://127.0.0.1:5500 (VS Code Live Server extension)
- All paths are relative for GitHub Pages compatibility
- EmailJS is configured for the contact form
- CV PDF should be placed in `/assets/docs/cv.pdf`
- Profile image is at `/assets/images/profile.png`
- The site owner is Diogo Silva, a Platform Engineer at MC Digital (Sonae)
- **Deploy target**: https://dipedilans.github.io (user site, not project site)
- **99% of edits**: `data/skills.json` and `data/projects.json` (1 file each, easy!)
- **1% of edits**: HTML header/footer changes (7 files, rare but acceptable)

## Debugging Tips

- Check browser console for JavaScript errors
- Verify JSON files are valid (use JSONLint)
- Test with cache disabled in DevTools
- Check Network tab for failed resource loads
- Use Lighthouse for performance audits
- Test on real mobile devices, not just responsive mode

## Mobile Navigation Architecture

O projeto usa abordagem **mobile-first** para navegação:

### Estrutura

1. **Mobile por defeito** (0-1024px):
   - `.nav` escondida (`display: none`)
   - `.mobile-menu-toggle` visível (`display: flex`)
   - `.nav--mobile` disponível (slide down ao clicar hamburger)

2. **Desktop** (≥1025px):
   - `.nav` visível (`display: flex` - navegação horizontal)
   - `.mobile-menu-toggle` escondida (`display: none`)
   - `.nav--mobile` desativada (`display: none`)

### Breakpoints

- **Mobile/Tablet**: 0-1024px (hamburger menu)
- **Desktop**: 1025px+ (navegação horizontal)

### JavaScript

O módulo `navigation.js` gere:
- Toggle do menu mobile (hamburger)
- Fecho automático ao redimensionar para desktop
- Fecho ao clicar num link
- Fecho ao clicar fora do menu
- Scroll behavior do header
- Progress bar

### Princípios

- **Mobile-First**: CSS começa mobile, override para desktop
- **Progressive Enhancement**: Estrutura HTML visível sem JS
- **Defensive Coding**: Verificações de existência de elementos
- **Performance**: Debounce em resize, passive scroll listeners

## Deployment

The site is deployed to **GitHub Pages** at https://dipedilans.github.io

### Deployment Workflow

**Super simple - no build step!**

1. **Set git identity** (dipedilans account):
   ```bash
   gset-dd  # Alias: sets user.name and user.email for dipedilans
   ```

2. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add new project to portfolio"
   # or
   git commit -m "feat: add new skill"
   ```

3. **Push to GitHub**:
   ```bash
   git push origin main
   ```

4. **GitHub Pages deploys** (no build step!)
   - Deployment takes ~30-60 seconds (faster than Jekyll!)
   - Site updates at https://dipedilans.github.io
   - What you commit is exactly what gets served

### Local Testing

**Live Server (only option needed)**
```bash
# Use VS Code Live Server extension
# Right-click any HTML file → "Open with Live Server"
# Visit http://127.0.0.1:5500
```

**✅ Benefits:**
- Instant preview (no build)
- Live reload on file changes
- Exactly what GitHub Pages will serve
- Test HTML, CSS, JavaScript immediately

**Alternative: Python HTTP Server**
```bash
cd /Users/diogosilva/Developer/Projects/Websites/website-v3
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Troubleshooting Deployment

**Issue:** Changes not appearing on live site
- **Solution:** Wait 1-2 minutes for deployment
- **Solution:** Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- **Solution:** Check if git push was successful

**Issue:** Page looks broken
- **Solution:** Check browser console for JavaScript errors (F12)
- **Solution:** Validate HTML: `npx html-validate "*.html"`
- **Solution:** Check Network tab for 404s (F12)

See **DEPLOYMENT.md** for complete deployment guide including repo setup, GitHub Pages configuration, and migration plans.