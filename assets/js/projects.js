// Projects Module

import { getCurrentLanguage } from './language.js';

let translations = {};

export function initProjects() {
    loadTranslationsAndProjects();

    // Listen for language changes and re-render
    window.addEventListener('languageChanged', async () => {
        await loadTranslationsAndProjects();
    });
}

async function loadTranslationsAndProjects() {
    try {
        const response = await fetch('/data/translations.json');
        const data = await response.json();
        const currentLang = getCurrentLanguage();
        translations = data[currentLang] || data['en'];
    } catch (error) {
        console.error('Error loading translations:', error);
        translations = {};
    }

    await loadProjects();
    // Initialize filters after projects are loaded
    initProjectFilters();
}

async function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid') || document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    try {
        // Try to load from JSON
        const response = await fetch('/data/projects.json');
        const data = await response.json();
        renderProjects(data.projects, projectsGrid);
    } catch (error) {
        // Fallback to inline data
        console.log('Loading inline projects data');
        renderProjects(getInlineProjects(), projectsGrid);
    }

    return Promise.resolve(); // Ensure promise is returned
}

function getCategoryDisplayName(category) {
    const categoryMap = {
        'data-science': 'category.dataScience',
        'web-dev': 'category.webDev',
        'backend': 'category.backend',
        'devops': 'category.devops',
        'automation': 'category.automation',
        'mobile': 'category.mobile'
    };

    const key = categoryMap[category];
    return key ? (translations[key] || category) : category;
}

function getStatusBadge(status, isReal) {
    const statusText = {
        'completed': isReal ? translations['status.real'] || 'REAL' : translations['status.completed'] || 'COMPLETED',
        'in-progress': translations['status.inProgress'] || 'IN PROGRESS',
        'planned': translations['status.planned'] || 'PLANNED'
    };

    const badges = {
        'completed': `<span class="badge badge--success">${statusText['completed']}</span>`,
        'in-progress': `<span class="badge badge--warning">${statusText['in-progress']}</span>`,
        'planned': `<span class="badge badge--info">${statusText['planned']}</span>`
    };
    return badges[status] || '';
}

function getDifficultyIndicator(difficulty) {
    const levels = {
        'novice': 1,
        'beginner': 2,
        'intermediate': 3,
        'advanced': 4,
        'expert': 5
    };

    const dots = '●'.repeat(levels[difficulty] || 0);
    return `<span class="difficulty difficulty--${difficulty}">${dots}</span>`;
}

function renderProjects(projects, container) {
    // Determine if we're on the projects page
    const isProjectsPage = window.location.pathname.includes('projects.html');

    // Filter projects based on page
    let projectsToShow;
    if (isProjectsPage) {
        // Projects page - show all projects
        projectsToShow = projects;
    } else {
        // Homepage - show only featured projects (max 6)
        projectsToShow = projects.filter(p => p.featured).slice(0, 6);
    }

    // Render projects with improved structure
    container.innerHTML = projectsToShow.map(project => {
        const categoryDisplayName = getCategoryDisplayName(project.category);
        const statusBadge = getStatusBadge(project.status, project.isReal);
        const difficultyIndicator = getDifficultyIndicator(project.difficulty);
        const techs = project.technologies || project.tags || [];

        // Get translated title and description
        const titleKey = `project.${project.id}.title`;
        const descriptionKey = `project.${project.id}.description`;
        const projectTitle = translations[titleKey] || project.title;
        const projectDescription = translations[descriptionKey] || project.description;

        // Get translated button labels
        const demoLabel = translations['buttons.demo'] || 'Demo';
        const codeLabel = translations['buttons.code'] || 'Code';
        const soonLabel = translations['buttons.soon'] || 'Soon';

        return `
        <div class="project-card" data-category="${project.category}" data-status="${project.status}" data-difficulty="${project.difficulty}">
            <div class="project-card__image-wrapper">
                <img src="${project.image}" alt="${projectTitle}" class="project-card__image" loading="lazy">
                ${statusBadge ? `<div class="project-card__status">${statusBadge}</div>` : ''}
            </div>
            <div class="project-card__content">
                <div class="project-card__header">
                    <span class="project-card__category">${categoryDisplayName}</span>
                    ${difficultyIndicator}
                </div>
                <h3 class="project-card__title">${projectTitle}</h3>
                <p class="project-card__description">${projectDescription}</p>
                <div class="project-card__tags">
                    ${techs.slice(0, 3).map(tag => `<span class="project-card__tag">${tag}</span>`).join('')}
                </div>
                <div class="project-card__actions">
                    ${project.demo !== '#' ? `<a href="${project.demo}" class="btn btn--secondary" target="_blank" aria-label="View live demo">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span>${demoLabel}</span>
                    </a>` : ''}
                    ${project.github !== '#' ? `<a href="${project.github}" class="btn btn--primary" target="_blank" aria-label="View on GitHub">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>${codeLabel}</span>
                    </a>` : `<button class="btn btn--ghost" disabled>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>${soonLabel}</span>
                    </button>`}
                </div>
            </div>
        </div>
        `}).join('');

    // Update project counts after rendering
    if (isProjectsPage) {
        updateProjectCounts(projects);
    }
}

