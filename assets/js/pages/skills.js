// Skills Module - Modular and data-driven like projects.js

import { getCurrentLanguage, getTranslationsData } from '../core/language.js';

let translations = {};

export function initSkills() {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSkills);
    } else {
        loadSkills();
    }

    // Listen for language changes and re-render
    window.addEventListener('languageChanged', async () => {
        await loadSkills();
    });
}

async function loadTranslations() {
    try {
        const data = await getTranslationsData();
        const currentLang = getCurrentLanguage();
        translations = data[currentLang] || data['en'];
    } catch (error) {
        console.error('Error loading translations:', error);
        translations = {};
    }
}

async function loadSkills() {
    const skillsGrid = document.querySelector('.skills-grid');
    const categoriesGrid = document.querySelector('.skills-categories__grid');

    if (!skillsGrid && !categoriesGrid) return;

    // Load translations first
    await loadTranslations();

    try {
        // Load from JSON file
        const response = await fetch('/data/skills.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (skillsGrid) {
            renderHomepageSkills(data.categories, skillsGrid);
        }

        if (categoriesGrid) {
            renderSkillsPage(data.categories, categoriesGrid);
            initSkillInteractions();
        }
    } catch (error) {
        console.error('Error loading skills:', error);
        const msg = translations['skills.loadError'] || "Couldn't load skills. Please try again later.";
        if (skillsGrid) skillsGrid.innerHTML = `<p class="grid-message">${msg}</p>`;
        if (categoriesGrid) categoriesGrid.innerHTML = `<p class="grid-message">${msg}</p>`;
    }
}

function renderHomepageSkills(categories, container) {
    // Render category preview cards instead of individual skills
    const categoryCardsHTML = categories.map(category => {
        // Get all skills - prioritize featured, then add others
        const featuredSkills = category.skills.filter(skill => skill.featured);
        const nonFeaturedSkills = category.skills.filter(skill => !skill.featured);
        const allSkills = [...featuredSkills, ...nonFeaturedSkills];

        // Show only first 5 skills initially
        const skillsToShow = allSkills.slice(0, 5);
        const hasMore = allSkills.length > 5;
        const remainingCount = allSkills.length - 5;

        // Generate DevIcon elements for first 5 skills
        const techIconsHTML = skillsToShow
            .map(skill => {
                const iconClass = getIconClass(skill.name);
                return `<i class="${iconClass}" data-tech-name="${skill.name}"></i>`;
            })
            .join('');

        // Add invisible placeholders to always have 5 slots (for consistent height)
        const placeholdersNeeded = 5 - skillsToShow.length;
        const placeholdersHTML = placeholdersNeeded > 0
            ? '<i class="skill-icon-placeholder"></i>'.repeat(placeholdersNeeded)
            : '';

        // Generate hidden icons for expansion (skills 6+)
        const hiddenIconsHTML = hasMore
            ? allSkills.slice(5).map(skill => {
                const iconClass = getIconClass(skill.name);
                return `<i class="${iconClass} skill-icon-hidden" data-tech-name="${skill.name}"></i>`;
              }).join('')
            : '';

        // Expand button if category has more than 5 skills
        const expandButton = hasMore
            ? `<button class="skill-expand-btn" aria-label="Ver mais ${remainingCount} tecnologias">
                 <span class="expand-count">+${remainingCount}</span>
               </button>`
            : '';

        // Get translated strings
        const skillsLabel = translations['skills.count'] || 'skills';
        const categoryIndex = categories.indexOf(category) + 1;
        const categoryNameKey = `skills.category.${categoryIndex}.name`;
        const categoryDescKey = `skills.category.${categoryIndex}.description`;
        const categoryName = translations[categoryNameKey] || category.name;
        const categoryDesc = translations[categoryDescKey] || category.description;

        return `
            <div class="category-preview-card" data-category-id="${category.id}">
                <div class="category-preview__header">
                    <span class="category-preview__icon">${category.icon}</span>
                    <div class="category-preview__info">
                        <h3 class="category-preview__title">${categoryName}</h3>
                        <span class="category-preview__count">${category.skills.length} ${skillsLabel}</span>
                    </div>
                </div>
                <p class="category-preview__description">${categoryDesc}</p>
                <div class="category-preview__tech-icons" data-category="${category.id}">
                    ${techIconsHTML}
                    ${placeholdersHTML}
                    ${hiddenIconsHTML}
                    ${expandButton}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = categoryCardsHTML;

    // Add expand/collapse handlers
    container.querySelectorAll('.skill-expand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't trigger card click
            const iconsContainer = btn.closest('.category-preview__tech-icons');
            const card = btn.closest('.category-preview-card');
            const isExpanded = iconsContainer.classList.contains('expanded');

            if (isExpanded) {
                // Collapse
                iconsContainer.classList.remove('expanded');
                card.classList.remove('card-expanded');
                const hiddenCount = iconsContainer.querySelectorAll('.skill-icon-hidden').length;
                btn.querySelector('.expand-count').textContent = `+${hiddenCount}`;
            } else {
                // Expand
                iconsContainer.classList.add('expanded');
                card.classList.add('card-expanded');
                btn.querySelector('.expand-count').textContent = '−';
            }
        });
    });

    // Add click handlers to navigate to skills page
    container.querySelectorAll('.category-preview-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.dataset.categoryId;
            window.location.href = `skills.html#${categoryId}`;
        });
    });
}

