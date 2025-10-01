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

This is a modern, multi-page portfolio website built with vanilla JavaScript (no frameworks), featuring a clean blue color palette, dark/light theme support, and multi-language functionality (PT/EN). The project follows the specifications in PRD.md and demonstrates Platform Engineering and Big Data expertise.

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
- **Multi-page application** with separate HTML files for each section
- **Modular JavaScript** with ES6 modules for different functionalities
- **Organized CSS** with separation of concerns (variables, base, components, pages)
- **Data-driven content** using JSON files for projects, skills, and translations

### Key Technologies
- **Frontend**: HTML5, CSS3 (custom properties), JavaScript ES6+
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

### Adding a New Project
1. Edit `data/projects.json`
2. Add project object with all required fields
3. Set `featured: true` to show on homepage
4. Use Unsplash/Pexels for placeholder images

### Adding a New Skill
1. Edit `data/skills.json`
2. Add to appropriate category
3. Set `featured: true` for homepage display
4. Include proficiency level (0-100)

### Adding a New Page
1. Create new HTML file following existing structure
2. Add navigation link in `main.js` header template
3. Create page-specific CSS in `assets/css/pages/`
4. Initialize page-specific JS in `main.js` switch statement

### Updating Translations
1. Edit `data/translations.json`
2. Add keys for both `en` and `pt` objects
3. Use `data-i18n` attribute in HTML elements
4. Translations are applied automatically

## Important Notes

- The project is designed to work without a build process
- All paths are relative for GitHub Pages compatibility
- EmailJS is configured for the contact form
- CV PDF should be placed in `/assets/docs/cv.pdf`
- Profile image is at `/assets/images/profile.png`
- The site owner is Diogo Silva, a Platform Engineer at MC Digital (Sonae)

## Debugging Tips

- Check browser console for JavaScript errors
- Verify JSON files are valid (use JSONLint)
- Test with cache disabled in DevTools
- Check Network tab for failed resource loads
- Use Lighthouse for performance audits
- Test on real mobile devices, not just responsive mode

## Deployment

The site is designed for GitHub Pages deployment:
1. Push to `main` branch
2. Enable GitHub Pages in repository settings
3. Select source as `main` branch, root folder
4. Site will be available at `https://[username].github.io/website-v3/`