function updateProjectCounts(allProjects) {
    const filterButtons = document.querySelectorAll('[data-filter]');

    filterButtons.forEach(button => {
        const filter = button.dataset.filter;
        const countSpan = button.querySelector('.filter-count');

        if (countSpan) {
            let count = 0;
            if (filter === 'all') {
                count = allProjects.length;
            } else {
                count = allProjects.filter(p => p.category === filter).length;
            }
            countSpan.textContent = ` (${count})`;
        }
    });
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const filterContainer = document.querySelector('.filters__tags');
    const searchInput = document.querySelector('.filters__search');

    if (!filterButtons.length) return;

    // Initialize search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterProjects(searchTerm);
        });
    }

    // Add swipe indicator for mobile
    if (filterContainer && window.innerWidth <= 768) {
        checkScrollIndicator(filterContainer);
        filterContainer.addEventListener('scroll', () => {
            checkScrollIndicator(filterContainer);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Get fresh list of project cards each time
            const projectCards = document.querySelectorAll('.project-card');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Scroll active button into view on mobile
            if (window.innerWidth <= 768) {
                button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }

            // Use the unified filter function
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            filterProjects(searchTerm);
        });
    });
}

function checkScrollIndicator(container) {
    const isScrollable = container.scrollWidth > container.clientWidth;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;

    if (isScrollable && !isAtEnd) {
        container.classList.add('has-scroll');
    } else {
        container.classList.remove('has-scroll');
    }
}

function filterProjects(searchTerm = '') {
    const projectCards = document.querySelectorAll('.project-card');
    const activeFilter = document.querySelector('.filter-tag.active');
    const activeCategory = activeFilter ? activeFilter.dataset.filter : 'all';

    projectCards.forEach(card => {
        const title = card.querySelector('.project-card__title').textContent.toLowerCase();
        const description = card.querySelector('.project-card__description').textContent.toLowerCase();
        const category = card.dataset.category;

        // Check category filter
        const matchesCategory = activeCategory === 'all' || category === activeCategory;

        // Check search term
        const matchesSearch = searchTerm === '' ||
            title.includes(searchTerm) ||
            description.includes(searchTerm);

        // Show/hide based on both filters
        if (matchesCategory && matchesSearch) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Inline fallback data - minimal set for emergency fallback
function getInlineProjects() {
    return [
        {
            id: 1,
            title: 'MotoGP Analytics Dashboard',
            category: 'data-science',
            description: 'Interactive dashboard analyzing MotoGP race data, lap times, and rider performance using Python and Jupyter notebooks.',
            technologies: ['Python', 'Jupyter', 'Pandas', 'Plotly'],
            status: 'completed',
            difficulty: 'intermediate',
            featured: true,
            github: 'https://github.com/diogo-costa-silva/motogp-analytics',
            demo: '#',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc81?w=800&h=500&fit=crop',
            isReal: true
        },
        {
            id: 2,
            title: 'Portfolio Website v3',
            category: 'web-dev',
            description: 'Modern, responsive portfolio website built with vanilla JavaScript, featuring dark mode and multi-language support.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'EmailJS'],
            status: 'completed',
            difficulty: 'intermediate',
            featured: true,
            github: 'https://github.com/diogo-costa-silva/website-v3',
            demo: 'https://diogo-costa-silva.github.io',
            image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop',
            isReal: true
        },
        {
            id: 3,
            title: 'Azure Infrastructure Automation',
            category: 'devops',
            description: 'Terraform scripts for automated Azure resource provisioning including Databricks, Key Vaults, and networking.',
            technologies: ['Terraform', 'Azure', 'Databricks', 'PowerShell'],
            status: 'completed',
            difficulty: 'advanced',
            featured: true,
            github: '#',
            demo: '#',
            image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop',
            isReal: true
        },
        {
            id: 4,
            title: 'Task Flow',
            category: 'web-dev',
            description: 'Minimalist task management app with drag-and-drop functionality, local storage, and productivity analytics.',
            technologies: ['React', 'TypeScript', 'Tailwind CSS'],
            status: 'planned',
            difficulty: 'intermediate',
            featured: false,
            github: '#',
            demo: '#',
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=500&fit=crop',
            isReal: false
        }
    ];
}