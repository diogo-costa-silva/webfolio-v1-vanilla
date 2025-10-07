// Projects Module

import { getCurrentLanguage } from './language.js';
import { getRecentProjects, enrichProjectsWithGitHubData } from './github-api.js';

let translations = {};
let allProjects = []; // Store all projects for filtering
let filtersInitialized = false; // Prevent duplicate event listeners

// Multi-filter state
const filterState = {
    categories: [],      // multi-select
    statuses: [],        // multi-select
    technologies: [],    // multi-select
    realOnly: false,     // toggle
    searchTerm: ''       // search input
};

// Technology to DevIcon mapping
const techIconMap = {
    'Python': 'devicon-python-plain colored',
    'JavaScript': 'devicon-javascript-plain colored',
    'React': 'devicon-react-original colored',
    'Vue.js': 'devicon-vuejs-plain colored',
    'Node.js': 'devicon-nodejs-plain colored',
    'Docker': 'devicon-docker-plain colored',
    'Kubernetes': 'devicon-kubernetes-plain colored',
    'Go': 'devicon-go-original-wordmark colored',
    'PostgreSQL': 'devicon-postgresql-plain colored',
    'MongoDB': 'devicon-mongodb-plain colored',
    'Redis': 'devicon-redis-plain colored',
    'AWS': 'devicon-amazonwebservices-plain-wordmark colored',
    'Azure': 'devicon-azure-plain colored',
    'Terraform': 'devicon-terraform-plain colored',
    'Ansible': 'devicon-ansible-plain colored',
    'Git': 'devicon-git-plain colored',
    'GitHub Actions': 'devicon-github-original colored',
    'TypeScript': 'devicon-typescript-plain colored',
    'HTML': 'devicon-html5-plain colored',
    'CSS': 'devicon-css3-plain colored',
    'FastAPI': 'devicon-fastapi-plain colored',
    'Flask': 'devicon-flask-original colored',
    'Express': 'devicon-express-original colored',
    'Next.js': 'devicon-nextjs-original colored',
    'TensorFlow': 'devicon-tensorflow-original colored',
    'Tailwind CSS': 'devicon-tailwindcss-plain colored',
    'Firebase': 'devicon-firebase-plain colored',
    'MySQL': 'devicon-mysql-plain colored',
    'Pandas': 'devicon-pandas-plain colored',
    'Jupyter': 'devicon-jupyter-plain colored',
    'Streamlit': 'devicon-streamlit-plain colored',
    'Selenium': 'devicon-selenium-original colored',
    'Flutter': 'devicon-flutter-plain colored',
    'React Native': 'devicon-react-original colored',
    'Prisma': 'devicon-prisma-original colored',
    'Grafana': 'devicon-grafana-original colored',
    'Prometheus': 'devicon-prometheus-original colored',
    'Scikit-learn': 'devicon-scikitlearn-plain colored',
    'Plotly': 'devicon-plotly-plain colored',
    'Matplotlib': 'devicon-matplotlib-plain colored',
    'Seaborn': 'devicon-python-plain colored', // Fallback to Python
    'Dash': 'devicon-plotly-plain colored', // Dash é da Plotly
    'Prophet': 'devicon-python-plain colored',
    'yFinance': 'devicon-python-plain colored',
    'Spotify API': 'devicon-spotify-plain colored',
    'SQL': 'devicon-mysql-plain colored',
    'SQLite': 'devicon-sqlite-plain colored',
    'EmailJS': 'devicon-javascript-plain colored',
    'Prism.js': 'devicon-javascript-plain colored',
    'CodeMirror': 'devicon-javascript-plain colored',
    'Marked.js': 'devicon-markdown-original colored',
    'JWT': 'devicon-nodejs-plain colored',
    'Gin': 'devicon-go-original-wordmark colored',
    'PowerShell': 'devicon-powershell-plain colored',
    'Databricks': 'devicon-apacheairflow-plain colored', // Similar concept
    'YAML': 'devicon-yaml-plain colored',
    'Bash': 'devicon-bash-plain colored',
    'Expo': 'devicon-react-original colored',
    'AsyncStorage': 'devicon-react-original colored',
    'Dart': 'devicon-dart-plain colored',
    'Redux': 'devicon-redux-original colored',
    'Watchdog': 'devicon-python-plain colored',
    'PyQt5': 'devicon-qt-original colored',
    'BeautifulSoup': 'devicon-python-plain colored',
    'Scrapy': 'devicon-python-plain colored',
    'Schedule': 'devicon-python-plain colored',
    'CloudFormation': 'devicon-amazonwebservices-plain-wordmark colored',
    'OpenWeather API': 'devicon-javascript-plain colored',
    'DnD Kit': 'devicon-react-original colored',
    'Cron': 'devicon-linux-plain colored',
    'SMTP': 'devicon-nodejs-plain colored',
    'Provider': 'devicon-flutter-plain colored'
};

