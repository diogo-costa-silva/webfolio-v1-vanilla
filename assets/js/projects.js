// Projects Module

export function initProjects() {
    loadProjects();
    initProjectFilters();
}

function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid') || document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    const projects = [
        {
            title: 'Azure Infrastructure Automation',
            category: 'devops',
            description: 'Automated cloud infrastructure provisioning using Terraform for Azure resources including Databricks clusters, app registrations, and secret management. Reduced deployment time by 70%.',
            image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop',
            tags: ['Terraform', 'Azure', 'Databricks', 'IaC'],
            demo: '#',
            github: 'https://github.com/diogo-costa-silva'
        },
        {
            title: 'REV@CONSTRUCTION Data Platform',
            category: 'data',
            description: 'Big Data platform for processing road pavement sensor data. Built Hadoop cluster (1 master, 3 workers) and implemented Delta Lake architecture for efficient data ingestion and analysis.',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
            tags: ['Hadoop', 'Python', 'Delta Lake', 'Spark'],
            demo: '#',
            github: 'https://github.com/diogo-costa-silva'
        },
        {
            title: 'Cloudera Platform Configuration',
            category: 'devops',
            description: 'Enterprise-scale data platform setup with Cloudera, implementing schemas in Hue and access policies in Ranger across development, staging, and production environments.',
            image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop',
            tags: ['Cloudera', 'Hue', 'Ranger', 'Big Data'],
            demo: '#',
            github: 'https://github.com/diogo-costa-silva'
        },
        {
            title: 'Linux System Automation',
            category: 'automation',
            description: 'Comprehensive automation suite for Linux system administration using Ansible playbooks and Bash scripts, managing user permissions, file systems, and scheduled tasks.',
            image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=500&fit=crop',
            tags: ['Ansible', 'Bash', 'Linux', 'Automation'],
            demo: '#',
            github: 'https://github.com/diogo-costa-silva'
        },
        {
            title: 'PHC AI Module Research',
            category: 'ai',
            description: 'Research project analyzing PHC ERP AI capabilities for business automation. Identified key use cases for client data processing and automated workflow optimization.',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
            tags: ['AI', 'ERP', 'Research', 'Business Intelligence'],
            demo: '#',
            github: 'https://github.com/diogo-costa-silva'
        },
        {
            title: 'Data Pipeline Automation',
            category: 'data',
            description: 'Automated ETL pipeline for sensor data processing using Python, PowerShell, and SFTP. Implemented bronze-silver-gold architecture in Delta Lake for data quality management.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
            tags: ['Python', 'PowerShell', 'SFTP', 'ETL'],
            demo: '#',
            github: 'https://github.com/diogo-costa-silva'
        },
        {
            title: 'Infrastructure Monitoring Dashboard',
            category: 'devops',
            description: 'Real-time monitoring solution for cloud infrastructure health, resource utilization, and cost optimization. Integrated with Azure Monitor and custom alerting systems.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
            tags: ['Azure Monitor', 'Python', 'Dashboard', 'DevOps'],
            demo: '#',
            github: 'https://github.com/diogo-costa-silva'
        },
        {
            title: 'ODBC Connection Manager',
            category: 'automation',
            description: 'Enterprise tool for managing ODBC connections across multiple environments, troubleshooting connection errors, and automating database access configuration.',
            image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=500&fit=crop',
            tags: ['SQL Server', 'ODBC', 'Python', 'Database'],
            demo: '#',
            github: 'https://github.com/diogo-costa-silva'
        }
    ];

    // Only show 4 projects on homepage
    const projectsToShow = window.location.pathname.includes('projects.html') ? projects : projects.slice(0, 4);

    projectsGrid.innerHTML = projectsToShow.map(project => `
        <div class="project-card reveal" data-category="${project.category}">
            <img src="${project.image}" alt="${project.title}" class="project-card__image">
            <div class="project-card__content">
                <span class="card__category">${project.category}</span>
                <h3 class="card__title">${project.title}</h3>
                <p class="card__description">${project.description}</p>
                <div class="card__tags">
                    ${project.tags.map(tag => `<span class="card__tag">${tag}</span>`).join('')}
                </div>
                <div class="card__actions">
                    <a href="${project.demo}" class="btn btn--primary btn--small">Live Demo</a>
                    <a href="${project.github}" class="btn btn--secondary btn--small">GitHub</a>
                </div>
            </div>
        </div>
    `).join('');
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-tag');
    const searchInput = document.querySelector('.filters__search');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter projects
                const filter = button.dataset.filter;
                filterProjects(filter);
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchProjects(e.target.value.toLowerCase());
        });
    }
}

function filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            card.classList.add('fade-in-up');
        } else {
            card.style.display = 'none';
        }
    });
}

function searchProjects(searchTerm) {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const title = card.querySelector('.card__title').textContent.toLowerCase();
        const description = card.querySelector('.card__description').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.card__tag')).map(tag => tag.textContent.toLowerCase());

        if (title.includes(searchTerm) || description.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm))) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}