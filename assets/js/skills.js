// Skills Module - Modular and data-driven like projects.js

export function initSkills() {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSkills);
    } else {
        // Add a small delay to ensure all elements are rendered
        setTimeout(loadSkills, 50);
    }
}

async function loadSkills() {
    const skillsGrid = document.querySelector('.skills-grid');
    const categoriesGrid = document.querySelector('.skills-categories__grid');

    if (!skillsGrid && !categoriesGrid) return;

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
        }
    }
}

function renderHomepageSkills(categories, container) {
    // Extract featured skills from all categories
    const featuredSkills = [];

    categories.forEach(category => {
        category.skills.forEach(skill => {
            if (skill.featured) {
                featuredSkills.push({
                    ...skill,
                    categoryIcon: category.icon,
                    categoryName: category.name
                });
            }
        });
    });

    // Take first 6 featured skills
    const skillsToShow = featuredSkills.slice(0, 6);

    container.innerHTML = skillsToShow.map(skill => {
        const iconClass = getIconClass(skill.name);
        const dotsHTML = renderDots(skill.level);

        return `
            <div class="card card--hoverable">
                <div class="card__header">
                    <i class="skill-item__icon ${iconClass}"></i>
                </div>
                <div class="card__content">
                    <h3 class="card__title">${skill.name}</h3>
                    <div class="skill-item__level" style="justify-content: center;">
                        <div class="skill-item__dots">
                            ${dotsHTML}
                        </div>
                        <span class="skill-item__experience">${skill.experience}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderSkillsPage(categories, container) {
    if (!categories || categories.length === 0) {
        container.innerHTML = '<p>No skills data available.</p>';
        return;
    }

    const html = categories.map(category => `
        <div class="skill-category">
            <div class="skill-category__header">
                <span class="skill-category__icon">${category.icon}</span>
                <div>
                    <h2 class="skill-category__title">${category.name}</h2>
                    <p class="skill-category__description">${category.description}</p>
                </div>
            </div>
            <div class="skill-category__skills">
                ${category.skills.map(skill => renderSkillItem(skill)).join('')}
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function renderSkillItem(skill) {
    const iconClass = getIconClass(skill.name);
    const dotsHTML = renderDots(skill.level);

    return `
        <div class="skill-item">
            <i class="skill-item__icon ${iconClass}"></i>
            <div class="skill-item__content">
                <span class="skill-item__name">${skill.name}</span>
                <div class="skill-item__level">
                    <div class="skill-item__dots">
                        ${dotsHTML}
                    </div>
                    <span class="skill-item__experience">${skill.experience}</span>
                </div>
            </div>
        </div>
    `;
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
        'Apache Spark': 'devicon-apachespark-plain colored',
        'PySpark': 'devicon-apachespark-plain colored',
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