/**
 * Gets the DevIcon class for a technology
 * @param {string} tech - Technology name
 * @returns {string} - DevIcon CSS class
 */
function getTechIcon(tech) {
    return techIconMap[tech] || 'devicon-devicon-plain';
}

// Category to emoji icon mapping
const categoryIconMap = {
    'data-science': '📊',
    'machine-learning': '🤖',
    'web-dev': '🌐',
    'backend': '⚙️',
    'devops': '☁️',
    'automation': '🔄',
    'mobile': '📱'
};

/**
 * Gets the emoji icon for a category
 * @param {string} category - Category slug
 * @returns {string} - Emoji icon
 */
function getCategoryIcon(category) {
    return categoryIconMap[category] || '📁';
}

/**
 * Formats a date as relative time (e.g., "2 days ago", "3 months ago")
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted relative time string
 */
function formatRelativeDate(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) return translations['projects.github.justNow'] || 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return translations['projects.github.today'] || 'Today';
    if (diffDays === 1) return translations['projects.github.yesterday'] || 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${diffYears}y ago`;
}

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

    // Check if we're on homepage
    const isHomepage = !window.location.pathname.includes('projects.html');

    // Add loading state for homepage
    if (isHomepage) {
        projectsGrid.classList.add('loading');
    }

    try {
        // Try to load from JSON
        const response = await fetch('/data/projects.json');
        const data = await response.json();

        if (isHomepage) {
            // Homepage: fetch 6 most recent projects from GitHub API
            console.log('Loading recent projects for homepage...');
            const recentProjects = await getRecentProjects(data.projects, 6);
            projectsGrid.classList.remove('loading');
            renderProjects(recentProjects, projectsGrid);
        } else {
            // Projects page: enrich all projects with GitHub data and show them
            console.log('Loading all projects for projects page...');
            projectsGrid.classList.add('loading');
            const enrichedProjects = await enrichProjectsWithGitHubData(data.projects);
            projectsGrid.classList.remove('loading');
            renderProjects(enrichedProjects, projectsGrid);
        }
    } catch (error) {
        // Fallback to inline data
        console.log('Loading inline projects data');
        projectsGrid.classList.remove('loading');
        renderProjects(getInlineProjects(), projectsGrid);
    }

    return Promise.resolve(); // Ensure promise is returned
}

function getCategoryDisplayName(category) {
    const categoryMap = {
        'data-science': 'category.dataScience',
        'machine-learning': 'category.machineLearning',
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
        allProjects = projects; // Store for filtering
    } else {
        // Homepage - projects already filtered by getRecentProjects() to 6
        projectsToShow = projects;
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

        // Prepare data attributes for filtering
        const techList = techs.join(',');

        return `
        <div class="project-card"
             data-category="${project.category}"
             data-status="${project.status}"
             data-difficulty="${project.difficulty}"
             data-real="${project.isReal || false}"
             data-technologies="${techList}">
            <div class="project-card__image-wrapper">
                <img src="${project.image}" alt="${projectTitle}" class="project-card__image" loading="lazy">
                ${statusBadge ? `<div class="project-card__status">${statusBadge}</div>` : ''}
            </div>
            <div class="project-card__content">
                <div class="project-card__header">
                    <span class="project-card__category">
                        <span class="category-icon">${getCategoryIcon(project.category)}</span>
                        <span>${categoryDisplayName}</span>
                    </span>
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
                ${project.isReal && project.github && project.github !== '#' && (project.stars !== undefined || project.lastCommitDate) ? `
                <div class="project-card__github-stats">
                    ${project.stars !== undefined ? `
                    <span class="github-stat" title="${project.stars} stars">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                        </svg>
                        <span>${project.stars}</span>
                    </span>
                    ` : ''}
                    ${project.lastCommitDate ? `
                    <span class="github-stat github-stat--time" title="Last commit: ${new Date(project.lastCommitDate).toLocaleDateString()}">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm7-3.25v3.5l3 1.5a.75.75 0 01-.75 1.3l-3.5-1.75A.75.75 0 017 8.5v-3.75a.75.75 0 011.5 0z"/>
                        </svg>
                        <span>${formatRelativeDate(project.lastCommitDate)}</span>
                    </span>
                    ` : ''}
                </div>
                ` : ''}
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
    // Prevent duplicate initialization
    if (filtersInitialized) {
        return;
    }

    // Only run on projects page
    if (!window.location.pathname.includes('projects.html')) return;

    const searchInput = document.getElementById('projectSearch');
    if (!searchInput) return;

    filtersInitialized = true; // Mark as initialized

    // 1. Initialize dropdown toggles
    initDropdownToggles();

    // 2. Category dropdown items
    const categoryItems = document.querySelectorAll('#categoryMenu [data-filter]');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.filter;

            if (category === 'all') {
                filterState.categories = [];
                categoryItems.forEach(btn => btn.classList.remove('active'));
                item.classList.add('active');
            } else {
                // Remove 'all' if active
                categoryItems.forEach(btn => {
                    if (btn.dataset.filter === 'all') btn.classList.remove('active');
                });

                // Toggle this category
                item.classList.toggle('active');
                const index = filterState.categories.indexOf(category);
                if (index > -1) {
                    filterState.categories.splice(index, 1);
                } else {
                    filterState.categories.push(category);
                }

                // If no categories selected, activate 'all'
                if (filterState.categories.length === 0) {
                    categoryItems.forEach(btn => {
                        if (btn.dataset.filter === 'all') btn.classList.add('active');
                    });
                }
            }

            updateDropdownValue('categoryDropdown', category === 'all' ? 'All' : getCategoryDisplayName(category));
            applyFilters();
        });
    });

    // 3. Status dropdown items
    const statusItems = document.querySelectorAll('#statusMenu [data-status]');
    statusItems.forEach(item => {
        item.addEventListener('click', () => {
            const status = item.dataset.status;

            if (status === 'all') {
                filterState.statuses = [];
                statusItems.forEach(btn => btn.classList.remove('active'));
                item.classList.add('active');
            } else {
                // Remove 'all' if active
                statusItems.forEach(btn => {
                    if (btn.dataset.status === 'all') btn.classList.remove('active');
                });

                // Toggle this status
                item.classList.toggle('active');
                const index = filterState.statuses.indexOf(status);
                if (index > -1) {
                    filterState.statuses.splice(index, 1);
                } else {
                    filterState.statuses.push(status);
                }

                // If no statuses selected, activate 'all'
                if (filterState.statuses.length === 0) {
                    statusItems.forEach(btn => {
                        if (btn.dataset.status === 'all') btn.classList.add('active');
                    });
                }
            }

            const displayText = status === 'all' ? 'All' : translations[`projects.filter.${status}`] || status;
            updateDropdownValue('statusDropdown', displayText);
            applyFilters();
        });
    });

    // 4. Technology dropdown (will be populated)
    populateTechDropdown();

    // 5. Real/Demo toggle
    const realToggle = document.getElementById('realOnlyToggle');
    if (realToggle) {
        realToggle.addEventListener('change', (e) => {
            filterState.realOnly = e.target.checked;
            applyFilters();
        });
    }

    // 6. Search input
    searchInput.addEventListener('input', (e) => {
        filterState.searchTerm = e.target.value.toLowerCase();
        applyFilters();
    });

    // 7. Clear all filters button
    const clearAllBtn = document.getElementById('clearAllFilters');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllFilters);
    }
}

