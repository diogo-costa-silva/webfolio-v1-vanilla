// Main Application Module
import { initHeader } from './navigation.js';
import { initFooter } from './footer.js';
import { initColor } from './color.js';
import { initTheme } from './theme.js';
import { initLanguage } from './language.js';
import { initAnimations } from './animations.js';
import { initHero } from './hero.js';
import { initProjects } from './projects.js';
import { initContact } from './contact.js';
import { initSkills } from './skills.js';
import { initTestimonials } from './testimonials.js';
import { initBackToTop } from './back-to-top.js';
import { initModals } from './modal.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize features
        initColor();
        initTheme();
        initLanguage();
        initHeader();
        initFooter();
        initAnimations();
        initBackToTop();
        initModals();

        // Initialize page-specific features
        const currentPage = getCurrentPage();
        initPageSpecific(currentPage);

        // Mark page as ready
        document.body.classList.add('loaded');

    } catch (error) {
        console.error('Error initializing application:', error);
    }
});

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
}