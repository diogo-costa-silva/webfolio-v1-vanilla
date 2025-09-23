// Skills Module

export function initSkills() {
    loadSkills();
    initSkillAnimations();
}

function loadSkills() {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;

    const skills = [
        { name: 'Infrastructure as Code', icon: '🏗️', level: 85, techs: ['Terraform', 'Azure', 'Databricks', 'Docker'] },
        { name: 'Big Data Platforms', icon: '📊', level: 80, techs: ['Hadoop', 'Spark', 'Hive', 'Delta Lake'] },
        { name: 'Linux & Automation', icon: '🐧', level: 90, techs: ['Linux Admin', 'Ansible', 'Bash', 'PowerShell'] },
        { name: 'Programming Languages', icon: '💻', level: 85, techs: ['Python', 'JavaScript', 'SQL', 'Zsh'] },
        { name: 'Data Engineering', icon: '⚙️', level: 75, techs: ['Pandas', 'Jupyter', 'Zeppelin', 'ETL'] },
        { name: 'Cloud Platforms', icon: '☁️', level: 80, techs: ['Azure', 'Cloudera CDP', 'Ranger', 'Hue'] },
        { name: 'Database Systems', icon: '🗄️', level: 75, techs: ['SQL Server', 'MySQL', 'ODBC', 'Data Modeling'] },
        { name: 'DevOps Practices', icon: '🔄', level: 85, techs: ['CI/CD', 'Jira', 'Confluence', 'Git'] },
        { name: 'Data Visualization', icon: '📈', level: 70, techs: ['Matplotlib', 'Seaborn', 'Plotly', 'Dashboards'] },
        { name: 'Web Development', icon: '🌐', level: 75, techs: ['Node.js', 'HTML/CSS', 'REST APIs', 'Frontend'] }
    ];

    // Show only 6 skills on homepage, all on skills page
    const skillsToShow = window.location.pathname.includes('skills.html') ? skills : skills.slice(0, 6);

    skillsGrid.innerHTML = skillsToShow.map(skill => `
        <div class="skill-card reveal">
            <div class="skill-card__icon">${skill.icon}</div>
            <h3 class="skill-card__title">${skill.name}</h3>
            <div class="skill-card__techs">
                ${skill.techs.map(tech => `<span class="card__tag">${tech}</span>`).join('')}
            </div>
            <div class="skill-card__level">
                <div class="skill-card__progress">
                    <div class="skill-card__progress-bar" data-level="${skill.level}"></div>
                </div>
                <span>${skill.level}%</span>
            </div>
        </div>
    `).join('');
}

function initSkillAnimations() {
    const progressBars = document.querySelectorAll('.skill-card__progress-bar');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.dataset.level;
                setTimeout(() => {
                    bar.style.width = `${level}%`;
                }, 200);
                observer.unobserve(bar);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}