// Helper function to initialize dropdown toggles
function initDropdownToggles() {
    const dropdowns = document.querySelectorAll('.filter-dropdown');

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.filter-dropdown__trigger');
        const menu = dropdown.querySelector('.filter-dropdown__menu');

        if (!trigger || !menu) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();

            // Close other dropdowns
            document.querySelectorAll('.filter-dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('open');
                    d.querySelector('.filter-dropdown__menu')?.classList.remove('open');
                }
            });

            // Toggle this dropdown
            dropdown.classList.toggle('open');
            menu.classList.toggle('open');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-dropdown')) {
            document.querySelectorAll('.filter-dropdown').forEach(d => {
                d.classList.remove('open');
                d.querySelector('.filter-dropdown__menu')?.classList.remove('open');
            });
        }
    });
}

// Helper function to update dropdown display value
function updateDropdownValue(dropdownId, value) {
    const trigger = document.getElementById(dropdownId);
    if (!trigger) return;

    const valueSpan = trigger.querySelector('.filter-dropdown__value');
    if (valueSpan) {
        valueSpan.textContent = value;
    }
}

// Helper placeholder (keep existing mobile swipe code)
function initMobileSwipe() {
    const filterContainer = document.querySelector('.filters__bar');
    if (filterContainer && window.innerWidth <= 768) {
        checkScrollIndicator(filterContainer);
        filterContainer.addEventListener('scroll', () => {
            checkScrollIndicator(filterContainer);
        });
    }

    // Initial counts
    updateAllCounts();
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

// Main filtering function with AND logic
function applyFilters() {
    const projectCards = document.querySelectorAll('.project-card');
    let visibleCount = 0;

    projectCards.forEach(card => {
        const category = card.dataset.category;
        const status = card.dataset.status;
        const isReal = card.dataset.real === 'true';
        const cardTechs = card.dataset.technologies ? card.dataset.technologies.split(',') : [];
        const title = card.querySelector('.project-card__title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.project-card__description')?.textContent.toLowerCase() || '';

        // Check all filter conditions (AND logic)
        const matchesCategory = filterState.categories.length === 0 ||
            filterState.categories.includes(category);

        const matchesStatus = filterState.statuses.length === 0 ||
            filterState.statuses.includes(status);

        const matchesTech = filterState.technologies.length === 0 ||
            filterState.technologies.some(tech => cardTechs.includes(tech));

        const matchesReal = !filterState.realOnly || isReal;

        const matchesSearch = filterState.searchTerm === '' ||
            title.includes(filterState.searchTerm) ||
            description.includes(filterState.searchTerm);

        // Show/hide card based on ALL conditions
        if (matchesCategory && matchesStatus && matchesTech && matchesReal && matchesSearch) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Update results count
    updateResultsCount(visibleCount);

    // Update applied filters UI
    updateAppliedFilters();

    // Update counts
    updateAllCounts();
}

// Update results counter in search bar
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const projectWord = count === 1 ? 'project' : 'projects';
        const newText = `${count} ${projectWord}`;

        // Only animate if the count changed
        if (resultsCount.textContent !== newText) {
            resultsCount.classList.add('filters__results-count--updating');
            resultsCount.textContent = newText;

            // Remove animation class after animation completes
            setTimeout(() => {
                resultsCount.classList.remove('filters__results-count--updating');
            }, 400);
        }
    }
}

// Populate technology dropdown from projects
function populateTechDropdown() {
    if (allProjects.length === 0) return;

    const techMenu = document.getElementById('techMenu');
    if (!techMenu) return;

    // Extract all unique technologies
    const techSet = new Set();
    const techCount = {};

    allProjects.forEach(project => {
        (project.technologies || []).forEach(tech => {
            techSet.add(tech);
            techCount[tech] = (techCount[tech] || 0) + 1;
        });
    });

    // Sort by count (descending), then alphabetically
    const sortedTechs = Array.from(techSet).sort((a, b) => {
        const countDiff = techCount[b] - techCount[a];
        return countDiff !== 0 ? countDiff : a.localeCompare(b);
    });

    // Generate checkboxes with icons
    techMenu.innerHTML = sortedTechs.map(tech => `
        <label class="tech-filter-item">
            <input type="checkbox" value="${tech}">
            <i class="${getTechIcon(tech)}"></i>
            <span class="tech-filter-name">${tech}</span>
            <span class="filter-count">(${techCount[tech]})</span>
        </label>
    `).join('');

    // Add change handlers
    techMenu.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const tech = e.target.value;
            if (e.target.checked) {
                if (!filterState.technologies.includes(tech)) {
                    filterState.technologies.push(tech);
                }
            } else {
                const index = filterState.technologies.indexOf(tech);
                if (index > -1) {
                    filterState.technologies.splice(index, 1);
                }
            }
            updateTechDropdownValue();
            applyFilters();
        }
    });
}

