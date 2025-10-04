# Personal Portfolio Website - Product Requirements Document

## 1. Executive Summary

### 1.1 Project Overview
Development of a clean, professional multi-page portfolio website showcasing skills, projects, and professional journey with a modern blue color palette supporting both light and dark themes.

### 1.2 Core Objectives
- **Showcase Professional Skills**: Present technical abilities and projects effectively
- **Enable Easy Contact**: Provide multiple channels for professional connections
- **Demonstrate Code Quality**: The website itself serves as a portfolio piece
- **Support Career Growth**: Platform for continuous updates as career progresses

### 1.3 Core Principles
- **Simplicity First**: Clean, uncluttered design focusing on content
- **Performance Focused**: Fast loading times and optimized assets
- **User Experience**: Intuitive navigation and smooth interactions
- **Maintainability**: Clean code structure for easy updates
- **Accessibility**: WCAG compliance for inclusive access

### 1.4 Technology Stack
- **Build System**: Jekyll (static site generator, GitHub Pages native)
- **Languages**: HTML5, CSS3, JavaScript (ES6+ vanilla)
- **Templating**: Liquid (Jekyll) for shared components
- **No Frontend Frameworks**: Focus on fundamentals and performance
- **Minimal Libraries**: EmailJS for contact form only
- **Version Control**: Git with strategic commit strategy
- **Hosting**: GitHub Pages (https://dipedilans.github.io)

**⚠️ ARCHITECTURAL UPDATE (2025-01):**
Migrated to Jekyll to eliminate ~1000 lines of duplicated HTML. Header/footer are now in `_includes/` instead of loaded via JavaScript. See ARCHITECTURE.md for rationale.

---

## 2. Website Architecture

### 2.1 Structure Type
**Multi-Page Jekyll Site** with the following structure:
- Separate HTML files for each major section
- Shared components (header, footer) via Jekyll includes (NOT JavaScript)
- Layouts in `_layouts/` for consistent page structure
- Consistent navigation across all pages
- Homepage as central hub with previews

**~~Shared components (header, footer) loaded via JavaScript~~** ← ❌ DEPRECATED (2025-01)
**New approach:** Jekyll `_includes/` for zero code duplication

### 2.2 Site Map
```
/
├── index.html          (Homepage)
├── about.html          (About Me)
├── skills.html         (Skills & Technologies)
├── projects.html       (Portfolio)
├── resume.html         (CV/Resume)
├── contact.html        (Contact)
├── 404.html           (Error Page)
├── /assets
│   ├── /css
│   ├── /js
│   ├── /images
│   └── /docs          (CV/Resume PDFs here)
└── /data
    ├── translations.json
    └── projects.json
```

### 2.3 Navigation Flow
- **Primary Navigation**: Header menu (always accessible)
- **Secondary Navigation**: Footer links
- **Contextual Navigation**: Section-specific CTAs
- **Breadcrumbs**: On deeper pages (project details)

---

## 3. Global Components

### 3.1 Header & Navigation

#### 3.1.1 Smart Header Behavior
- **Scroll Behavior**:
  - Hide on scroll down
  - Show on scroll up immediately
  - Always visible at page top
  - Smooth transition (transform: translateY)
  - Debounced scroll detection (100ms)

#### 3.1.2 Header Structure
```
[Logo/Name] [--------Navigation--------] [Lang] [Theme] [Menu☰]
[================Progress Bar==================]
```

#### 3.1.3 Components
- **Logo/Brand**:
  - Text-based or simple SVG
  - Clickable to homepage
  - Subtle hover effect

- **Navigation Menu**:
  - Desktop: Horizontal centered links
  - Tablet: Compact horizontal
  - Mobile: Hamburger menu (right side)
  - Active page highlighting
  - Smooth hover transitions

- **Language Toggle**:
  - PT/EN switcher
  - Flag icons or text
  - Saves to localStorage

- **Theme Toggle**:
  - Sun/Moon icons
  - Smooth transition (300ms)
  - Saves to localStorage
  - Respects system preference

- **Progress Bar**:
  - 3px height
  - Blue gradient
  - Shows page scroll percentage
  - Smooth animation

### 3.2 Footer

#### 3.2.1 Structure (3 columns on desktop, stacked on mobile)
- **Column 1 - Brand**:
  - Logo/Name
  - Tagline
  - Copyright notice

- **Column 2 - Quick Links**:
  - Main navigation
  - Privacy policy
  - Sitemap

- **Column 3 - Connect**:
  - Social media icons
  - Email contact
  - Location

### 3.3 Common UI Elements

#### 3.3.1 Buttons
- **Primary CTA**: Blue background, white text
- **Secondary CTA**: Blue outline, blue text
- **Ghost Button**: Transparent with border
- **Icon Buttons**: Social links, actions
- **Hover States**: Scale(1.05), shadow elevation

#### 3.3.2 Cards
- **Project Cards**: Image, title, description, tags, links
- **Skill Cards**: Icon, name, proficiency level
- **Testimonial Cards**: Quote, author, role

#### 3.3.3 Modals
- **Image Lightbox**: For project screenshots
- **Video Player**: For demo videos
- **Confirmation Dialogs**: Form submissions

---

## 4. Homepage Structure (index.html)

### 4.1 Hero Section

#### 4.1.1 Layout
- **Height**: 100vh minus header
- **Background**: Subtle gradient or geometric pattern
- **Content**: Centered, with breathing room

#### 4.1.2 Content Elements
- **Dynamic Greeting**:
  ```javascript
  // Typewriter effect cycling through:
  "Olá" → "Hello" → "Bonjour" → "Hola" → "Ciao"
  ```

- **Main Heading**:
  - Name in large typography
  - Animated entrance (fade + slide up)

- **Dynamic Tagline** (Typewriter):
  ```javascript
  [
    "Full-Stack Developer",
    "Problem Solver",
    "Tech Enthusiast",
    "Continuous Learner"
  ]
  ```

- **CTA Buttons**:
  - Primary: "View Projects" → projects.html
  - Secondary: "Download CV" → /assets/docs/cv.pdf

- **Scroll Indicator**:
  - Animated arrow or mouse icon
  - Subtle bounce animation

### 4.2 About Preview Section

#### 4.2.1 Layout
- **Container**: Max-width 1200px, centered
- **Grid**: 2 columns desktop, stacked mobile
- **Spacing**: 80px vertical padding

#### 4.2.2 Content
- **Left Column - Text**:
  - Heading: "About Me"
  - Bio: 2-3 paragraph summary (max 150 words)
  - Key highlights (3 bullet points)
  - CTA: "Read Full Story" → about.html

- **Right Column - Visual**:
  - Professional photo or illustration
  - Decorative elements (subtle shapes)
  - Social links overlay (on hover)

### 4.3 Skills Highlights Section

#### 4.3.1 Layout
- **Heading**: "Core Competencies"
- **Subheading**: "Technologies I work with daily"
- **Grid**: 3x2 on desktop, 2x3 tablet, 1 column mobile

#### 4.3.2 Skill Categories (Top 6)
1. **Frontend Development**
   - Icons: HTML5, CSS3, JavaScript
   - Proficiency: 80%

2. **Backend Development**
   - Icons: Python, Node.js
   - Proficiency: 85%

3. **Data & Analytics**
   - Icons: SQL, Pandas
   - Proficiency: 80%

4. **DevOps & Cloud**
   - Icons: Docker, Azure, Terraform
   - Proficiency: 75%

5. **Version Control**
   - Icons: Git, GitHub
   - Proficiency: 95%

6. **Agile Methodologies**
   - Icons: Scrum, Kanban
   - Proficiency: 85%

- **CTA**: "View All Skills" → skills.html

### 4.4 Featured Projects Section

#### 4.4.1 Layout
- **Heading**: "Recent Work"
- **Subheading**: "Selected projects showcasing my skills"
- **Grid**: 2x2 desktop, 1 column mobile
- **Display**: 4 featured projects

#### 4.4.2 Project Card Structure
```
[====Project Image====]
[Category Badge]
Project Title
Brief description (50 words)
[Tech] [Stack] [Tags]
[Live Demo] [GitHub]
```

#### 4.4.3 Hover Behavior
- Image: Subtle zoom (scale: 1.05)
- Card: Shadow elevation
- Buttons: Color shift

- **CTA**: "Explore All Projects" → projects.html

### 4.5 Achievements/Metrics Section (Optional)

#### 4.5.1 Counter Animation
- Projects Completed: 20+
- Technologies: 15+
- Years Experience: 3+
- Coffee Cups: 1000+

### 4.6 Contact CTA Section

#### 4.6.1 Layout
- **Background**: Blue gradient
- **Content**: Centered text

#### 4.6.2 Content
- **Heading**: "Let's Work Together"
- **Subtext**: "Have a project in mind? Let's talk!"
- **Buttons**:
  - Primary: "Get In Touch" → contact.html
  - Secondary: "Schedule Call" → Calendly link
- **Quick Links**: Email, LinkedIn, GitHub icons

---

## 5. Individual Pages Specifications

### 5.1 About Page (about.html)

#### 5.1.1 Hero Section
- Smaller hero (40vh)
- Professional photo
- Name and current role

#### 5.1.2 Content Sections
- **My Story**: 3-4 paragraphs about journey
- **What I Do**: Current focus and expertise
- **Interests & Hobbies**: Personal side
- **Volunteer Work**: Community involvement
- **Values**: What drives me professionally

#### 5.1.3 Timeline
- Education milestones
- Career progression
- Key achievements

### 5.2 Skills Page (skills.html)

#### 5.2.1 Categories Structure
- **Programming Languages**: Python, JavaScript, TypeScript
- **Frontend**: HTML5, CSS3, React, Vue
- **Backend**: Node.js, Express, Django
- **Databases**: PostgreSQL, MongoDB, Redis
- **DevOps**: Docker, Kubernetes, CI/CD
- **Tools**: Git, VS Code, Postman
- **Soft Skills**: Leadership, Communication, Problem-solving

#### 5.2.2 Skill Display
- Proficiency bars or radar chart
- Years of experience
- Related projects link
- Certifications badges

### 5.3 Projects Page (projects.html)

#### 5.3.1 Filters & Search
- **Search Bar**: Real-time filtering
- **Category Filters**: Web, Mobile, Data, DevOps
- **Technology Tags**: Clickable pills
- **Sort Options**: Date, Name, Technology

#### 5.3.2 Project Grid
- Card layout (3 columns desktop)
- Lazy loading images
- Quick view modal
- Detailed view link

#### 5.3.3 Project Details (Modal or Subpage)
- Hero image/video
- Problem statement
- Solution approach
- Technologies used
- Key features
- Challenges overcome
- Results/Impact
- Links: Demo, GitHub, Case Study

### 5.4 Resume Page (resume.html)

#### 5.4.1 Layout
- **Download Button**: Links to /assets/docs/cv.pdf
- **Print Styles**: Clean formatting

#### 5.4.2 Sections
- **Professional Summary**
- **Experience Timeline**
  - Company, Role, Duration
  - Key responsibilities
  - Achievements

- **Education**
  - Degree, Institution, Year
  - Relevant coursework
  - Academic achievements

- **Certifications**
  - Name, Issuer, Date
  - Verification links

- **Languages**
  - Portuguese: Native
  - English: Fluent
  - Spanish: Basic

### 5.5 Contact Page (contact.html)

#### 5.5.1 Layout
- Split screen (form left, info right)
- Or centered single column

#### 5.5.2 Contact Form
- **Fields**:
  - Name* (text)
  - Email* (email)
  - Subject* (text)
  - Message* (textarea)
  - Budget (select - optional)
  - Timeline (select - optional)

- **Validation**:
  - Client-side validation
  - Clear error messages
  - Success confirmation

- **Integration**: EmailJS setup

#### 5.5.3 Contact Information
- Email address
- Location (city, country)
- Social media links
- Response time expectation
- Preferred contact method

### 5.6 404 Error Page (404.html)

#### 5.6.1 Content
- Fun illustration or animation
- "Page Not Found" message
- Search bar
- Suggested links
- Return home button

---

## 6. Design System

### 6.1 Color Palette

#### 6.1.1 Primary Colors (Blue Theme)
```css
:root {
  /* Light Theme */
  --primary-50: #e3f2fd;   /* Lightest blue */
  --primary-100: #bbdefb;
  --primary-200: #90caf9;
  --primary-300: #64b5f6;
  --primary-400: #42a5f5;
  --primary-500: #2196f3;  /* Main blue */
  --primary-600: #1e88e5;
  --primary-700: #1976d2;
  --primary-800: #1565c0;
  --primary-900: #0d47a1;  /* Darkest blue */

  /* Dark Theme adjustments */
  --dark-primary: #1976d2;
  --dark-accent: #64b5f6;
}
```

#### 6.1.2 Neutral Colors
```css
  /* Grays */
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-200: #eeeeee;
  --gray-300: #e0e0e0;
  --gray-400: #bdbdbd;
  --gray-500: #9e9e9e;
  --gray-600: #757575;
  --gray-700: #616161;
  --gray-800: #424242;
  --gray-900: #212121;

  /* Semantic */
  --success: #4caf50;
  --warning: #ff9800;
  --error: #f44336;
  --info: #2196f3;
```

### 6.2 Typography

#### 6.2.1 Font Stack
```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
}
```

#### 6.2.2 Type Scale
```css
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
```

### 6.3 Spacing System
```css
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
```

### 6.4 Layout
```css
  --container-max: 1200px;
  --container-padding: 1rem;
  --header-height: 64px;
  --footer-height: 300px;
```

### 6.5 Animations
```css
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
  --animation-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 7. Technical Specifications

### 7.1 HTML Requirements

#### 7.1.1 Structure
- Semantic HTML5 elements
- Valid W3C markup
- Proper heading hierarchy
- Landmark roles for accessibility

#### 7.1.2 Meta Tags
```html
<!-- Basic Meta -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Portfolio of [Name] - Full-Stack Developer">
<meta name="keywords" content="developer, portfolio, full-stack, python, javascript">
<meta name="author" content="[Your Name]">

<!-- Open Graph -->
<meta property="og:title" content="[Name] - Portfolio">
<meta property="og:description" content="Full-Stack Developer Portfolio">
<meta property="og:image" content="/assets/images/og-image.jpg">
<meta property="og:url" content="https://yoursite.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Name] - Portfolio">
```

### 7.2 CSS Architecture

#### 7.2.1 File Structure
```
/css
├── reset.css          # Reset/normalize
├── variables.css      # CSS custom properties
├── base.css          # Base styles
├── layout.css        # Layout components
├── components.css    # UI components
├── utilities.css     # Utility classes
├── animations.css    # Animations/transitions
├── dark-theme.css    # Dark mode overrides
└── pages/           # Page-specific styles
    ├── home.css
    ├── about.css
    └── ...
```

#### 7.2.2 Methodology
- BEM naming convention
- Mobile-first approach
- CSS custom properties
- No !important rules
- Modular architecture

### 7.3 JavaScript Features

#### 7.3.1 Core Modules
```javascript
// File Structure
/js
├── main.js           // App initialization
├── navigation.js     // Header, menu, scroll
├── theme.js         // Theme switcher
├── language.js      // i18n handler
├── animations.js    // Scroll animations
├── projects.js      // Project filtering
├── contact.js       // Form handling
└── utils.js        // Helper functions
```

#### 7.3.2 Key Features
- **Smooth Scrolling**: Between sections
- **Lazy Loading**: Images and content
- **Form Validation**: Real-time feedback
- **Search/Filter**: Projects and skills
- **LocalStorage**: Preferences
- **Intersection Observer**: Scroll animations
- **Typewriter Effect**: Hero section
- **Counter Animation**: Statistics

### 7.4 Performance Optimization

#### 7.4.1 Assets
- Image optimization (WebP with fallback)
- SVG for icons and logos
- Minified CSS/JS for production
- Critical CSS inline
- Font loading strategy

#### 7.4.2 Loading Strategy
- Lazy load below-fold images
- Defer non-critical JavaScript
- Preload critical resources
- Service worker for offline

### 7.5 SEO & Accessibility

#### 7.5.1 SEO
- Semantic HTML structure
- Schema.org markup
- XML sitemap
- Robots.txt
- Canonical URLs
- Performance optimization

#### 7.5.2 Accessibility (WCAG 2.1 Level AA)
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Color contrast (4.5:1 minimum)
- Screen reader compatible
- Skip navigation links
- Alt text for images
- Form labels and errors

### 7.6 Browser Support
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile: iOS Safari 12+, Chrome Mobile

---

## 8. Implementation Phases

### Phase 1: Foundation (Days 1-2)
1. **Project Setup**
   ```bash
   git init
   gset-dcs
   gh dcs
   gh repo create website-v3 --private
   git remote add origin git@github.com:diogo-costa-silva/website-v3.git
   ```

2. **File Structure**
   - Create directory structure
   - Setup HTML boilerplates
   - Initialize CSS system
   - Commit: `init: project structure`

3. **Design System**
   - CSS variables
   - Reset styles
   - Typography setup
   - Commit: `style: design system setup`

### Phase 2: Global Components (Days 3-4)
1. **Header & Navigation**
   - HTML structure
   - Desktop styles
   - Mobile menu
   - Scroll behavior
   - Commit: `feat: header and navigation`

2. **Footer**
   - Structure and styling
   - Responsive layout
   - Commit: `feat: footer component`

3. **Theme Switcher**
   - Toggle functionality
   - LocalStorage
   - CSS variables swap
   - Commit: `feat: theme switcher`

### Phase 3: Homepage (Days 5-7)
1. **Hero Section**
   - Layout and styling
   - Typewriter animation
   - CTA buttons
   - Commit: `feat: hero section`

2. **About Preview**
   - Two-column layout
   - Content and styling
   - Commit: `feat: about preview`

3. **Skills Highlights**
   - Grid layout
   - Skill cards
   - Progress indicators
   - Commit: `feat: skills section`

4. **Featured Projects**
   - Project cards
   - Hover effects
   - Commit: `feat: featured projects`

5. **Contact CTA**
   - Section styling
   - Button links
   - Commit: `feat: contact CTA`

### Phase 4: Individual Pages (Days 8-12)
1. **About Page**
   - Full biography
   - Timeline
   - Commit: `feat: about page`

2. **Skills Page**
   - Complete skill set
   - Categories
   - Commit: `feat: skills page`

3. **Projects Page**
   - Portfolio grid
   - Filters
   - Commit: `feat: projects page`

4. **Resume Page**
   - CV layout
   - Download functionality
   - Commit: `feat: resume page`

5. **Contact Page**
   - Form setup
   - EmailJS integration
   - Commit: `feat: contact page`

### Phase 5: Enhancement (Days 13-14)
1. **Internationalization**
   - Translation system
   - Language toggle
   - Commit: `feat: i18n support`

2. **Animations**
   - Scroll animations
   - Intersection Observer
   - Commit: `feat: scroll animations`

3. **Performance**
   - Image optimization
   - Lazy loading
   - Commit: `perf: optimizations`

### Phase 6: Polish & Deploy (Day 15)
1. **Testing**
   - Cross-browser testing
   - Mobile responsiveness
   - Form testing
   - Commit: `fix: cross-browser fixes`

2. **SEO & Accessibility**
   - Meta tags
   - ARIA labels
   - Sitemap
   - Commit: `feat: SEO and a11y`

3. **Deployment**
   - Build process
   - GitHub Pages setup
   - Domain configuration
   - Commit: `deploy: initial deployment`

---

## 9. Git Strategy

### 9.1 Commit Guidelines

#### 9.1.1 Commit Types
- `init`: Initial setup
- `feat`: New feature
- `fix`: Bug fix
- `style`: Styling changes
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `docs`: Documentation
- `test`: Testing
- `deploy`: Deployment

#### 9.1.2 Commit Format
```
type: brief description (max 50 chars)

[optional body with more details]
```

### 9.2 Branch Strategy
- `main`: Production-ready code
- `develop`: Active development
- `feature/*`: New features
- `fix/*`: Bug fixes

### 9.3 Commit Frequency
- After each completed component
- Before switching context
- At logical stopping points
- End of each work session

---

## 10. Content Guidelines

### 10.1 Placeholder Content
Since content isn't ready:
- Use Lorem Ipsum for text
- **Image Sources** (royalty-free):
  - [Unsplash](https://unsplash.com) - High-quality photos
  - [Pexels](https://pexels.com) - Free stock photos
  - [Pixabay](https://pixabay.com) - Free images
  - [Placeholder.com](https://placeholder.com) - Simple placeholders
  - Search terms: "coding", "developer", "technology", "portfolio"
- Placeholder project data
- Generic skill lists
- Sample testimonials

### 10.2 Content Requirements
When ready, provide:
- Professional bio (300-500 words)
- Project descriptions (100-200 words each)
- Skill proficiency levels
- Professional photo
- Project screenshots/demos
- Resume/CV PDF file (store in /assets/docs/cv.pdf)
- Social media links

---

## 11. Testing Checklist

### 11.1 Functionality
- [ ] All links work correctly
- [ ] Forms submit successfully
- [ ] Theme switcher works
- [ ] Language toggle works
- [ ] Animations run smoothly
- [ ] Search/filters work

### 11.2 Responsiveness
- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Landscape orientation
- [ ] High DPI displays

### 11.3 Cross-browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### 11.4 Performance
- [ ] PageSpeed Insights score > 90
- [ ] Images optimized
- [ ] CSS/JS minified
- [ ] Fast initial load

### 11.5 Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader tested
- [ ] Color contrast passes
- [ ] Focus indicators visible
- [ ] Alt text present


---

## 13. Resources & References

### 13.1 Design Inspiration
- Awwwards.com
- Behance portfolios
- Dribbble shots
- CodePen demos

### 13.2 Technical Resources
- MDN Web Docs
- CSS-Tricks
- Web.dev
- A11y Project

### 13.3 Assets
- Google Fonts (Inter)
- Heroicons/Feather Icons
- Unsplash/Pexels (images)
- SVG backgrounds

---

## Remember

✅ **Do's**:
- Keep it simple and clean
- Focus on performance
- Make regular commits
- Test on real devices
- Prioritize content
- Ensure accessibility

❌ **Don'ts**:
- Over-engineer solutions
- Add unnecessary features
- Use heavy libraries
- Forget mobile users
- Skip testing
- Ignore accessibility