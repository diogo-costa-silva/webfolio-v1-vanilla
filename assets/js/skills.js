// Skills Module - Modular and data-driven like projects.js

import { getCurrentLanguage } from './language.js';

let translations = {};

export function initSkills() {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSkills);
    } else {
        // Add a small delay to ensure all elements are rendered
        setTimeout(loadSkills, 50);
    }

    // Listen for language changes and re-render
    window.addEventListener('languageChanged', async () => {
        await loadSkills();
    });
}

async function loadTranslations() {
    try {
        const response = await fetch('data/translations.json');
        const data = await response.json();
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
        const response = await fetch('data/skills.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (skillsGrid) {
            renderHomepageSkills(data.categories, skillsGrid);
        }

        if (categoriesGrid) {
            renderSkillsPage(data.categories, categoriesGrid);
            // Initialize interactions after rendering
            setTimeout(() => {
                initSkillInteractions();
            }, 100);
        }
    } catch (error) {
        // Fallback to inline data
        console.error('Error loading skills.json:', error.message);
        const fallbackData = getInlineSkills();

        if (skillsGrid) {
            renderHomepageSkills(fallbackData.categories, skillsGrid);
        }

        if (categoriesGrid) {
            renderSkillsPage(fallbackData.categories, categoriesGrid);
            // Initialize interactions after rendering
            setTimeout(() => {
                initSkillInteractions();
            }, 100);
        }
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
            <i class="skill-item__icon ${iconClass}"></i>
            <span class="skill-item__name">${skill.name}</span>
            <div class="skill-item__progress-mini">
                <div class="skill-item__progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
            <span class="skill-item__experience">${translatedExperience}</span>
        </div>
    `;
}

function translateExperience(experience) {
    if (!experience) return '';

    // Replace "years" with translated version
    const yearsWord = translations['experience.years'] || 'years';
    return experience.replace(/years/gi, yearsWord);
}

function renderDots(level) {
    const totalDots = 5;
    let dots = '';

    for (let i = 1; i <= totalDots; i++) {
        const filled = i <= level ? 'skill-item__dot--filled' : '';
        dots += `<span class="skill-item__dot ${filled}"></span>`;
    }

    return dots;
}

function getIconClass(skillName) {
    // Map skill names to DevIcon classes
    const iconMap = {
        // Languages & Core
        'Python': 'devicon-python-plain colored',
        'JavaScript': 'devicon-javascript-plain colored',
        'Bash': 'devicon-bash-plain',
        'HTML': 'devicon-html5-plain colored',
        'CSS': 'devicon-css3-plain colored',
        'SQL': 'devicon-azuresqldatabase-plain colored',

        // Data Science & Visualization
        'Pandas': 'devicon-pandas-plain colored',
        'NumPy': 'devicon-numpy-plain colored',
        'Matplotlib': 'devicon-matplotlib-plain colored',
        'Seaborn': 'devicon-python-plain colored',
        'Streamlit': 'devicon-streamlit-plain colored',
        'Jupyter Notebooks': 'devicon-jupyter-plain colored',
        'Scikit-learn': 'devicon-scikitlearn-plain colored',

        // Big Data Platforms
        'Apache Spark/PySpark': 'devicon-apachespark-plain colored',
        'Hadoop': 'devicon-hadoop-plain colored',
        'HDFS': 'devicon-hadoop-plain colored',
        'Hive': 'devicon-apache-plain colored',
        'Cloudera Data Platform': 'devicon-hadoop-plain colored',
        'Parquet': 'devicon-apache-plain colored',
        'Delta Lake': 'devicon-azure-plain colored',
        'PostgreSQL': 'devicon-postgresql-plain colored',
        'MongoDB': 'devicon-mongodb-plain colored',
        'SQL Server': 'devicon-microsoftsqlserver-plain colored',

        // Cloud & Infrastructure
        'Microsoft Azure': 'devicon-azure-plain colored',
        'Azure Data Factory': 'devicon-azure-plain colored',
        'Azure Data Lake Storage': 'devicon-azure-plain colored',
        'Linux': 'devicon-linux-plain',
        'Docker': 'devicon-docker-plain colored',
        'Kubernetes': 'devicon-kubernetes-plain colored',
        'Terraform': 'devicon-terraform-plain colored',
        'Ansible': 'devicon-ansible-plain colored',

        // DevOps & Version Control
        'Git': 'devicon-git-plain colored',
        'GitHub': 'devicon-github-original',
        'GitHub Actions': 'devicon-githubactions-plain',
        'Jenkins': 'devicon-jenkins-plain colored',
        'VS Code': 'devicon-vscode-plain colored',

        // Backend & APIs
        'Node.js': 'devicon-nodejs-plain colored',
        'FastAPI': 'devicon-fastapi-plain colored',
        'Flask': 'devicon-flask-original',
        'REST APIs': 'devicon-postman-plain colored'
    };

    return iconMap[skillName] || 'devicon-code-plain';
}

// Fallback inline data
function getInlineSkills() {
    return {
        categories: [
            {
                id: "cloud-infrastructure",
                name: "Cloud & Infrastructure",
                icon: "☁️",
                description: "Cloud platforms and infrastructure automation",
                skills: [
                    {
                        name: "Microsoft Azure",
                        level: 85,
                        experience: "4+ years",
                        techs: ["Data Lake", "HDInsight", "Data Factory"],
                        featured: true
                    },
                    {
                        name: "Terraform",
                        level: 90,
                        experience: "5+ years",
                        techs: ["IaC", "Cloud Automation"],
                        featured: true
                    },
                    {
                        name: "Docker",
                        level: 85,
                        experience: "4+ years",
                        techs: ["Containers", "Docker Compose"],
                        featured: false
                    },
                    {
                        name: "Linux",
                        level: 90,
                        experience: "6+ years",
                        techs: ["Ubuntu", "CentOS", "Bash"],
                        featured: true
                    }
                ]
            },
            {
                id: "big-data",
                name: "Big Data & Analytics",
                icon: "📊",
                description: "Large-scale data processing and analytics platforms",
                skills: [
                    {
                        name: "Apache Spark",
                        level: 85,
                        experience: "4+ years",
                        techs: ["PySpark", "Spark SQL", "Spark Streaming"],
                        featured: true
                    },
                    {
                        name: "Databricks",
                        level: 80,
                        experience: "3+ years",
                        techs: ["Delta Lake", "Unity Catalog", "Notebooks"],
                        featured: true
                    },
                    {
                        name: "Hadoop Ecosystem",
                        level: 75,
                        experience: "3+ years",
                        techs: ["HDFS", "Hive", "HBase", "Impala"],
                        featured: false
                    },
                    {
                        name: "Cloudera Platform",
                        level: 80,
                        experience: "3+ years",
                        techs: ["CDP", "HDP", "Ranger", "Hue"],
                        featured: false
                    }
                ]
            },
            {
                id: "programming",
                name: "Programming & Development",
                icon: "💻",
                description: "Programming languages and development frameworks",
                skills: [
                    {
                        name: "Python",
                        level: 90,
                        experience: "6+ years",
                        techs: ["Pandas", "NumPy", "FastAPI", "Jupyter"],
                        featured: true
                    },
                    {
                        name: "SQL & Databases",
                        level: 85,
                        experience: "5+ years",
                        techs: ["T-SQL", "MySQL", "PostgreSQL", "Query Optimization"],
                        featured: false
                    },
                    {
                        name: "JavaScript",
                        level: 75,
                        experience: "3+ years",
                        techs: ["Node.js", "ES6+", "REST APIs"],
                        featured: false
                    },
                    {
                        name: "Shell Scripting",
                        level: 85,
                        experience: "5+ years",
                        techs: ["Bash", "PowerShell", "Zsh"],
                        featured: false
                    }
                ]
            },
            {
                id: "data-engineering",
                name: "Data Engineering",
                icon: "⚙️",
                description: "Data pipelines and ETL/ELT processes",
                skills: [
                    {
                        name: "ETL/ELT Pipelines",
                        level: 85,
                        experience: "4+ years",
                        techs: ["Apache Airflow", "Data Factory", "Custom Python"],
                        featured: false
                    },
                    {
                        name: "Data Processing",
                        level: 80,
                        experience: "4+ years",
                        techs: ["Pandas", "PySpark", "Stream Processing"],
                        featured: false
                    },
                    {
                        name: "Data Modeling",
                        level: 75,
                        experience: "3+ years",
                        techs: ["Dimensional Modeling", "Star Schema", "Data Vault"],
                        featured: false
                    },
                    {
                        name: "Data Quality",
                        level: 80,
                        experience: "3+ years",
                        techs: ["Great Expectations", "Data Validation", "Testing"],
                        featured: false
                    }
                ]
            },
            {
                id: "devops",
                name: "DevOps & Automation",
                icon: "🔄",
                description: "CI/CD, automation, and operational excellence",
                skills: [
                    {
                        name: "CI/CD",
                        level: 80,
                        experience: "4+ years",
                        techs: ["GitHub Actions", "Jenkins", "GitLab CI"],
                        featured: false
                    },
                    {
                        name: "Version Control",
                        level: 90,
                        experience: "6+ years",
                        techs: ["Git", "GitHub", "Git Flow"],
                        featured: false
                    },
                    {
                        name: "Monitoring & Logging",
                        level: 75,
                        experience: "3+ years",
                        techs: ["Prometheus", "Grafana", "ELK Stack"],
                        featured: false
                    },
                    {
                        name: "Automation",
                        level: 85,
                        experience: "5+ years",
                        techs: ["Ansible", "Python Scripts", "Cron Jobs"],
                        featured: false
                    }
                ]
            },
            {
                id: "databases",
                name: "Databases & Storage",
                icon: "🗄️",
                description: "Relational, NoSQL, and data storage solutions",
                skills: [
                    {
                        name: "Relational Databases",
                        level: 85,
                        experience: "5+ years",
                        techs: ["SQL Server", "MySQL", "PostgreSQL"],
                        featured: false
                    },
                    {
                        name: "NoSQL",
                        level: 70,
                        experience: "2+ years",
                        techs: ["MongoDB", "HBase", "Document Stores"],
                        featured: false
                    },
                    {
                        name: "Data Lakes",
                        level: 80,
                        experience: "3+ years",
                        techs: ["Azure Data Lake", "Delta Lake", "Parquet"],
                        featured: false
                    },
                    {
                        name: "Database Design",
                        level: 75,
                        experience: "4+ years",
                        techs: ["Normalization", "Indexing", "Performance Tuning"],
                        featured: false
                    }
                ]
            }
        ]
    };
}

// ============================================
// Skill Interactions (Modal Only)
// ============================================

let skillModal = null;

// Initialize skill interactions after DOM is ready
export function initSkillInteractions() {
    // Create modal element if on skills page
    if (document.querySelector('.skills-categories__grid')) {
        createModalElement();
        attachSkillItemListeners();
    }
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

function attachSkillItemListeners() {
    // Re-attach listeners after DOM updates
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach(item => {
        // Remove old listeners by cloning (prevents duplicates)
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);

        // All devices: Click to open modal
        newItem.addEventListener('click', () => {
            const skillData = JSON.parse(newItem.getAttribute('data-skill'));
            showSkillModal(skillData);
        });
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

// Re-attach listeners when language changes or content updates
window.addEventListener('languageChanged', () => {
    setTimeout(attachSkillItemListeners, 100);
});

// Re-attach listeners on window resize (for responsive behavior)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(attachSkillItemListeners, 300);
});