// Update tech dropdown display value
function updateTechDropdownValue() {
    const count = filterState.technologies.length;
    const trigger = document.getElementById('techDropdown');

    if (trigger) {
        const valueSpan = trigger.querySelector('.filter-dropdown__value');
        if (valueSpan) {
            if (count === 0) {
                valueSpan.textContent = translations['projects.filter.selectTech'] || 'Select';
            } else if (count === 1) {
                valueSpan.textContent = filterState.technologies[0];
            } else {
                valueSpan.textContent = `${count} selected`;
            }
        }
    }
}

// Update applied filters chips
function updateAppliedFilters() {
    const appliedSection = document.getElementById('appliedFilters');
    const chipsContainer = document.getElementById('filterChips');

    if (!appliedSection || !chipsContainer) return;

    const chips = [];

    // Add category chips
    filterState.categories.forEach(cat => {
        const displayName = getCategoryDisplayName(cat);
        chips.push({ type: 'category', value: cat, label: displayName });
    });

    // Add status chips
    filterState.statuses.forEach(status => {
        const label = translations[`projects.filter.${status === 'completed' ? 'done' : status === 'in-progress' ? 'inProgress' : 'planned'}`] || status;
        chips.push({ type: 'status', value: status, label });
    });

    // Add technology chips
    filterState.technologies.forEach(tech => {
        chips.push({ type: 'technology', value: tech, label: tech });
    });

    // Add real only chip
    if (filterState.realOnly) {
        const label = translations['projects.filter.realOnly'] || 'Real Projects Only';
        chips.push({ type: 'realOnly', value: 'true', label });
    }

    // Add search chip
    if (filterState.searchTerm) {
        chips.push({ type: 'search', value: filterState.searchTerm, label: `Search: "${filterState.searchTerm}"` });
    }

    // Show/hide section
    if (chips.length > 0) {
        appliedSection.style.display = 'flex';
        chipsContainer.innerHTML = chips.map(chip => `
            <div class="filter-chip">
                <span>${chip.label}</span>
                <button class="filter-chip__remove" data-type="${chip.type}" data-value="${chip.value}">
                    ×
                </button>
            </div>
        `).join('');

        // Add remove handlers
        chipsContainer.querySelectorAll('.filter-chip__remove').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFilter(btn.dataset.type, btn.dataset.value);
            });
        });
    } else {
        appliedSection.style.display = 'none';
    }
}