function renderSkillsPage(categories, container) {
    if (!categories || categories.length === 0) {
        const noSkillsMessage = translations['messages.noSkills'] || 'No skills data available.';
        container.innerHTML = `<p>${noSkillsMessage}</p>`;
        return;
    }

    const html = categories.map((category, index) => {
        // Get translated category name and description
        const categoryIndex = index + 1;
        const nameKey = `skills.category.${categoryIndex}.name`;
        const descriptionKey = `skills.category.${categoryIndex}.description`;
        const categoryName = translations[nameKey] || category.name;
        const categoryDescription = translations[descriptionKey] || category.description;

        return `
        <div class="skill-category">
            <div class="skill-category__header">
                <span class="skill-category__icon">${category.icon}</span>
                <div class="skill-category__info">
                    <h2 class="skill-category__title">${categoryName}</h2>
                    <p class="skill-category__description">${categoryDescription}</p>
                </div>
            </div>
            <div class="skill-category__skills">
                ${category.skills.map(skill => renderSkillItem(skill)).join('')}
            </div>
        </div>
        `;
    }).join('');

    container.innerHTML = html;
}

function renderSkillItem(skill) {
    const iconClass = getIconClass(skill.name);
    const translatedExperience = translateExperience(skill.experience);

    // Calculate progress percentage (level is 1-5, convert to 0-100%)
    const progressPercentage = (skill.level / 5) * 100;

    // Check if this is a custom SVG icon
    const isCustomIcon = iconClass.startsWith('custom-icon:');
    const iconPath = isCustomIcon ? iconClass.replace('custom-icon:', '') : iconClass;

    // Generate appropriate icon HTML
    const iconHtml = isCustomIcon
        ? `<img src="${iconPath}" class="skill-item__icon skill-item__icon--custom" alt="${skill.name} logo" loading="lazy">`
        : `<i class="skill-item__icon ${iconClass}"></i>`;

    // Store full skill data as JSON for JS access
    const skillData = JSON.stringify({
        name: skill.name,
        icon: iconClass,
        level: skill.level,
        levelLabel: skill.levelLabel || '',
        experience: translatedExperience,
        proficiency: progressPercentage
    });

    return `
        <div class="skill-item"
             data-skill='${skillData}'>
            ${iconHtml}
            <div class="skill-item__content">
                <span class="skill-item__name">${skill.name}</span>
                <div class="skill-item__meta">
                    <div class="skill-item__progress-mini">
                        <div class="skill-item__progress-bar" style="width: ${progressPercentage}%"></div>
                    </div>
                    <span class="skill-item__experience">${translatedExperience}</span>
                </div>
            </div>
        </div>
    `;
}

function translateExperience(experience) {
    if (!experience) return '';

    // Replace "years" with translated version
    const yearsWord = translations['experience.years'] || 'years';
    return experience.replace(/years/gi, yearsWord);
}


