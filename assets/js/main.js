// Main Application Module
import { initHeader } from './navigation.js';
import { initFooter } from './footer.js';
import { initTheme } from './theme.js';
import { initLanguage } from './language.js';
import { initAnimations } from './animations.js';
import { initHero } from './hero.js';
import { initProjects } from './projects.js';
import { initContact } from './contact.js';
import { initSkills } from './skills.js';
import { initTestimonials } from './testimonials.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load global components
        await loadGlobalComponents();

        // Initialize features
        initTheme();
        initLanguage();
        initHeader();
        initFooter();
        initAnimations();

        // Initialize page-specific features
        const currentPage = getCurrentPage();
        initPageSpecific(currentPage);

        // Mark page as ready
        document.body.classList.add('loaded');

    } catch (error) {
        console.error('Error initializing application:', error);
    }
});

// Load header and footer components
async function loadGlobalComponents() {
    // Load header
    const headerElement = document.getElementById('header');
    if (headerElement) {
        headerElement.innerHTML = getHeaderHTML();

        // Add progress bar as a separate element after header
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.id = 'progressBar';
        document.body.insertBefore(progressBar, document.body.firstChild);
    }

    // Load footer
    const footerElement = document.getElementById('footer');
    if (footerElement) {
        footerElement.innerHTML = getFooterHTML();
    }
}

// Get current page from URL
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page.replace('.html', '');
}

// Initialize page-specific features
function initPageSpecific(page) {
    switch(page) {
        case 'index':
            initHero();
            initSkills();
            initProjects();
            initTestimonials();
            break;
        case 'projects':
            initProjects();
            break;
        case 'contact':
            initContact();
            break;
        case 'skills':
            initSkills();
            break;
    }

    // Mark active nav link
    markActiveNavLink(page);
}

// Mark current page in navigation
function markActiveNavLink(page) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(page)) {
            link.classList.add('nav__link--active');
        } else if (page === 'index' && (href === '/' || href === 'index.html')) {
            link.classList.add('nav__link--active');
        }
    });
}

// Header HTML template
function getHeaderHTML() {
    return `
        <div class="header__container">
            <a href="index.html" class="header__logo">
                <span>DS</span>
            </a>

            <nav class="nav">
                <ul class="nav__list">
                    <li><a href="index.html" class="nav__link" data-i18n="nav.home">Home</a></li>
                    <li><a href="about.html" class="nav__link" data-i18n="nav.about">About</a></li>
                    <li><a href="skills.html" class="nav__link" data-i18n="nav.skills">Skills</a></li>
                    <li><a href="projects.html" class="nav__link" data-i18n="nav.projects">Projects</a></li>
                    <li><a href="resume.html" class="nav__link" data-i18n="nav.resume">Resume</a></li>
                    <li><a href="contact.html" class="nav__link" data-i18n="nav.contact">Contact</a></li>
                </ul>
            </nav>

            <div class="header__controls">
                <button class="header__button" id="languageToggle" aria-label="Toggle language">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                </button>

                <button class="header__button" id="themeToggle" aria-label="Toggle theme">
                    <svg class="theme-icon theme-icon--light" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5"/>
                        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                    </svg>
                    <svg class="theme-icon theme-icon--dark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                </button>

                <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                    <span class="mobile-menu-toggle__icon"></span>
                </button>
            </div>
        </div>

        <!-- Mobile navigation -->
        <nav class="nav--mobile" id="mobileNav">
            <ul class="nav__list">
                <li><a href="index.html" class="nav__link" data-i18n="nav.home">Home</a></li>
                <li><a href="about.html" class="nav__link" data-i18n="nav.about">About</a></li>
                <li><a href="skills.html" class="nav__link" data-i18n="nav.skills">Skills</a></li>
                <li><a href="projects.html" class="nav__link" data-i18n="nav.projects">Projects</a></li>
                <li><a href="resume.html" class="nav__link" data-i18n="nav.resume">Resume</a></li>
                <li><a href="contact.html" class="nav__link" data-i18n="nav.contact">Contact</a></li>
            </ul>
        </nav>
    `;
}

// Footer HTML template
function getFooterHTML() {
    return `
        <div class="footer__container">
            <div class="footer__content">
                <div class="footer__brand">
                    <div class="footer__logo">Diogo Silva</div>
                    <p class="footer__tagline">Platform Engineer building robust infrastructure solutions</p>
                    <div class="social-links">
                        <a href="https://github.com/diogo-costa-silva" target="_blank" aria-label="GitHub">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                        <a href="https://linkedin.com/in/diogo-costa-e-silva" target="_blank" aria-label="LinkedIn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                        </a>
                        <a href="https://twitter.com/diogo_c_silva" target="_blank" aria-label="Twitter">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <div class="footer__section">
                    <h3 class="footer__title" data-i18n="footer.quickLinks">Quick Links</h3>
                    <div class="footer__links">
                        <a href="index.html" class="footer__link" data-i18n="nav.home">Home</a>
                        <a href="about.html" class="footer__link" data-i18n="nav.about">About</a>
                        <a href="projects.html" class="footer__link" data-i18n="nav.projects">Projects</a>
                        <a href="contact.html" class="footer__link" data-i18n="nav.contact">Contact</a>
                    </div>
                </div>

                <div class="footer__section">
                    <h3 class="footer__title" data-i18n="footer.connect">Connect</h3>
                    <div class="footer__links">
                        <a href="mailto:dccsilva98@gmail.com" class="footer__link">dccsilva98@gmail.com</a>
                        <span class="footer__link">Porto/Maia, Portugal</span>
                    </div>
                </div>
            </div>

            <div class="footer__bottom">
                <p>&copy; ${new Date().getFullYear()} Diogo Silva. <span data-i18n="footer.rights">All rights reserved</span>.</p>
            </div>
        </div>
    `;
}