// Remove individual filter
function removeFilter(type, value) {
    switch (type) {
        case 'category':
            const catIndex = filterState.categories.indexOf(value);
            if (catIndex > -1) filterState.categories.splice(catIndex, 1);
            // Update UI
            document.querySelectorAll('[data-filter]').forEach(btn => {
                if (btn.dataset.filter === value) btn.classList.remove('active');
                if (btn.dataset.filter === 'all' && filterState.categories.length === 0) {
                    btn.classList.add('active');
                }
            });
            break;
        case 'status':
            const statusIndex = filterState.statuses.indexOf(value);
            if (statusIndex > -1) filterState.statuses.splice(statusIndex, 1);
            // Update UI
            document.querySelectorAll('[data-status]').forEach(btn => {
                if (btn.dataset.status === value) btn.classList.remove('active');
                if (btn.dataset.status === 'all' && filterState.statuses.length === 0) {
                    btn.classList.add('active');
                }
            });
            break;
        case 'technology':
            const techIndex = filterState.technologies.indexOf(value);
            if (techIndex > -1) filterState.technologies.splice(techIndex, 1);
            // Update UI
            const checkbox = document.querySelector(`#techFilterDropdown input[value="${value}"]`);
            if (checkbox) checkbox.checked = false;
            updateTechCount();
            break;
        case 'realOnly':
            filterState.realOnly = false;
            const toggle = document.getElementById('realOnlyToggle');
            if (toggle) toggle.checked = false;
            break;
        case 'search':
            filterState.searchTerm = '';
            const searchInput = document.querySelector('.filters__search');
            if (searchInput) searchInput.value = '';
            break;
    }

    applyFilters();
}

// Clear all filters
function clearAllFilters() {
    // Reset state
    filterState.categories = [];
    filterState.statuses = [];
    filterState.technologies = [];
    filterState.realOnly = false;
    filterState.searchTerm = '';

    // Reset UI
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all');
    });

    document.querySelectorAll('[data-status]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === 'all');
    });

    document.querySelectorAll('#techFilterDropdown input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    const realToggle = document.getElementById('realOnlyToggle');
    if (realToggle) realToggle.checked = false;

    const searchInput = document.querySelector('.filters__search');
    if (searchInput) searchInput.value = '';

    updateTechCount();
    applyFilters();
}

// Update all filter counts
function updateAllCounts() {
    const visibleCards = document.querySelectorAll('.project-card[style=""], .project-card:not([style*="display: none"])');
    const visibleProjects = Array.from(visibleCards).map(card => {
        return {
            category: card.dataset.category,
            status: card.dataset.status
        };
    });

    // Update category counts
    document.querySelectorAll('[data-filter]').forEach(btn => {
        const filter = btn.dataset.filter;
        const countSpan = btn.querySelector('.filter-count');

        if (countSpan) {
            let count = 0;
            if (filter === 'all') {
                count = visibleProjects.length;
            } else {
                count = visibleProjects.filter(p => p.category === filter).length;
            }
            countSpan.textContent = ` (${count})`;
        }
    });

    // Update status counts
    document.querySelectorAll('[data-status]').forEach(btn => {
        const status = btn.dataset.status;
        const countSpan = btn.querySelector('.filter-count');

        if (countSpan) {
            let count = 0;
            if (status === 'all') {
                count = visibleProjects.length;
            } else {
                count = visibleProjects.filter(p => p.status === status).length;
            }
            countSpan.textContent = ` (${count})`;
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