function getIconClass(skillName) {
    // Map skill names to icon classes from multiple libraries
    // DevIcon: devicon-*
    // Simple Icons: si si-*
    // Font Awesome: fa-solid fa-*
    const iconMap = {
        // Cloud Platforms & Services
        'Microsoft Azure': 'devicon-azure-plain colored',
        'Azure Data Factory': 'fa-solid fa-diagram-project',
        'Azure Data Lake Storage': 'fa-solid fa-box-archive',

        // Infrastructure as Code & Automation
        'Terraform': 'devicon-terraform-plain colored',
        'Ansible': 'devicon-ansible-plain colored',
        'Bash': 'devicon-bash-plain colored',
        'Linux': 'devicon-linux-plain colored',

        // Big Data Ecosystem
        'Apache Spark/PySpark': 'devicon-apachespark-plain colored',
        'Hadoop': 'devicon-hadoop-plain colored',
        'HDFS': 'custom-icon:assets/icons/custom/hdfs.svg',
        'Hive': 'custom-icon:assets/icons/custom/hive.svg',
        'Cloudera Data Platform': 'si si-cloudera',

        // Databases & Storage
        'PostgreSQL': 'devicon-postgresql-plain colored',
        'MongoDB': 'devicon-mongodb-plain colored',
        'SQL Server': 'devicon-microsoftsqlserver-plain colored',

        // Data Science & Analytics
        'Python': 'devicon-python-plain colored',
        'Pandas': 'devicon-pandas-plain colored',
        'NumPy': 'si si-numpy',
        'Matplotlib': 'devicon-matplotlib-plain colored',
        'Seaborn': 'custom-icon:assets/icons/custom/seaborn.svg',
        'Streamlit': 'devicon-streamlit-plain colored',
        'Jupyter Notebooks': 'devicon-jupyter-plain colored',
        'Scikit-learn': 'devicon-scikitlearn-plain colored',

        // Programming & Development
        'JavaScript': 'devicon-javascript-plain colored',
        'HTML': 'devicon-html5-plain colored',
        'CSS': 'devicon-css3-plain colored',
        'SQL': 'fa-solid fa-database',
        'Node.js': 'devicon-nodejs-plain colored',

        // DevOps & CI/CD
        'Git': 'devicon-git-plain colored',
        'GitHub': 'devicon-github-original colored',
        'GitHub Actions': 'si si-githubactions',
        'Jenkins': 'devicon-jenkins-line colored',
        'Docker': 'devicon-docker-plain colored',
        'Kubernetes': 'devicon-kubernetes-plain colored',

        // APIs & Backend Frameworks
        'FastAPI': 'devicon-fastapi-plain colored',
        'Flask': 'devicon-flask-original colored',
        'REST APIs': 'fa-solid fa-cloud'
    };

    return iconMap[skillName] || 'devicon-code-plain';
}

// Fallback inline data

// ============================================
// Skill Interactions (Modal Only)
// ============================================

let skillModal = null;

// Initialize skill interactions after DOM is ready
let interactionsInitialized = false;

export function initSkillInteractions() {
    if (!document.querySelector('.skills-categories__grid')) return;
    createModalElement();
    if (interactionsInitialized) return;
    interactionsInitialized = true;

    // Event delegation: one listener handles all current and future skill items
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.skill-item');
        if (!item || !item.hasAttribute('data-skill')) return;
        try {
            showSkillModal(JSON.parse(item.getAttribute('data-skill')));
        } catch (err) {
            console.warn('Malformed skill data:', err);
        }
    });

    // Escape closes the modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideSkillModal();
    });
}

function createModalElement() {
    if (skillModal) return; // Already created

    skillModal = document.createElement('div');
    skillModal.className = 'skill-modal';
    skillModal.innerHTML = `
        <div class="skill-modal__content">
            <button class="skill-modal__close" aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <div class="skill-modal__header">
                <i class="skill-modal__icon"></i>
                <h3 class="skill-modal__title"></h3>
            </div>
            <div class="skill-modal__body">
                <div class="skill-sidebar__level">
                    <span class="skill-sidebar__level-label">Level</span>
                    <span class="skill-sidebar__level-value"></span>
                </div>
                <div class="skill-sidebar__progress">
                    <div class="skill-sidebar__progress-label">
                        <span>Proficiency</span>
                        <span class="skill-sidebar__progress-percentage"></span>
                    </div>
                    <div class="skill-sidebar__progress-bar-container">
                        <div class="skill-sidebar__progress-bar"></div>
                    </div>
                </div>
                <div class="skill-sidebar__experience">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                    <span class="skill-sidebar__experience-text"></span>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(skillModal);

    // Close modal listeners
    skillModal.querySelector('.skill-modal__close').addEventListener('click', hideSkillModal);
    skillModal.addEventListener('click', (e) => {
        if (e.target === skillModal) hideSkillModal();
    });
}

function showSkillModal(skillData) {
    if (!skillModal) return;

    // Populate modal content (reuses sidebar classes)
    skillModal.querySelector('.skill-modal__icon').className = `skill-modal__icon ${skillData.icon}`;
    skillModal.querySelector('.skill-modal__title').textContent = skillData.name;
    skillModal.querySelector('.skill-sidebar__level-value').textContent = skillData.levelLabel;
    skillModal.querySelector('.skill-sidebar__progress-percentage').textContent = Math.round(skillData.proficiency) + '%';
    skillModal.querySelector('.skill-sidebar__progress-bar').style.width = skillData.proficiency + '%';
    skillModal.querySelector('.skill-sidebar__experience-text').textContent = skillData.experience;

    // Show modal
    skillModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function hideSkillModal() {
    if (!skillModal) return;
    skillModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
}

